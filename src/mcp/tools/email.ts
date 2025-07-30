import { z } from 'zod';

/**
 * Email MCP Tool
 * 
 * Sends confirmation emails by calling the backend API
 */

const EmailInputSchema = z.object({
  to_email: z.string().email().describe('Recipient email address'),
  subject: z.string().describe('Email subject line'),
  message: z.string().describe('Email message content'),
  email_type: z.enum(['confirmation', 'reminder', 'notification', 'general']).optional().describe('Type of email being sent'),
  customer_id: z.string().optional().describe('Customer ID for tracking purposes'),
  order_id: z.string().optional().describe('Order ID for order-related emails'),
});

const EmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    message_id: z.string(),
    sent_to: z.string(),
    subject: z.string(),
    sent_at: z.string(),
    email_type: z.string(),
    status: z.string(),
  }),
});

export const emailTool = {
  name: 'email',
  description: 'Send confirmation emails to customers. Use this when you need to send order confirmations, maintenance reminders, or any other customer communications.',
  inputSchema: EmailInputSchema,
  outputSchema: EmailOutputSchema,
  
  async handler(args: z.infer<typeof EmailInputSchema>) {
    const { to_email, subject, message, email_type, customer_id, order_id } = args;
    
    try {
      // Prepare request body
      const requestBody = {
        to_email,
        subject,
        message,
        email_type: email_type || 'general',
        customer_id: customer_id || null,
        order_id: order_id || null,
      };
      
      // Call the backend API
      const response = await fetch(`http://localhost:3001/api/email`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer demo-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the response against our schema
      const validatedData = EmailOutputSchema.parse(data);
      
      return validatedData;
    } catch (error) {
      console.error('Email tool error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  },
};

export default emailTool; 