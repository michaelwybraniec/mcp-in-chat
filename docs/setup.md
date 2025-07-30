# Setup Guide - Boiler Maintenance MCP Server Demo

This guide provides step-by-step instructions to set up and run the Boiler Maintenance MCP Server demo.

## Prerequisites

### System Requirements
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (or pnpm/yarn)
- **Git**: For cloning the repository
- **Terminal**: Command line access

### External Dependencies
- Access to an external chatbot (Claude, ChatGPT, or Cursor) for testing MCP integration
- Internet connection for package installation

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mcp-in-chat
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- `@modelcontextprotocol/sdk` - MCP server framework
- `express` - Backend API server
- `zod` - Schema validation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 3. Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify TypeScript compilation
npm run build
```

## Running the Demo

### ⚠️ Important Note: Known API Server Issue

**Current Status**: The backend API server has a known startup issue with a path-to-regexp error that prevents it from running. This blocks full integration testing.

**Error**: `TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError`

**Workaround**: The MCP server and tools are complete and can be tested individually, but full integration requires resolving this issue.

### Step 1: Start the Backend API (Currently Blocked)

```bash
# Start the backend API server
npm run start:api
```

**Expected Output** (when working):
```
🚀 Boiler Maintenance API server running on port 3001
📊 Health check: http://localhost:3001/health
```

**Current Issue**: Server fails to start with path-to-regexp error.

### Step 2: Start the MCP Server

In a new terminal window:
```bash
# Start the MCP server
npm run start:mcp
```

**Expected Output**:
```
🚀 Boiler Maintenance MCP Server started
📋 Available tools:
   - boiler-info: Get customer boiler details and warranty information
   - maintenance: Schedule maintenance with weather data and AI predictions
   - purchase: Process orders with inventory check and technician scheduling
   - email: Send confirmation emails
```

### Step 3: Test the MCP Tools

Run the comprehensive test suite:
```bash
# Test all MCP tools
node test-mcp-tools.js
```

**Note**: This test requires the backend API to be running (currently blocked by the startup issue).

## External Chatbot Integration

### Prerequisites
- Access to Claude, ChatGPT, or Cursor
- MCP server running on your local machine
- Backend API server running (requires fixing the startup issue)

### Connection Steps

1. **Configure your chatbot** to connect to the MCP server
2. **Provide server details**:
   - Protocol: MCP
   - Host: localhost
   - Port: (MCP server port)
3. **Test each tool**:
   - Boiler Info Tool
   - Maintenance Tool
   - Purchase Tool
   - Email Tool

### Sample Test Commands

Once connected, try these commands in your chatbot:

```
"Get boiler information for customer CUST001"
"Schedule maintenance for customer CUST001 on 2024-02-15"
"Process a purchase for customer CUST001 for EcoMax Pro 30kW boiler"
"Send a confirmation email to test@example.com"
```

## Troubleshooting

### Common Issues

#### 1. API Server Won't Start
**Problem**: `TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError`

**Status**: Known issue - needs investigation
**Impact**: Blocks full integration testing
**Workaround**: MCP tools can be tested individually

#### 2. Port Already in Use
**Problem**: `EADDRINUSE` error

**Solution**:
```bash
# Find process using the port
lsof -i :3001

# Kill the process
kill -9 <PID>
```

#### 3. TypeScript Compilation Errors
**Problem**: TypeScript compilation fails

**Solution**:
```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### 4. MCP Server Connection Issues
**Problem**: External chatbot can't connect to MCP server

**Solutions**:
- Ensure MCP server is running
- Check firewall settings
- Verify connection details
- Check MCP server logs for errors

### Debug Mode

Enable debug logging:
```bash
# Set debug environment variable
export DEBUG=*

# Start servers with debug output
npm run start:api
npm run start:mcp
```

## Development Setup

### Project Structure
```
mcp-in-chat/
├── src/
│   ├── mcp/           # MCP Server
│   ├── api/           # Backend API
│   └── types/         # TypeScript definitions
├── data/              # Mock data files
├── docs/              # Documentation
├── demo/              # Demo materials
└── test-mcp-tools.js  # Test script
```

### Available Scripts
```bash
npm run start:api      # Start backend API server
npm run start:mcp      # Start MCP server
npm run build          # Build TypeScript
npm run test           # Run tests (placeholder)
```

### Environment Variables
Create a `.env` file for custom configuration:
```env
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Next Steps

### Immediate Actions Required
1. **Fix API server startup issue** (High Priority)
   - Investigate path-to-regexp error
   - Check route definitions
   - Verify middleware configuration

2. **Complete MCP server testing** (Medium Priority)
   - Test tool registration
   - Verify MCP server startup
   - Validate tool functionality

### Once Issues Are Resolved
1. Test full integration with external chatbots
2. Record demo video
3. Create presentation materials
4. Final testing and validation

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the [AWP project plan](agentic-sldc/AWP.md)
3. Check the [README.md](../README.md) for project overview
4. Review the [unplanned tasks](agentic-sldc/AWP.md#unplanned-tasks) for known issues

---

**Note**: This demo is for educational purposes and showcases MCP Server integration capabilities. The current API server startup issue needs to be resolved before full integration testing can proceed. 