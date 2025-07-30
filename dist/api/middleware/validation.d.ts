import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to handle validation errors
 */
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Validation rules for boiler info endpoint
 */
export declare const validateBoilerInfo: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Validation rules for maintenance GET endpoint
 */
export declare const validateMaintenanceGet: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Validation rules for maintenance POST endpoint
 */
export declare const validateMaintenancePost: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Validation rules for purchase endpoint
 */
export declare const validatePurchase: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Validation rules for email endpoint
 */
export declare const validateEmail: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Generic validation for customer ID parameter
 */
export declare const validateCustomerId: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Generic validation for order ID parameter
 */
export declare const validateOrderId: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Validation for pagination query parameters
 */
export declare const validatePagination: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
/**
 * Validation for date range query parameters
 */
export declare const validateDateRange: (((req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>) | import("express-validator").ValidationChain)[];
//# sourceMappingURL=validation.d.ts.map