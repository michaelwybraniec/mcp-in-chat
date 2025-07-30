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
export declare const generalRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Stricter rate limiter for authentication endpoints
 * 10 requests per hour per IP address
 */
export declare const authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Purchase endpoint rate limiter
 * 5 requests per hour per IP address (more restrictive for financial operations)
 */
export declare const purchaseRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Email endpoint rate limiter
 * 20 requests per hour per IP address
 */
export declare const emailRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Development rate limiter (more lenient for testing)
 * 1000 requests per hour per IP address
 */
export declare const developmentRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Get appropriate rate limiter based on environment
 */
export declare const getRateLimiter: () => import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rate-limit.d.ts.map