#!/bin/bash

# Start the Boiler Maintenance MCP Server for MCP Studio
echo "🚀 Starting Boiler Maintenance MCP Server for MCP Studio..."
echo "📋 Available tools:"
echo "   - boiler-info: Get customer boiler details and warranty information"
echo "   - maintenance: Schedule maintenance with weather data and AI predictions"
echo "   - purchase: Process orders with inventory check and technician scheduling"
echo "   - email: Send confirmation emails"
echo ""
echo "🔗 Connect to this server in MCP Studio using:"
echo "   Command: node"
echo "   Args: --loader ts-node/esm src/mcp/mcp-server.ts"
echo ""

# Start the MCP server
node --loader ts-node/esm src/mcp/mcp-server.ts 