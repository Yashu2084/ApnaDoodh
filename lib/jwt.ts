const SECRET = process.env.JWT_SECRET || "apnadoodh_super_secret_key_123456";

function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(escape(atob(base64)));
}

export async function signJWT(payload: any, expiresInSeconds?: number): Promise<string> {
  const exp = expiresInSeconds ? Math.floor(Date.now() / 1000) + expiresInSeconds : undefined;
  const fullPayload = exp ? { ...payload, exp } : payload;

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const tokenInput = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(tokenInput));
  
  // Base64Url encode signature
  const sigArray = Array.from(new Uint8Array(signature));
  const sigString = sigArray.map(b => String.fromCharCode(b)).join("");
  const encodedSignature = btoa(sigString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${tokenInput}.${encodedSignature}`;
}

export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const tokenInput = `${header}.${payload}`;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECRET);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["verify"]
    );

    // Decode signature
    const base64Sig = signature.replace(/-/g, "+").replace(/_/g, "/");
    const sigString = atob(base64Sig);
    const sigData = new Uint8Array(sigString.length);
    for (let i = 0; i < sigString.length; i++) {
      sigData[i] = sigString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigData, encoder.encode(tokenInput));
    if (!isValid) return null;

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }

    return decodedPayload;
  } catch (e) {
    return null;
  }
}
