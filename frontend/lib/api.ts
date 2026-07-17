export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cmrn8qsu627kxx4dt8m4guunj.sin.prisma.build";

// Helper to read client-side cookie if needed
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper to write client-side cookie if needed
export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const isProd = process.env.NODE_ENV === "production";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${isProd ? "; Secure" : ""}`;
}

export function eraseCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * apiFetch: A drop-in replacement for window.fetch that routes requests
 * to the external Express backend and handles session token headers.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = path.startsWith("/api") ? `${API_URL}${path}` : path;

  // Clone headers
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Read access token client-side if available to inject Bearer Header
  const clientToken = getCookie("apnadoodh_token");
  if (clientToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${clientToken}`);
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Ensures cookies are sent in cross-origin requests
  };

  let response = await fetch(url, mergedOptions);

  // Auto-refresh token on 401 Unauthorized
  if (response.status === 401 && path !== "/api/auth/login" && path !== "/api/auth/refresh") {
    const refreshToken = getCookie("apnadoodh_refresh");
    if (refreshToken) {
      try {
        const refreshUrl = `${API_URL}/api/auth/refresh`;
        const refreshRes = await fetch(refreshUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (data.success && data.accessToken) {
            // Save new cookies client side
            setCookie("apnadoodh_token", data.accessToken, 900); // 15 mins
            
            // Retry the original request with the new access token
            headers.set("Authorization", `Bearer ${data.accessToken}`);
            response = await fetch(url, {
              ...options,
              headers,
              credentials: "include",
            });
          }
        }
      } catch (err) {
        console.error("Token silent refresh failed in api-client", err);
      }
    }
  }

  return response;
}
