#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "OK") echo -e "${GREEN}✅ $message${NC}" ;;
        "WARN") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "INFO") echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}🚀 $message${NC}" ;;
    esac
}

# Function to check API server status
check_api_server() {
    echo -e "${CYAN}📡 API Server Status:${NC}"
    echo "--------------------------------"
    
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        print_status "OK" "API Server is running on port 3001"
        local response=$(curl -s http://localhost:3001/health | jq -r '.status')
        echo "   Status: $response"
        echo "   PID: $(lsof -ti:3001 2>/dev/null || echo 'Unknown')"
    else
        print_status "ERROR" "API Server is not responding"
    fi
    echo ""
}

# Function to check MCP server status
check_mcp_server() {
    echo -e "${CYAN}🤖 MCP Server Status:${NC}"
    echo "--------------------------------"
    
    local mcp_processes=$(ps aux | grep "mcp-server" | grep -v grep | wc -l)
    if [ $mcp_processes -gt 0 ]; then
        print_status "OK" "MCP Server processes running: $mcp_processes"
        echo "   Active processes:"
        ps aux | grep "mcp-server" | grep -v grep | awk '{print "   - PID: " $2 " (" $11 ")"}'
    else
        print_status "ERROR" "No MCP server processes found"
    fi
    echo ""
}

# Function to show network connections
show_network() {
    echo -e "${CYAN}🌐 Network Connections:${NC}"
    echo "--------------------------------"
    
    local api_conn=$(lsof -i :3001 2>/dev/null | wc -l)
    local mcp_conn=$(lsof -i :3000 2>/dev/null | wc -l)
    
    if [ $api_conn -gt 1 ]; then
        print_status "OK" "API server listening on port 3001"
    else
        print_status "WARN" "No API server connection found"
    fi
    
    if [ $mcp_conn -gt 1 ]; then
        print_status "OK" "MCP server listening on port 3000"
    else
        print_status "INFO" "MCP server uses stdio (no network port)"
    fi
    echo ""
}

# Function to show recent activity
show_activity() {
    echo -e "${CYAN}📊 Recent Activity:${NC}"
    echo "--------------------------------"
    
    # Show recent API calls
    echo "Recent API calls (last 5 minutes):"
    if command -v journalctl >/dev/null 2>&1; then
        journalctl --since "5 minutes ago" | grep -i "api\|3001" | tail -3 || echo "   No recent API activity found"
    else
        echo "   Activity logging not available"
    fi
    echo ""
}

# Function to show test results
show_test_results() {
    echo -e "${CYAN}🧪 Quick Tests:${NC}"
    echo "--------------------------------"
    
    # Test API
    echo "Testing API server..."
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        print_status "SUCCESS" "API server responding"
    else
        print_status "ERROR" "API server not responding"
    fi
    
    # Test MCP
    echo "Testing MCP server..."
    if timeout 3 node quick-mcp-test.js > /dev/null 2>&1; then
        print_status "SUCCESS" "MCP server responding"
    else
        print_status "ERROR" "MCP server not responding"
    fi
    echo ""
}

# Function to show system resources
show_resources() {
    echo -e "${CYAN}💻 System Resources:${NC}"
    echo "--------------------------------"
    
    # CPU and Memory usage for our processes
    echo "Process Resource Usage:"
    ps aux | grep -E "(mcp-server|api/server)" | grep -v grep | awk '{print "   " $11 ": CPU=" $3 "%, MEM=" $4 "%"}'
    echo ""
}

# Main dashboard
main() {
    while true; do
        clear
        echo -e "${PURPLE}🔄 MCP and API Server Dashboard - $(date)${NC}"
        echo "=================================================="
        echo ""
        
        check_api_server
        check_mcp_server
        show_network
        show_resources
        show_test_results
        show_activity
        
        echo -e "${YELLOW}🔄 Dashboard refreshes every 10 seconds... (Ctrl+C to exit)${NC}"
        echo ""
        echo "📋 Quick Commands:"
        echo "   Test API: curl http://localhost:3001/health"
        echo "   Test MCP: node test-mcp-cursor.js"
        echo "   View logs: ./monitor-logs.sh"
        echo ""
        
        sleep 10
    done
}

# Handle Ctrl+C gracefully
trap 'echo -e "\n${GREEN}👋 Dashboard stopped${NC}"; exit 0' INT

# Start the dashboard
main 