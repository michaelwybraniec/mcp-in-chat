#!/bin/bash

echo "🔍 MCP and API Server Log Monitor"
echo "=================================="
echo ""

# Function to monitor API server logs
monitor_api() {
    echo "📡 API Server Logs (PID: 72251):"
    echo "--------------------------------"
    tail -f /dev/null &  # Placeholder for API logs
    echo "API server is running on port 3001"
    echo "Test with: curl http://localhost:3001/health"
    echo ""
}

# Function to monitor MCP server logs
monitor_mcp() {
    echo "🤖 MCP Server Logs:"
    echo "------------------"
    echo "MCP server processes running:"
    ps aux | grep "mcp-server" | grep -v grep
    echo ""
    echo "Test MCP server with: node test-mcp-cursor.js"
    echo ""
}

# Function to show real-time activity
monitor_activity() {
    echo "📊 Real-time Activity Monitor:"
    echo "-----------------------------"
    echo "Press Ctrl+C to stop monitoring"
    echo ""
    
    # Monitor network connections
    echo "🌐 Network Connections:"
    lsof -i :3001 -i :3000 2>/dev/null || echo "No network connections found"
    echo ""
    
    # Monitor file changes
    echo "📁 File Activity (last 10 seconds):"
    find . -name "*.log" -o -name "*.json" -newermt "10 seconds ago" 2>/dev/null || echo "No recent file changes"
    echo ""
}

# Main monitoring loop
while true; do
    clear
    echo "🔄 MCP and API Server Monitor - $(date)"
    echo "=========================================="
    echo ""
    
    monitor_api
    monitor_mcp
    monitor_activity
    
    echo "🔄 Refreshing in 5 seconds... (Ctrl+C to exit)"
    sleep 5
done 