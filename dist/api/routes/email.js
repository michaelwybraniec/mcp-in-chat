import { Router } from 'express';
import { emailService } from '../services/email-service.js';
import { authenticateApiKey } from '../middleware/auth.js';
import { generalRateLimit } from '../middleware/rate-limit.js';
const router = Router();
/**
 * POST /api/send-email
 * Send confirmation emails to customers
 */
router.post('/', authenticateApiKey, generalRateLimit, async (req, res) => {
    try {
        const { to_email, subject, message, email_type, customer_id, order_id } = req.body;
        // Validate required fields
        if (!to_email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'to_email, subject, and message are required'
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to_email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
                message: 'Please provide a valid email address'
            });
        }
        // Prepare email data
        const emailData = {
            to: to_email,
            subject: subject,
            message: message,
            email_type: email_type || 'general',
            customer_id: customer_id || null,
            order_id: order_id || null,
            timestamp: new Date().toISOString()
        };
        // Send email using service
        const result = await emailService.sendEmail(emailData);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Email sent successfully',
                data: {
                    message_id: result.messageId,
                    sent_to: to_email,
                    subject: subject,
                    sent_at: result.timestamp,
                    email_type: email_type,
                    status: result.status
                }
            });
        }
        else {
            return res.status(500).json({
                success: false,
                error: 'Failed to send email',
                message: result.error || 'Email service unavailable'
            });
        }
    }
    catch (error) {
        console.error('Email route error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to process email request'
        });
    }
});
export default router;
//# sourceMappingURL=email.js.map