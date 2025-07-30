export interface EmailData {
    to: string;
    from?: string;
    subject: string;
    message: string;
    html?: string;
}
export interface EmailResult {
    success: boolean;
    messageId: string;
    to: string;
    subject: string;
    timestamp: string;
    status: 'sent' | 'failed' | 'pending';
    error?: string;
}
/**
 * Mock Email Service for demo purposes
 * Simulates email sending with console logging
 */
export declare class EmailService {
    private readonly defaultFrom;
    /**
     * Send email
     */
    sendEmail(emailData: EmailData): Promise<EmailResult>;
    /**
     * Send order confirmation email
     */
    sendOrderConfirmation(orderId: string, customerEmail: string): Promise<EmailResult>;
    /**
     * Send maintenance reminder email
     */
    sendMaintenanceReminder(customerEmail: string, customerName: string, serviceDate: string): Promise<EmailResult>;
    /**
     * Send emergency service notification
     */
    sendEmergencyServiceNotification(customerEmail: string, estimatedArrival: string): Promise<EmailResult>;
    /**
     * Private helper methods
     */
    private simulateProcessingDelay;
    private generateMessageId;
}
export declare const emailService: EmailService;
//# sourceMappingURL=email-service.d.ts.map