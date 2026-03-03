import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env["PORT"] ?? "3000", 10),
  visualCrossingApiKey: requireEnv("VISUAL_CROSSING_API_KEY"),
  redisUrl: process.env["REDIS_URL"] ?? "redis://localhost:6379",
  rateLimitWindowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] ?? "900000", 10),
  rateLimitMax: parseInt(process.env["RATE_LIMIT_MAX"] ?? "100", 10),
  cacheTtlSeconds: 12 * 60 * 60, // 12 hours
};
