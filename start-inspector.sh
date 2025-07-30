#!/bin/bash

# Start MCP Inspector for Boiler Maintenance MCP Server
echo "🔍 Starting MCP Inspector for Boiler Maintenance MCP Server..."
echo "📋 This will allow you to inspect and test your MCP tools:"
echo "   - boiler-info: Get customer boiler details and warranty information"
echo "   - maintenance: Schedule maintenance with weather data and AI predictions"
echo "   - purchase: Process orders with inventory check and technician scheduling"
echo "   - email: Send confirmation emails"
echo ""
echo "🌐 MCP Inspector should open in your browser automatically"
echo ""

# Kill any existing processes on the default port
echo "🔧 Cleaning up any existing processes..."
lsof -ti:6277 | xargs kill -9 2>/dev/null || true

# Build the project first
echo "🔨 Building TypeScript project..."
npm run build

# Start MCP Inspector with the compiled JavaScript version
echo "🚀 Starting MCP Inspector..."
npx @modelcontextprotocol/inspector node dist/mcp/mcp-server-simple.js 