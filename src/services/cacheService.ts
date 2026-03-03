import Redis from "ioredis";
import { config } from "../config";
import type { WeatherData } from "../types";

const redis = new Redis(config.redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

redis.on("error", (err: Error) => {
  console.error("[Redis] connection error:", err.message);
});

export async function getCached(city: string): Promise<WeatherData | null> {
  try {
    const value = await redis.get(city);
    if (!value) return null;
    return JSON.parse(value) as WeatherData;
  } catch (err) {
    console.error("[Redis] get error:", (err as Error).message);
    return null;
  }
}

export async function setCached(
  city: string,
  data: WeatherData,
  ttl = config.cacheTtlSeconds
): Promise<void> {
  try {
    await redis.set(city, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.error("[Redis] set error:", (err as Error).message);
  }
}

export async function closeRedis(): Promise<void> {
  await redis.quit();
}
