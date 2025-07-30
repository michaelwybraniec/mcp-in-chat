import { Router } from 'express';
import { customerService } from '../services/customer-service.js';
import { boilerService } from '../services/boiler-service.js';
import { paymentService } from '../services/payment-service.js';
import { technicianService } from '../services/technician-service.js';
import { emailService } from '../services/email-service.js';
import { validatePurchase } from '../middleware/validation.js';
import { authenticateApiKey } from '../middleware/auth.js';
import { purchaseRateLimit } from '../middleware/rate-limit.js';
const router = Router();
/**
 * POST /api/purchase
 * Process boiler purchase order
 */
router.post('/', authenticateApiKey, purchaseRateLimit, validatePurchase, async (req, res) => {
    try {
        const { customer_id, boiler_model, payment_info, installation_date } = req.body;
        // Get customer information
        const customer = await customerService.getCustomerById(customer_id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
                message: `No customer found with ID: ${customer_id}`
            });
        }
        // Get boiler information
        const boiler = await boilerService.getBoilerByModel(boiler_model);
        if (!boiler) {
            return res.status(404).json({
                success: false,
                error: 'Boiler not found',
                message: `No boiler found with model: ${boiler_model}`
            });
        }
        // Check inventory availability
        const inventory = await boilerService.getInventoryByModel(boiler_model);
        if (!inventory || inventory.quantity === 0) {
            return res.status(400).json({
                success: false,
                error: 'Boiler out of stock',
                message: `${boiler_model} is currently out of stock`,
                data: {
                    available_alternatives: await getAlternativeBoilers(boiler_model, boiler.price)
                }
            });
        }
        // Validate payment information
        const paymentValidation = paymentService.validatePaymentMethod(payment_info);
        if (!paymentValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment information',
                message: 'Payment validation failed',
                details: paymentValidation.errors
            });
        }
        // Process payment
        const paymentResult = await paymentService.processPayment(payment_info);
        if (!paymentResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Payment failed',
                message: 'Payment processing failed',
                details: paymentResult
            });
        }
        // Generate order ID
        const orderId = generateOrderId();
        // Schedule installation if date provided
        let installationBooking = null;
        if (installation_date) {
            const location = extractLocationFromAddress(customer.address);
            const availableTechnicians = await technicianService.getAvailableTechnicians(installation_date, location, ['Worcester Bosch', 'Vaillant', 'Ideal', 'Baxi', 'Glow-worm']);
            if (availableTechnicians.length > 0) {
                const bestTechnician = availableTechnicians[0];
                installationBooking = await technicianService.bookTechnician(customer_id, bestTechnician.technician_id, installation_date, bestTechnician.available_slots[0], 'installation', 4);
            }
        }
        // Send order confirmation email
        const emailResult = await emailService.sendOrderConfirmation(orderId, customer.email);
        // Prepare response
        const response = {
            success: true,
            data: {
                order: {
                    order_id: orderId,
                    customer_id,
                    boiler_model,
                    total: payment_info.amount,
                    payment_method: payment_info.method,
                    payment_status: paymentResult.status,
                    transaction_id: paymentResult.transactionId
                },
                boiler: {
                    model: boiler.model,
                    manufacturer: boiler.manufacturer,
                    efficiency: boiler.efficiency,
                    features: boiler.features,
                    warranty_info: boiler.warranty_info
                },
                installation: installationBooking ? {
                    booking_id: installationBooking.booking_id,
                    date: installationBooking.service_date,
                    time: installationBooking.service_time,
                    technician_id: installationBooking.technician_id
                } : null,
                payment: {
                    success: paymentResult.success,
                    transaction_id: paymentResult.transactionId,
                    amount: paymentResult.amount,
                    method: paymentResult.method,
                    timestamp: paymentResult.timestamp
                },
                email_sent: emailResult.success
            },
            message: 'Purchase completed successfully',
            timestamp: new Date().toISOString()
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error in purchase endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to process purchase'
        });
    }
});
/**
 * GET /api/purchase/:customer_id/history
 * Get purchase history for a customer
 */
