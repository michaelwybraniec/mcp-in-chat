import { promises as fs } from 'fs';
import path from 'path';
import { Order } from '../../types/index.js';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

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
export class EmailService {
  private readonly defaultFrom = 'noreply@boilertech.com';

  /**
   * Send email
   */
  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      // Simulate processing delay
      await this.simulateProcessingDelay();
      
      // Generate mock message ID
      const messageId = this.generateMessageId();
      
      // Mock email sending - always successful for demo
      const result: EmailResult = {
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
    } catch (error) {
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
  async sendOrderConfirmation(orderId: string, customerEmail: string): Promise<EmailResult> {
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
  async sendMaintenanceReminder(
    customerEmail: string,
    customerName: string,
    serviceDate: string
  ): Promise<EmailResult> {
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
  async sendEmergencyServiceNotification(
    customerEmail: string,
    estimatedArrival: string
  ): Promise<EmailResult> {
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
  private async simulateProcessingDelay(): Promise<void> {
    const delay = Math.random() * 600 + 200;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateMessageId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `MSG-${timestamp}-${random}`.toUpperCase();
  }
}

// Export singleton instance
export const emailService = new EmailService(); 