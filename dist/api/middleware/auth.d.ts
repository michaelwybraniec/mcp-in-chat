import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
        permissions: string[];
    };
}
/**
 * Mock authentication middleware for demo purposes
 * Checks for "demo-key" header to simulate API key validation
 */
export declare const authenticateApiKey: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Optional authentication middleware for endpoints that can work without auth
 */
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Role-based access control middleware
 */
export declare const requireRole: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Permission-based access control middleware
 */
export declare const requirePermission: (permissions: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map