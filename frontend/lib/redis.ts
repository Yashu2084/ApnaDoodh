// In-memory fallback TTL Cache
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

// Periodic memory cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryCache.entries()) {
      if (now > entry.expiresAt) {
        memoryCache.delete(key);
      }
    }
  }, 60000); // clean every minute
}

let redisClientInstance: any = null;

// Dual-Mode connection logic
if (process.env.REDIS_URL) {
  try {
    const Redis = eval("require")("ioredis");
    redisClientInstance = new Redis(process.env.REDIS_URL);
  } catch (e) {
    console.warn("⚠️ Redis package (ioredis) not installed or connection failed, using local memory cache.", e);
  }
}

export const redisCache = {
  /**
   * GET key from cache
   */
  async get(key: string): Promise<any | null> {
    if (redisClientInstance) {
      try {
        const val = await redisClientInstance.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        console.error("Redis GET error:", err);
      }
    }

    // Memory Fallback
    const entry = memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    try {
      return JSON.parse(entry.value);
    } catch {
      return null;
    }
  },

  /**
   * SET key in cache with TTL
   */
  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    const serialized = JSON.stringify(value);

    if (redisClientInstance) {
      try {
        await redisClientInstance.set(key, serialized, "EX", ttlSeconds);
        return;
      } catch (err) {
        console.error("Redis SET error:", err);
      }
    }

    // Memory Fallback
    memoryCache.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  },

  /**
   * DELETE key from cache
   */
  async del(key: string): Promise<void> {
    if (redisClientInstance) {
      try {
        await redisClientInstance.del(key);
        return;
      } catch (err) {
        console.error("Redis DEL error:", err);
      }
    }

    // Memory Fallback
    memoryCache.delete(key);
  },

  /**
   * CLEAR keys matching pattern (used during invalidate)
   */
  async invalidatePattern(pattern: string): Promise<void> {
    if (redisClientInstance) {
      try {
        const keys = await redisClientInstance.keys(pattern);
        if (keys.length > 0) {
          await redisClientInstance.del(...keys);
        }
        return;
      } catch (err) {
        console.error("Redis Pattern Invalidation error:", err);
      }
    }

    // Memory Invalidation: scan keys
    const matchStr = pattern.replace("*", "");
    for (const key of memoryCache.keys()) {
      if (key.includes(matchStr)) {
        memoryCache.delete(key);
      }
    }
  }
};
