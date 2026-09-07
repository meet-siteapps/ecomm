import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ApiError } from '../types/index.js';

/**
 * Helper factory to create standardized Express rate limiters matching the ApiError envelope.
 */
function createRateLimiter(
  windowMs: number,
  max: number,
  message: string,
  code = 'TOO_MANY_REQUESTS',
) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      const body: ApiError = {
        status: 'error',
        message,
        code,
      };
      res.status(429).json(body);
    },
  });
}

/**
 * General rate limiter: 100 requests per 15 minutes per IP.
 * Applied globally to all API routes.
 */
export const generalLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again after 15 minutes.',
  'RATE_LIMIT_EXCEEDED',
);

/**
 * Auth rate limiter: 10 requests per 15 minutes per IP.
 * Applied to auth endpoints to prevent brute-force or profile spam.
 */
export const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication requests from this IP, please try again after 15 minutes.',
  'AUTH_RATE_LIMIT_EXCEEDED',
);

/**
 * Write rate limiter: 20 requests per 15 minutes per IP.
 * Applied to POST/PUT/PATCH/DELETE mutation endpoints (orders, payments, admin writes).
 */
export const writeLimiter = createRateLimiter(
  15 * 60 * 1000,
  20,
  'Too many write requests from this IP, please try again after 15 minutes.',
  'WRITE_RATE_LIMIT_EXCEEDED',
);
