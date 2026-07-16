import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "apnadoodh_super_secret_key_123456";

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

export async function signJWT(payload: any, expiresInSeconds?: number): Promise<string> {
  const exp = expiresInSeconds ? Math.floor(Date.now() / 1000) + expiresInSeconds : undefined;
  const fullPayload = exp ? { ...payload, exp } : payload;

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const tokenInput = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(tokenInput);
  const signature = hmac.digest();
  
  const encodedSignature = signature
    .toString("base64")
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

    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(tokenInput);
    const expectedSignature = hmac.digest()
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    if (signature !== expectedSignature) return null;

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch (e) {
    return null;
  }
}
