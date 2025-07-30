#!/bin/bash

echo "🔍 MCP and API Server Status Check"
echo "=================================="
echo ""

# Check API server
echo "📡 API Server:"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Running on port 3001"
    curl -s http://localhost:3001/health | jq -r '.status'
else
    echo "❌ Not responding"
fi
echo ""

# Check MCP server
echo "🤖 MCP Server:"
if node quick-mcp-test.js > /dev/null 2>&1; then
    echo "✅ Responding correctly"
else
    echo "❌ Not responding"
fi
echo ""

# Check processes
echo "📊 Active Processes:"
ps aux | grep -E "(mcp-server|api/server)" | grep -v grep | awk '{print "   " $2 " - " $11}' | head -5
echo ""

# Check Cursor MCP processes
echo "🎯 Cursor MCP Processes:"
ps aux | grep "mcp-server-cursor" | grep -v grep | wc -l | xargs echo "   Active Cursor MCP instances:"
echo ""

echo "✅ Status check complete!" 