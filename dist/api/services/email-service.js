import path from 'path';
const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');
/**
 * Mock Email Service for demo purposes
 * Simulates email sending with console logging
 */
export class EmailService {
    defaultFrom = 'noreply@boilertech.com';
    /**
     * Send email
     */
    async sendEmail(emailData) {
        try {
            // Simulate processing delay
            await this.simulateProcessingDelay();
            // Generate mock message ID
            const messageId = this.generateMessageId();
            // Mock email sending - always successful for demo
            const result = {
                success: true,
                messageId,
                to: emailData.to,
                subject: emailData.subject,
                timestamp: new Date().toISOString(),
                status: 'sent'
            };
            // Log email for demo purposes
            console.log(`📧 Mock Email Sent:`, {
                messageId,
                to: emailData.to,
                subject: emailData.subject,
                timestamp: result.timestamp,
                from: emailData.from || this.defaultFrom
            });
            // Log email content in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`📧 Email Content:`, {
                    message: emailData.message,
                    html: emailData.html
                });
            }
            return result;
        }
        catch (error) {
            console.error('Error sending email:', error);
            return {
                success: false,
                messageId: '',
                to: emailData.to,
                subject: emailData.subject,
                timestamp: new Date().toISOString(),
                status: 'failed',
                error: 'Email sending failed'
            };
        }
    }
    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(orderId, customerEmail) {
        const subject = `Order Confirmation - ${orderId}`;
        const message = `Thank you for your order! Your order ${orderId} has been confirmed.`;
        return this.sendEmail({
            to: customerEmail,
            subject,
            message
        });
    }
    /**
     * Send maintenance reminder email
     */
    async sendMaintenanceReminder(customerEmail, customerName, serviceDate) {
        const subject = 'Maintenance Reminder';
        const message = `Dear ${customerName}, your boiler maintenance is scheduled for ${serviceDate}.`;
        return this.sendEmail({
            to: customerEmail,
            subject,
            message
        });
    }
    /**
     * Send emergency service notification
     */
    async sendEmergencyServiceNotification(customerEmail, estimatedArrival) {
        const subject = 'Emergency Service Notification';
        const message = `Emergency service technician will arrive at approximately ${estimatedArrival}.`;
        return this.sendEmail({
            to: customerEmail,
            subject,
            message
        });
    }
    /**
     * Private helper methods
     */
    async simulateProcessingDelay() {
        const delay = Math.random() * 600 + 200;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    generateMessageId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `MSG-${timestamp}-${random}`.toUpperCase();
    }
}
// Export singleton instance
export const emailService = new EmailService();
//# sourceMappingURL=email-service.js.map