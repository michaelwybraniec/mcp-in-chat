import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Invalid input data',
      details: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined
      }))
    });
  }
  
  return next();
};

/**
 * Validation rules for boiler info endpoint
 */
export const validateBoilerInfo = [
  query('customer_id')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Customer ID must be a string between 1 and 50 characters'),
  handleValidationErrors
];

/**
 * Validation rules for maintenance GET endpoint
 */
export const validateMaintenanceGet = [
  query('customer_id')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Customer ID must be a string between 1 and 50 characters'),
  handleValidationErrors
];

/**
 * Validation rules for maintenance POST endpoint
 */
export const validateMaintenancePost = [
  body('customer_id')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Customer ID must be a string between 1 and 50 characters'),
  body('service_date')
    .optional()
    .isISO8601()
    .withMessage('Service date must be a valid ISO 8601 date'),
  body('service_type')
    .optional()
    .isIn(['annual', 'emergency', 'repair', 'inspection'])
    .withMessage('Service type must be one of: annual, emergency, repair, inspection'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be a string with maximum 500 characters'),
  handleValidationErrors
];

/**
 * Validation rules for purchase endpoint
 */
export const validatePurchase = [
  body('customer_id')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Customer ID must be a string between 1 and 50 characters'),
  body('boiler_model')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Boiler model must be a string between 1 and 100 characters'),
  body('payment_info')
    .isObject()
    .withMessage('Payment info must be an object'),
  body('payment_info.method')
    .isIn(['credit_card', 'bank_transfer', 'finance', 'cash'])
    .withMessage('Payment method must be one of: credit_card, bank_transfer, finance, cash'),
  body('payment_info.amount')
    .isFloat({ min: 0 })
    .withMessage('Payment amount must be a positive number'),
  body('installation_date')
    .optional()
    .isISO8601()
    .withMessage('Installation date must be a valid ISO 8601 date'),
  handleValidationErrors
];

/**
 * Validation rules for email endpoint
 */
export const validateEmail = [
  body('to_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('To email must be a valid email address'),
  body('subject')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be a string between 1 and 200 characters'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be a string between 1 and 2000 characters'),
  handleValidationErrors
];

/**
 * Generic validation for customer ID parameter
 */
export const validateCustomerId = [
  param('customer_id')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Customer ID must be a string between 1 and 50 characters'),
  handleValidationErrors
];

/**
 * Generic validation for order ID parameter
 */
export const validateOrderId = [
  param('order_id')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Order ID must be a string between 1 and 50 characters'),
  handleValidationErrors
];

/**
 * Validation for pagination query parameters
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  handleValidationErrors
];

/**
 * Validation for date range query parameters
 */
export const validateDateRange = [
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  handleValidationErrors
]; 