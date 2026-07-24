// backend\src\middleware\rateLimiter.js
import { apiRatelimit, authRateLimit } from "../config/upstash.js";

// 1. API Rate Limiter
export const apiLimiter = async (req, res, next) => {
  try {
    // Use client's IP as unique identifier so that we'll know some requests are coming from one user when they're sent by one IP
    // req.ip gives the IP address of each requester
    const identifier = req.ip;
    const { success, limit, reset, remaining } = await apiRatelimit.limit(identifier);

    // Set standard rate limit headers so clients know their state statuses
    res.setHeader('RateLimit-Limit', limit);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', reset);

    // If not success, send 429 error
    if (!success) {
      return res.status(429).json({
        success: false,
        message: "Too many request, try again later."
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiting error", error);
    next(error);
  }
};


// 2. Auth Rate Limiter (e.g. login)
export const authLimiter = async (req, res, next) => {
  try {
    // Similar setup as apiLimiter, only change the limiter used 
    // Use client's IP as unique identifier so that we'll know some requests are coming from one user when they're sent by one IP
    // req.ip gives the IP address of each requester
    const identifier = req.ip;
    const { success, limit, reset, remaining } = await authRateLimit.limit(identifier);

    // Set standard rate limit headers so clients know their state statuses
    res.setHeader('RateLimit-Limit', limit);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', reset);

    // If not success, send 429 error
    if (!success) {
      return res.status(429).json({
        success: false,
        message: "Too many request, try again later."
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}