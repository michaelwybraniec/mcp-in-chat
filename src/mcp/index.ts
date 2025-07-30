/**
 * MCP Server Export Module
 * 
 * This module exports the BoilerMaintenanceMCPServer for external connections
 * and provides a convenient way to start the server.
 */

export { BoilerMaintenanceMCPServer } from './mcp-server.js';

// Export individual tools for testing and development
export { boilerInfoTool } from './tools/boiler-info.js';
export { maintenanceTool } from './tools/maintenance.js';
export { purchaseTool } from './tools/purchase.js';
export { emailTool } from './tools/email.js';

// Default export for easy importing
import { BoilerMaintenanceMCPServer } from './mcp-server.js';
export default BoilerMaintenanceMCPServer; 