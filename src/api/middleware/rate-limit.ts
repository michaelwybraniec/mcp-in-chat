import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Extend Request interface to include rateLimit property
declare module 'express' {
  interface Request {
    rateLimit?: {
      resetTime: number;
    };
  }
}

/**
 * General rate limiter for all API endpoints
 * 100 requests per hour per IP address
 */
export const generalRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Rate limit exceeded. Maximum 100 requests per hour.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 3600)
    });
  }
});

/**
 * Stricter rate limiter for authentication endpoints
 * 10 requests per hour per IP address
 */
export const authRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts',
    message: 'Authentication rate limit exceeded. Maximum 10 attempts per hour.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts',
      message: 'Authentication rate limit exceeded. Please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 3600)
    });
  }
});

/**
 * Purchase endpoint rate limiter
 * 5 requests per hour per IP address (more restrictive for financial operations)
 */
export const purchaseRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many purchase attempts',
    message: 'Purchase rate limit exceeded. Maximum 5 attempts per hour.',
    code: 'PURCHASE_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many purchase attempts',
      message: 'Purchase rate limit exceeded. Please try again later.',
      code: 'PURCHASE_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 3600)
    });
  }
});

/**
 * Email endpoint rate limiter
 * 20 requests per hour per IP address
 */
export const emailRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    error: 'Too many email requests',
    message: 'Email rate limit exceeded. Maximum 20 requests per hour.',
    code: 'EMAIL_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many email requests',
      message: 'Email rate limit exceeded. Please try again later.',
      code: 'EMAIL_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 3600)
    });
  }
});

/**
 * Development rate limiter (more lenient for testing)
 * 1000 requests per hour per IP address
 */
export const developmentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: 'Development rate limit exceeded',
    message: 'Development rate limit exceeded. Maximum 1000 requests per hour.',
    code: 'DEV_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Development rate limit exceeded',
      message: 'Development rate limit exceeded. Please try again later.',
      code: 'DEV_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 3600)
    });
  }
});

/**
 * Get appropriate rate limiter based on environment
 */
export const getRateLimiter = () => {
  if (process.env.NODE_ENV === 'development') {
    return developmentRateLimit;
  }
  return generalRateLimit;
}; 