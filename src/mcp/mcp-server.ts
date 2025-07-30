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

/**
 * Boiler Maintenance MCP Server
 * 
 * This MCP server provides 4 tools for boiler maintenance and sales:
 * 1. Boiler Info Tool - Get customer boiler details and warranty information
 * 2. Maintenance Tool - Schedule maintenance with weather data and AI predictions
 * 3. Purchase Tool - Process orders with inventory check and technician scheduling
 * 4. Email Tool - Send confirmation emails
 */

class BoilerMaintenanceMCPServer {
  private server: Server;
  private tools: Map<string, any> = new Map();

  constructor() {
    this.server = new Server(
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

    this.setupToolHandlers();
    this.setupServerHandlers();
  }

  /**
   * Setup tool handlers for the MCP server
   */
  private setupToolHandlers() {
    // Register all MCP tools
    this.registerTool(boilerInfoTool);
    this.registerTool(maintenanceTool);
    this.registerTool(purchaseTool);
    this.registerTool(emailTool);
  }

  /**
   * Register a tool with the MCP server
   */
  private registerTool(tool: any) {
    this.tools.set(tool.name, tool);
  }

  /**
   * Setup server request handlers
   */
  private setupServerHandlers() {
    // Handle list tools request
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return {
        tools,
      };
    });

    // Handle call tool request
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      const tool = this.tools.get(name);
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
  }

  /**
   * Start the MCP server
   */
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.log('🚀 Boiler Maintenance MCP Server started');
    console.log('📋 Available tools:');
    console.log('   - boiler-info: Get customer boiler details and warranty information');
    console.log('   - maintenance: Schedule maintenance with weather data and AI predictions');
    console.log('   - purchase: Process orders with inventory check and technician scheduling');
    console.log('   - email: Send confirmation emails');
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new BoilerMaintenanceMCPServer();
  server.start().catch(console.error);
}

export { BoilerMaintenanceMCPServer }; 