#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Simple tool definitions
const tools = [
  {
    name: 'boiler-info',
    description: 'Get customer boiler information and warranty details',
    handler: async (args: any) => {
      return {
        success: true,
        data: {
          customer: { id: 'CUST001', name: 'John Smith' },
          boiler: { model: 'Worcester Bosch 8000 Style', efficiency: '94%' },
          warranty: { duration: '10 years', coverage: 'Parts and labour' }
        }
      };
    }
  },
  {
    name: 'maintenance',
    description: 'Schedule maintenance services',
    handler: async (args: any) => {
      return {
        success: true,
        data: {
          booking: { booking_id: 'BK-123', service_date: '2024-08-15' },
          technician: { id: 'TECH001', rating: 4.8 }
        }
      };
    }
  },
  {
    name: 'purchase',
    description: 'Process boiler purchase orders',
    handler: async (args: any) => {
      return {
        success: true,
        data: {
          order: { order_id: 'ORD-123', total: 2500 },
          payment: { status: 'completed' }
        }
      };
    }
  },
  {
    name: 'email',
    description: 'Send confirmation emails',
    handler: async (args: any) => {
      return {
        success: true,
        data: {
          message_id: 'MSG-123',
          sent_to: 'test@example.com',
          status: 'sent'
        }
      };
    }
  }
];

// Create server
const server = new Server(
  {
    name: 'boiler-maintenance-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: {
        type: 'object',
        properties: {
          customer_id: { type: 'string' }
        }
      }
    }))
  };
});

// Handle call tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = tools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`Tool '${name}' not found`);
  }

  const result = await tool.handler(args);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

// Start server
async function start() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  start().catch(console.error);
}

export { server, start }; 