router.get('/:customer_id/history', authenticateApiKey, purchaseRateLimit, async (req, res) => {
    try {
        const { customer_id } = req.params;
        // Get customer information
        const customer = await customerService.getCustomerById(customer_id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
                message: `No customer found with ID: ${customer_id}`
            });
        }
        // Get payment history
        const paymentHistory = await paymentService.getPaymentHistory(customer_id);
        const response = {
            success: true,
            data: {
                customer: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email
                },
                purchase_history: paymentHistory,
                total_spent: paymentHistory.reduce((sum, payment) => sum + payment.amount, 0),
                total_orders: paymentHistory.length
            },
            timestamp: new Date().toISOString()
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error in purchase history endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to retrieve purchase history'
        });
    }
});
/**
 * POST /api/purchase/:customer_id/finance
 * Apply for finance
 */
router.post('/:customer_id/finance', authenticateApiKey, purchaseRateLimit, async (req, res) => {
    try {
        const { customer_id } = req.params;
        const { amount, term } = req.body;
        // Get customer information
        const customer = await customerService.getCustomerById(customer_id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
                message: `No customer found with ID: ${customer_id}`
            });
        }
        // Apply for finance
        const financeApplication = await paymentService.applyForFinance(customer_id, amount, term);
        const response = {
            success: true,
            data: {
                customer: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email
                },
                finance_application: {
                    application_id: financeApplication.applicationId,
                    amount: financeApplication.amount,
                    term: financeApplication.term,
                    monthly_payment: financeApplication.monthlyPayment,
                    interest_rate: financeApplication.interestRate,
                    approved: financeApplication.approved
                },
                next_steps: [
                    'Review and accept finance terms',
                    'Complete purchase with finance option',
                    'Schedule installation'
                ]
            },
            message: 'Finance application processed successfully',
            timestamp: new Date().toISOString()
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error in finance application endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to process finance application'
        });
    }
});
/**
 * GET /api/purchase/available-payment-methods
 * Get available payment methods
 */
router.get('/available-payment-methods', authenticateApiKey, purchaseRateLimit, async (req, res) => {
    try {
        const paymentMethods = paymentService.getAvailablePaymentMethods();
        const response = {
            success: true,
            data: {
                payment_methods: paymentMethods
            },
            timestamp: new Date().toISOString()
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error in payment methods endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to retrieve payment methods'
        });
    }
});
/**
 * POST /api/purchase/:order_id/refund
 * Process refund for an order
 */
router.post('/:order_id/refund', authenticateApiKey, purchaseRateLimit, async (req, res) => {
    try {
        const { order_id } = req.params;
        const { amount, reason } = req.body;
        // Process refund
        const refundResult = await paymentService.refundPayment(order_id, amount, reason);
        const response = {
            success: true,
            data: {
                refund: {
                    original_order_id: order_id,
                    refund_transaction_id: refundResult.transactionId,
                    amount: refundResult.amount,
                    reason,
                    status: refundResult.status,
                    timestamp: refundResult.timestamp
                }
            },
            message: 'Refund processed successfully',
            timestamp: new Date().toISOString()
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error in refund endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to process refund'
        });
    }
});
/**
 * Helper functions
 */
function extractLocationFromAddress(address) {
    const parts = address.split(',');
    if (parts.length >= 2) {
        return parts[1].trim();
    }
    return 'London';
}
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `ORD-${timestamp}-${random}`.toUpperCase();
}
async function getAlternativeBoilers(requestedModel, price) {
    try {
        const allBoilers = await boilerService.getAllBoilers();
        const alternatives = allBoilers
            .filter(boiler => boiler.model !== requestedModel)
            .filter(boiler => Math.abs(boiler.price - price) <= 500) // Within £500 price range
            .sort((a, b) => Math.abs(a.price - price) - Math.abs(b.price - price))
            .slice(0, 3);
        return alternatives.map(boiler => ({
            model: boiler.model,
            manufacturer: boiler.manufacturer,
            efficiency: boiler.efficiency,
            price: boiler.price,
            features: boiler.features
        }));
    }
    catch (error) {
        console.error('Error getting alternative boilers:', error);
        return [];
    }
}
export default router;
//# sourceMappingURL=purchase.js.map