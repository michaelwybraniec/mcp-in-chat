# Troubleshooting Guide

This document provides solutions for common issues encountered when setting up and running the Boiler Maintenance MCP Server demo.

## Quick Reference

| Issue | Status | Solution |
|-------|--------|----------|
| API Server Startup Error | 🔴 **KNOWN ISSUE** | See [API Server Issues](#api-server-issues) |
| MCP Server Connection | 🟡 **DEPENDS ON API** | Fix API server first |
| TypeScript Compilation | ✅ **RESOLVED** | See [Compilation Issues](#compilation-issues) |
| Port Conflicts | ✅ **RESOLVED** | See [Port Issues](#port-issues) |

---

## API Server Issues

### 🔴 Critical: API Server Won't Start

**Error Message**:
```
TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError
```

**Status**: Known issue - blocking full integration testing

**Root Cause**: path-to-regexp library error in route definitions

**Impact**: 
- Prevents backend API from starting
- Blocks MCP tool testing
- Prevents full integration demo

**Temporary Workarounds**:
1. **Test MCP Tools Individually**: Use the test script to validate tool logic
2. **Mock API Responses**: Create mock responses for demonstration
3. **Documentation Demo**: Use the comprehensive documentation for presentation

**Investigation Steps**:
1. Check route definitions for malformed patterns
2. Verify middleware configuration
3. Check for dependency conflicts
4. Review Express.js version compatibility

**Next Steps**:
- [ ] Investigate route pattern issues
- [ ] Test with different Express.js versions
- [ ] Check path-to-regexp library compatibility
- [ ] Implement alternative routing approach

---

## MCP Server Issues

### 🟡 MCP Server Won't Start

**Error Message**:
```
Error: Cannot find module '@modelcontextprotocol/sdk'
```

**Solution**:
```bash
# Install missing dependencies
npm install @modelcontextprotocol/sdk

# Verify installation
npm list @modelcontextprotocol/sdk
```

### 🟡 MCP Tools Not Registered

**Error Message**:
```
Tool 'boiler-info' not found
```

**Solution**:
1. Check tool registration in `src/mcp/mcp-server.ts`
2. Verify tool imports are correct
3. Ensure all tools are properly exported

**Debug Steps**:
```bash
# Check MCP server startup
npm run start:mcp

# Verify tool registration
# Look for "Available tools:" in console output
```

### 🟡 MCP Server Connection Issues

**Error Message**:
```
Connection refused to MCP server
```

**Solutions**:
1. **Check if MCP server is running**:
   ```bash
   lsof -i :<mcp-port>
   ```

2. **Verify network connectivity**:
   ```bash
   telnet localhost <mcp-port>
   ```

3. **Check firewall settings**:
   - Ensure port is not blocked
   - Check local firewall rules

4. **Restart MCP server**:
   ```bash
   pkill -f "mcp-server"
   npm run start:mcp
   ```

---

## Compilation Issues

### ✅ TypeScript Compilation Errors

**Error Message**:
```
TS1259: Module '"path"' can only be default-imported using the 'esModuleInterop' flag
```

**Solution**:
```typescript
// Change from:
import path from 'path';

// To:
import * as path from 'path';
```

**Files to check**:
- `src/api/services/boiler-service.ts`
- `src/api/services/customer-service.ts`
- `src/api/services/warranty-service.ts`

### ✅ Set Iteration Errors

**Error Message**:
```
TS2802: Type 'Set<string>' can only be iterated through when using the '--downlevelIteration' flag
```

**Solution**:
```typescript
// Change from:
const manufacturers = [...new Set(warranties.map(w => w.manufacturer))];

// To:
const manufacturers = Array.from(new Set(warranties.map(w => w.manufacturer)));
```

**Files to check**:
- `src/api/services/warranty-service.ts`

---

## Port Issues

### ✅ Port Already in Use

**Error Message**:
```
EADDRINUSE: address already in use :::3001
```

**Solution**:
```bash
# Find process using the port
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change port in server.ts
const PORT = process.env.PORT || 3002;
```

### ✅ Port Conflicts with Other Services

**Common Conflicts**:
- Nuxt development server (port 3000)
- Other Node.js applications
- Development tools

**Solution**:
```bash
# Use different port
export PORT=3002
npm run start:api
```

---

## Dependency Issues

### ✅ Missing Dependencies

**Error Message**:
```
Cannot find module 'zod'
```

**Solution**:
```bash
# Install missing dependencies
npm install zod

# Check package.json for all required dependencies
npm install
```

### ✅ Version Conflicts

**Error Message**:
```
Peer dependency conflicts
```

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm audit fix
npm audit fix
```

---

## Testing Issues

### 🟡 Test Script Failures

**Error Message**:
```
Failed to get boiler information: fetch failed
```

**Root Cause**: Backend API server not running

**Solution**:
1. Start the API server first (if possible)
2. Use mock responses for testing
3. Test individual tool logic without API calls

**Alternative Testing**:
```bash
# Test tool schemas only
node -e "
const { boilerInfoTool } = require('./src/mcp/tools/boiler-info.js');
console.log('Schema validation:', boilerInfoTool.inputSchema);
"
```

### 🟡 MCP Tools Test Failures

**Error Message**:
```
Tool handler execution failed
```

**Debug Steps**:
1. Check tool input validation
2. Verify API endpoint responses
3. Test with valid test data
4. Check error handling

---

## Environment Issues

### ✅ Environment Variables

**Error Message**:
```
Cannot read property 'split' of undefined
```

**Solution**:
```bash
# Create .env file
echo "PORT=3001" > .env
echo "NODE_ENV=development" >> .env
echo "ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001" >> .env
```

### ✅ Node.js Version Issues

**Error Message**:
```
SyntaxError: Unexpected token '?'
```

**Solution**:
```bash
# Check Node.js version
node --version

# Update to Node.js 18+ if needed
# Recommended: Node.js 18.17.0 or higher
```

---

## External Integration Issues

### 🟡 Chatbot Connection Problems

**Error Message**:
```
Failed to connect to MCP server
```

**Solutions**:
1. **Verify MCP server is running**
2. **Check connection details**:
   - Protocol: MCP
   - Host: localhost
   - Port: (MCP server port)
3. **Test with MCP client tools**
4. **Check network connectivity**

### 🟡 Tool Call Failures

**Error Message**:
```
Tool execution failed
```

**Debug Steps**:
1. Check tool input parameters
2. Verify API server status
3. Test tool individually
4. Check error logs

---

## Performance Issues

### 🟡 Slow Response Times

**Symptoms**:
- Tool calls taking >5 seconds
- API responses delayed
- MCP server unresponsive

**Solutions**:
1. **Check system resources**:
   ```bash
   top
   htop
   ```

2. **Monitor network latency**:
   ```bash
   ping localhost
   ```

3. **Optimize database queries** (when using real database)
4. **Implement caching** for frequently accessed data

### 🟡 Memory Issues

**Symptoms**:
- High memory usage
- Server crashes
- Slow performance

**Solutions**:
1. **Monitor memory usage**:
   ```bash
   ps aux | grep node
   ```

2. **Implement memory limits**:
   ```bash
   node --max-old-space-size=512 src/api/server.ts
   ```

3. **Check for memory leaks** in tool handlers

---

## Security Issues

### ✅ Authentication Failures

**Error Message**:
```
401 Unauthorized
```

**Solution**:
```bash
# Use correct API key
curl -H "Authorization: Bearer demo-key" http://localhost:3001/health
```

### ✅ CORS Issues

**Error Message**:
```
CORS error: Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked
```

**Solution**:
```javascript
// Update CORS configuration in server.ts
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

---

## Debugging Tools

### 🔧 Enable Debug Logging

```bash
# Set debug environment variable
export DEBUG=*

# Start servers with debug output
npm run start:api
npm run start:mcp
```

### 🔧 Check Server Status

```bash
# Check if servers are running
lsof -i :3001  # API server
lsof -i :<mcp-port>  # MCP server

# Check process status
ps aux | grep node
```

### 🔧 Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test API endpoints
curl -H "Authorization: Bearer demo-key" \
  "http://localhost:3001/api/boiler-info?customer_id=CUST001"
```

### 🔧 Test MCP Tools

```bash
# Run test script
node test-mcp-tools.js

# Test individual tools
node -e "
const { boilerInfoTool } = require('./src/mcp/tools/boiler-info.js');
console.log('Tool loaded successfully');
"
```

---

## Getting Help

### 📋 Before Asking for Help

1. **Check this troubleshooting guide**
2. **Review the error logs**
3. **Verify your environment setup**
4. **Test with minimal configuration**
5. **Check the project documentation**

### 📋 Information to Provide

When reporting issues, include:
- **Error message** (exact text)
- **Steps to reproduce**
- **Environment details** (OS, Node.js version, etc.)
- **What you've tried**
- **Expected vs actual behavior**

### 📋 Useful Commands

```bash
# System information
node --version
npm --version
uname -a

# Project status
git status
npm list

# Server status
lsof -i :3001
ps aux | grep node

# Logs
tail -f logs/app.log  # if logging is configured
```

---

## Known Issues Summary

| Issue | Status | Priority | Impact |
|-------|--------|----------|--------|
| API Server Startup | 🔴 **BLOCKING** | High | Full integration |
| MCP Testing | 🟡 **DEPENDENT** | Medium | Demo completion |
| External Integration | 🟡 **DEPENDENT** | Medium | Demo completion |
| Documentation | ✅ **COMPLETE** | Low | None |

---

**Note**: This troubleshooting guide is updated as issues are resolved. The API server startup issue is the primary blocker that needs to be addressed for full integration testing. 