import { z } from 'zod';

/**
 * Maintenance MCP Tool
 * 
 * Handles maintenance scheduling and retrieval by calling the backend API
 */

export const MaintenanceInputSchema = z.object({
  customer_id: z.string().describe('The customer ID for maintenance operations'),
  action: z.enum(['get', 'schedule']).describe('Action to perform: get (retrieve schedule) or schedule (book maintenance)'),
  service_date: z.string().optional().describe('Service date for scheduling (YYYY-MM-DD format)'),
  service_type: z.enum(['annual', 'emergency', 'repair', 'inspection']).optional().describe('Type of maintenance service'),
  issue_description: z.string().optional().describe('Description of the issue for emergency/repair services'),
});

const MaintenanceOutputSchema = z.object({
  success: z.boolean(),
  data: z.object({
    customer: z.object({
      id: z.string(),
      name: z.string(),
      boiler_model: z.string(),
    }).optional(),
    current_status: z.object({
      maintenance_prediction: z.any(),
      failure_prediction: z.any(),
      efficiency_analysis: z.any(),
      predictive_schedule: z.any(),
    }).optional(),
    booking: z.object({
      booking_id: z.string(),
      service_date: z.string(),
      service_time: z.string(),
      service_type: z.string(),
      technician_id: z.string(),
      status: z.string(),
    }).optional(),
    technician: z.object({
      id: z.string(),
      rating: z.number(),
      skills: z.array(z.string()),
    }).optional(),
    email_sent: z.boolean().optional(),
    maintenance_prediction: z.any().optional(),
    weather_conditions: z.object({
      suitable: z.boolean(),
      location: z.string(),
      date: z.string(),
    }).optional(),
    optimal_dates: z.array(z.string()).optional(),
    weather_alerts: z.array(z.any()).optional(),
    recommendations: z.array(z.string()).optional(),
  }),
  message: z.string().optional(),
  timestamp: z.string(),
});

export const maintenanceTool = {
  name: 'maintenance',
  description: 'Schedule maintenance services or get maintenance information. Use this when a user wants to schedule boiler maintenance, check maintenance status, or get maintenance recommendations.',
  inputSchema: {
    type: 'object',
    properties: {
      customer_id: {
        type: 'string',
        description: 'The customer ID for maintenance operations'
      },
      action: {
        type: 'string',
        enum: ['get', 'schedule'],
        description: 'Action to perform: get (retrieve schedule) or schedule (book maintenance)'
      },
      service_date: {
        type: 'string',
        description: 'Service date for scheduling (YYYY-MM-DD format)'
      },
      service_type: {
        type: 'string',
        enum: ['annual', 'emergency', 'repair', 'inspection'],
        description: 'Type of maintenance service'
      },
      issue_description: {
        type: 'string',
        description: 'Description of the issue for emergency/repair services'
      }
    },
    required: ['customer_id', 'action']
  },
  outputSchema: MaintenanceOutputSchema,
  
  async handler(args: z.infer<typeof MaintenanceInputSchema>) {
    const { customer_id, action, service_date, service_type, issue_description } = args;
    
    try {
      let response;
      
      if (action === 'get') {
        // GET request to retrieve maintenance schedule
        response = await fetch(`http://localhost:3001/api/maintenance?customer_id=${customer_id}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer demo-key',
            'Content-Type': 'application/json',
          },
        });
      } else if (action === 'schedule') {
        // POST request to schedule maintenance
        if (!service_date) {
          throw new Error('Service date is required for scheduling maintenance');
        }
        
        const requestBody: any = {
          customer_id,
          service_date,
          service_type: service_type || 'annual',
        };
        
        if (issue_description) {
          requestBody.issue_description = issue_description;
        }
        
        response = await fetch(`http://localhost:3001/api/maintenance`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer demo-key',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        throw new Error(`Invalid action: ${action}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the response against our schema
      const validatedData = MaintenanceOutputSchema.parse(data);
      
      return validatedData;
    } catch (error) {
      console.error('Maintenance tool error:', error);
      throw new Error(`Failed to ${action} maintenance: ${error.message}`);
    }
  },
};

export default maintenanceTool; 