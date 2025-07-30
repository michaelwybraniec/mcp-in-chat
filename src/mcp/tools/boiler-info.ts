import { z } from 'zod';

/**
 * Boiler Info MCP Tool
 * 
 * Gets customer boiler information and warranty details by calling the backend API
 */

const BoilerInfoInputSchema = z.object({
  customer_id: z.string().describe('The customer ID to get boiler information for'),
});

const BoilerInfoOutputSchema = z.object({
  success: z.boolean(),
  data: z.object({
    customer: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      address: z.string(),
      phone: z.string(),
    }),
    boiler: z.object({
      model: z.string(),
      manufacturer: z.string(),
      efficiency: z.string(),
      fuel_type: z.string(),
      output: z.string(),
      features: z.array(z.string()),
      install_date: z.string(),
      age_years: z.number(),
    }),
    warranty: z.object({
      info: z.object({
        duration: z.string(),
        coverage: z.string(),
        conditions: z.array(z.string()),
        contact: z.object({
          phone: z.string(),
          email: z.string(),
          website: z.string(),
        }),
      }).nullable(),
      status: z.object({
        is_active: z.boolean(),
        days_remaining: z.number(),
        warranty_end: z.string(),
        coverage_type: z.string(),
      }).nullable(),
    }),
    inventory: z.object({
      available: z.boolean(),
      quantity: z.number(),
      location: z.string(),
    }).nullable(),
  }),
  message: z.string().optional(),
  timestamp: z.string(),
});

export const boilerInfoTool = {
  name: 'boiler-info',
  description: 'Get customer boiler information and warranty details. Use this when a user asks about their boiler status, warranty, or boiler details.',
  inputSchema: BoilerInfoInputSchema,
  outputSchema: BoilerInfoOutputSchema,
  
  async handler(args: z.infer<typeof BoilerInfoInputSchema>) {
    const { customer_id } = args;
    
    try {
      // Call the backend API
      const response = await fetch(`http://localhost:3001/api/boiler-info?customer_id=${customer_id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer demo-key',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the response against our schema
      const validatedData = BoilerInfoOutputSchema.parse(data);
      
      return validatedData;
    } catch (error) {
      console.error('Boiler info tool error:', error);
      throw new Error(`Failed to get boiler information: ${error.message}`);
    }
  },
};

export default boilerInfoTool; 