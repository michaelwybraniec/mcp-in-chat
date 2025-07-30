# Test Suite Documentation

This folder contains all test files for the Boiler Maintenance MCP Server project.

## 🧪 Test Files Overview

### Core MCP Tests

#### `test-mcp-tools.js` - **Main Test Suite**
- **Purpose**: Comprehensive testing of all 4 MCP tools
- **Tests**: boiler-info, maintenance (GET/SCHEDULE), purchase, email
- **Usage**: `npm test` or `npm run test`
- **Output**: Detailed test results with success/failure status

#### `test-mcp-cursor.js` - **Cursor Integration Test**
- **Purpose**: Tests MCP server specifically for Cursor IDE integration
- **Tests**: MCP protocol initialization and tool listing
- **Usage**: `npm run test:mcp`
- **Output**: Tool availability confirmation

#### `quick-mcp-test.js` - **Quick Health Check**
- **Purpose**: Fast MCP server health check for dashboard
- **Tests**: Basic MCP protocol communication
- **Usage**: `npm run test:quick`
- **Output**: Simple pass/fail status

### Protocol & Connection Tests

#### `test-mcp-protocol.js` - **MCP Protocol Test**
- **Purpose**: Validates MCP JSON-RPC protocol implementation
- **Tests**: initialize, tools/list, proper JSON-RPC formatting
- **Usage**: `npm run test:protocol`
- **Output**: Protocol compliance verification

#### `test-mcp-connection.js` - **Connection Test**
- **Purpose**: Tests MCP server startup and basic connectivity
- **Tests**: Process spawning, stdout/stderr handling
- **Usage**: `npm run test:connection`
- **Output**: Connection status and process information

#### `test-mcp-compiled.js` - **Compiled Version Test**
- **Purpose**: Tests the compiled JavaScript version of MCP server
- **Tests**: MCP protocol with compiled dist/mcp-server-simple.js
- **Usage**: `npm run test:compiled`
- **Output**: Compiled version functionality verification

### API Tests

#### `test-api.js` - **Backend API Test**
- **Purpose**: Tests the Express.js backend API endpoints
- **Tests**: All 4 API endpoints (boiler-info, maintenance, purchase, email)
- **Usage**: `npm run test:api`
- **Output**: API endpoint functionality and response validation

## 🚀 Running Tests

### Quick Commands
```bash
# Run all MCP tool tests
npm test

# Test specific components
npm run test:api          # Backend API tests
npm run test:mcp          # Cursor MCP integration
npm run test:protocol     # MCP protocol validation
npm run test:compiled     # Compiled version test
npm run test:connection   # Connection test
npm run test:quick        # Quick health check
```

### Manual Testing
```bash
# Run individual test files
node test/test-mcp-tools.js
node test/test-api.js
node test/test-mcp-cursor.js
node test/test-mcp-protocol.js
node test/test-mcp-compiled.js
node test/test-mcp-connection.js
node test/quick-mcp-test.js
```

## 📊 Test Results Interpretation

### Success Indicators
- ✅ **All tests passing**: System is fully operational
- ✅ **MCP tools responding**: Ready for external chatbot integration
- ✅ **API endpoints working**: Backend services functional
- ✅ **Protocol compliance**: MCP standard properly implemented

### Common Issues
- ❌ **API server not running**: Start with `npm run start:api`
- ❌ **MCP server not responding**: Check compilation and startup
- ❌ **Protocol errors**: Verify MCP SDK version and implementation
- ❌ **Connection failures**: Check file paths and permissions

## 🔧 Test Dependencies

### Prerequisites
- **API Server**: Must be running on port 3001
- **MCP Server**: Must be compiled and accessible
- **Node.js**: Version 18+ required
- **Dependencies**: All npm packages installed

### Test Data
- **Customer ID**: CUST001 (used in all tests)
- **Mock Services**: All external services simulated
- **JSON Data**: Realistic boiler maintenance data

## 📈 Test Coverage

### MCP Tools Coverage
- ✅ **boiler-info**: Customer and boiler information retrieval
- ✅ **maintenance**: Service scheduling and booking
- ✅ **purchase**: Order processing and payment
- ✅ **email**: Confirmation email sending

### API Endpoints Coverage
- ✅ **GET /api/boiler-info**: Customer boiler details
- ✅ **GET /api/maintenance**: Current maintenance status
- ✅ **POST /api/maintenance**: Schedule new maintenance
- ✅ **POST /api/purchase**: Process boiler purchase
- ✅ **POST /api/send-email**: Send confirmation emails

### Integration Coverage
- ✅ **MCP ↔ API**: Tool to endpoint communication
- ✅ **Protocol Compliance**: JSON-RPC standard adherence
- ✅ **Error Handling**: Graceful failure management
- ✅ **Data Validation**: Input/output schema validation

## 🎯 Test Scenarios

### Scenario 1: Complete Customer Journey
```bash
npm test  # Tests full customer interaction flow
```

### Scenario 2: API Health Check
```bash
npm run test:api  # Validates all backend endpoints
```

### Scenario 3: MCP Integration
```bash
npm run test:mcp  # Tests external chatbot integration
```

### Scenario 4: Protocol Validation
```bash
npm run test:protocol  # Ensures MCP standard compliance
```

## 📝 Adding New Tests

### Test File Structure
```javascript
// test/new-test.js
import { expect } from 'chai';  // If using assertion library

async function testNewFeature() {
  // Test implementation
  console.log('🧪 Testing new feature...');
  
  // Test logic here
  
  console.log('✅ Test passed!');
}

// Run test
testNewFeature().catch(console.error);
```

### Test Naming Convention
- **File names**: `test-{component}-{purpose}.js`
- **Function names**: `test{Feature}`
- **Descriptions**: Clear purpose and expected outcome

## 🔍 Debugging Tests

### Common Debug Commands
```bash
# Run with verbose output
node test/test-mcp-tools.js 2>&1 | tee test-output.log

# Check API server status
curl http://localhost:3001/health

# Test MCP server directly
node dist/mcp-server-simple.js
```

### Log Analysis
- **stdout**: Test results and success messages
- **stderr**: Error messages and debugging information
- **Exit codes**: 0 = success, 1 = failure

---

**Test Suite Status**: ✅ **All tests passing** - System ready for production use! 