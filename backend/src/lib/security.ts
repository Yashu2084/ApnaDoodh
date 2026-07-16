const rateLimitMap = new Map<string, number[]>();

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

export async function isRateLimited(
  ip: string,
  endpointKey: string,
  maxRequests = 5,
  windowSizeSeconds = 60
): Promise<boolean> {
  const key = `${ip}:${endpointKey}`;
  const now = Date.now();
  const windowMs = windowSizeSeconds * 1000;

  let timestamps = rateLimitMap.get(key) || [];
  timestamps = timestamps.filter(t => now - t < windowMs);
  
  if (timestamps.length >= maxRequests) {
    rateLimitMap.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return false;
}

export function sanitizeInput<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === "string") {
    return input
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/'/g, "''")
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
