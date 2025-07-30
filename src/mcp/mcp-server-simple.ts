#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import MCP tools
import { boilerInfoTool } from './tools/boiler-info.js';
import { maintenanceTool } from './tools/maintenance.js';
import { purchaseTool } from './tools/purchase.js';
import { emailTool } from './tools/email.js';

const server = new Server(
  {
    name: 'boiler-maintenance-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
const tools = [boilerInfoTool, maintenanceTool, purchaseTool, emailTool];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolList = tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  return {
    tools: toolList,
  };
});

// Handle call tool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = tools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`Tool '${name}' not found`);
  }

  try {
    const result = await tool.handler(args);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Tool '${name}' execution failed: ${error.message}`);
  }
});

// Start the server
async function start() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start().catch(console.error);
}

export { server, start }; 