// backend\src\config\upstash.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redisEnv = Redis.fromEnv();

// API Limiter
export const apiRatelimit = new Ratelimit({
  redis: redisEnv,
  limiter: Ratelimit.slidingWindow(100, "15 m"), // 100 requests per 15 minutes
  prefix: "rl:api", // key prefix in Redis — helps find keys in Upstash console
});

// Auth Limiter
export const authRateLimit = new Ratelimit({
  redis: redisEnv,
  limiter: Ratelimit.slidingWindow(10, "15 m"), // 10 requests per 15 minutes
  prefix: "rl:auth",
});