import { NextRequest, NextResponse } from "next/server";

// Rate limiting in-memory storage (sliding-window)
const rateLimitMap = new Map<string, number[]>();

// Clean up old timestamps periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const validTimestamps = timestamps.filter(t => now - t < 60000);
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, validTimestamps);
      }
    }
  }, 30000);
}

/**
 * 1. Sliding Window Rate Limiting (Part 9.3)
 * Limits IP to maxRequests per windowSizeSeconds
 */
export async function isRateLimited(
  ip: string,
  endpointKey: string,
  maxRequests = 5,
  windowSizeSeconds = 60
): Promise<boolean> {
  // Check Redis first if available
  try {
    const redisClient = eval("require")("../redis")?.redisClient;
    if (redisClient && typeof redisClient.isRateLimited === "function") {
      return await redisClient.isRateLimited(ip, endpointKey, maxRequests, windowSizeSeconds);
    }
  } catch {}

  const key = `${ip}:${endpointKey}`;
  const now = Date.now();
  const windowMs = windowSizeSeconds * 1000;

  let timestamps = rateLimitMap.get(key) || [];
  
  // Filter out timestamps outside sliding window
  timestamps = timestamps.filter(t => now - t < windowMs);
  
  if (timestamps.length >= maxRequests) {
    rateLimitMap.set(key, timestamps); // save filtered
    return true; // Rate limited (Block)
  }

  // Record new request timestamp
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return false; // Allowed
}

/**
 * 2. Strict CORS Policy Header Enforcement (Part 9.3)
 */
export function applyCorsHeaders(req: NextRequest, res: NextResponse): NextResponse {
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
  const origin = req.headers.get("origin");

  // Only allow origin matching the frontend domain
  if (origin === allowedOrigin || (origin && origin.startsWith("http://localhost:"))) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }

  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  
  return res;
}

/**
 * 3. Request Input Sanitization (Part 9.4)
 * Recursively cleans incoming inputs to prevent XSS (HTML stripping) and SQLi
 */
export function sanitizeInput<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === "string") {
    // Escape SQL & HTML XSS Tags
    return input
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // strip script tag blocks
      .replace(/<\/?[^>]+(>|$)/g, "") // strip raw HTML tags
      .replace(/'/g, "''") // escape single quotes for SQL safety
      .trim() as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item)) as unknown as T;
  }

  if (typeof input === "object") {
    const sanitizedObj: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitizedObj[key] = sanitizeInput((input as any)[key]);
      }
    }
    return sanitizedObj as T;
  }

  return input;
}
