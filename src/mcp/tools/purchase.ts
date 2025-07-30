import { z } from 'zod';

/**
 * Purchase MCP Tool
 * 
 * Handles boiler purchase orders by calling the backend API
 */

const PurchaseInputSchema = z.object({
  customer_id: z.string().describe('The customer ID making the purchase'),
  boiler_model: z.string().describe('The boiler model to purchase'),
  payment_info: z.object({
    method: z.enum(['credit_card', 'debit_card', 'bank_transfer']).describe('Payment method'),
    card_number: z.string().optional().describe('Card number (last 4 digits only)'),
    expiry_date: z.string().optional().describe('Card expiry date (MM/YY format)'),
    cvv: z.string().optional().describe('Card CVV'),
    billing_address: z.string().describe('Billing address'),
  }).describe('Payment information'),
  delivery_address: z.string().optional().describe('Delivery address (if different from billing)'),
  installation_required: z.boolean().optional().describe('Whether installation service is required'),
  preferred_installation_date: z.string().optional().describe('Preferred installation date (YYYY-MM-DD format)'),
});

const PurchaseOutputSchema = z.object({
  success: z.boolean(),
  data: z.object({
    order: z.object({
      order_id: z.string(),
      customer_id: z.string(),
      boiler_model: z.string(),
      total_amount: z.number(),
      order_date: z.string(),
      status: z.string(),
      estimated_delivery: z.string(),
    }),
    payment: z.object({
      transaction_id: z.string(),
      amount: z.number(),
      method: z.string(),
      status: z.string(),
    }),
    boiler: z.object({
      model: z.string(),
      manufacturer: z.string(),
      efficiency: z.string(),
      price: z.number(),
      features: z.array(z.string()),
      warranty_info: z.object({
        duration: z.string(),
        coverage: z.string(),
      }),
    }),
    installation: z.object({
      required: z.boolean(),
      scheduled_date: z.string().optional(),
      technician_id: z.string().optional(),
      estimated_duration: z.string().optional(),
    }).optional(),
    inventory: z.object({
      available: z.boolean(),
      quantity_after_order: z.number(),
      location: z.string(),
    }),
  }),
  message: z.string(),
  timestamp: z.string(),
});

export const purchaseTool = {
  name: 'purchase',
  description: 'Process boiler purchase orders with inventory check and technician scheduling. Use this when a user wants to buy a new boiler or upgrade their existing one.',
  inputSchema: PurchaseInputSchema,
  outputSchema: PurchaseOutputSchema,
  
  async handler(args: z.infer<typeof PurchaseInputSchema>) {
    const { 
      customer_id, 
      boiler_model, 
      payment_info, 
      delivery_address, 
      installation_required, 
      preferred_installation_date 
    } = args;
    
    try {
      // Prepare request body
      const requestBody = {
        customer_id,
        boiler_model,
        payment_info,
        delivery_address: delivery_address || null,
        installation_required: installation_required || false,
        preferred_installation_date: preferred_installation_date || null,
      };
      
      // Call the backend API
      const response = await fetch(`http://localhost:3001/api/purchase`, {
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
      const validatedData = PurchaseOutputSchema.parse(data);
      
      return validatedData;
    } catch (error) {
      console.error('Purchase tool error:', error);
      throw new Error(`Failed to process purchase: ${error.message}`);
    }
  },
};

export default purchaseTool; 