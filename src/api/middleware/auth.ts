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
export const authenticateApiKey = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  // For demo purposes, accept "demo-key" as valid
  if (apiKey === 'demo-key' || apiKey === 'Bearer demo-key') {
    // Mock user data for demo
    req.user = {
      id: 'demo-user-001',
      role: 'customer',
      permissions: ['read:boiler', 'read:maintenance', 'write:maintenance', 'write:purchase', 'write:email']
    };
    return next();
  }
  
  // Check if it's a health check or public endpoint
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }
  
  // Return 401 for invalid/missing API key
  return res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message: 'Valid API key required. Use "demo-key" for demo access.',
    code: 'INVALID_API_KEY'
  });
};

/**
 * Optional authentication middleware for endpoints that can work without auth
 */
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  if (apiKey === 'demo-key' || apiKey === 'Bearer demo-key') {
    req.user = {
      id: 'demo-user-001',
      role: 'customer',
      permissions: ['read:boiler', 'read:maintenance', 'write:maintenance', 'write:purchase', 'write:email']
    };
  }
  
  return next();
};

/**
 * Role-based access control middleware
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }
    
    return next();
  };
};

/**
 * Permission-based access control middleware
 */
export const requirePermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    const hasPermission = permissions.every(permission => 
      req.user!.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Required permissions: ${permissions.join(', ')}`
      });
    }
    
    return next();
  };
}; 