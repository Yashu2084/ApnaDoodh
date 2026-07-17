import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("apnadoodh_token")?.value;
    let payload = token ? await verifyJWT(token) : null;
    let refreshed = false;
    let newAccessToken = "";

    // If access token is expired or missing, try silent refresh
    if (!payload) {
      const refreshToken = request.cookies.get("apnadoodh_refresh")?.value;
      if (refreshToken) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://apnadoodh.onrender.com";
          const refreshRes = await fetch(`${apiUrl}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data.success) {
              payload = data.user;
              newAccessToken = data.accessToken;
              refreshed = true;
            }
          }
        } catch (e) {
          console.error("Silent token refresh failed in middleware", e);
        }
      }
    }

    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("apnadoodh_token");
      response.cookies.delete("apnadoodh_refresh");
      return response;
    }

    const role = payload.role;
    let response: NextResponse | null = null;

    if (role === "CUSTOMER") {
      if (pathname !== "/dashboard/customer") {
        response = NextResponse.redirect(new URL("/dashboard/customer", request.url));
      }
    } else if (role === "FARMER") {
      if (pathname !== "/dashboard/farmer") {
        response = NextResponse.redirect(new URL("/dashboard/farmer", request.url));
      }
    } else if (role === "SUPER_ADMIN") {
      if (pathname !== "/dashboard/admin") {
        response = NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    } else {
      const resp = NextResponse.redirect(new URL("/login", request.url));
      resp.cookies.delete("apnadoodh_token");
      resp.cookies.delete("apnadoodh_refresh");
      return resp;
    }

    if (!response) {
      response = NextResponse.next();
    }

    // If token was silently refreshed, append cookie to the response
    if (refreshed && newAccessToken) {
      response.cookies.set("apnadoodh_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 900, // 15 mins
        path: "/",
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
