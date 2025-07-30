# Cursor MCP Testing - Quick Reference

## 🚀 Quick Start

1. **Start Servers**:
   ```bash
   npm run start:api &    # Backend API (port 3001)
   npm run start:mcp &    # MCP Server (port 3000)
   ```

2. **Configure Cursor**:
   - Open Command Palette: `Cmd+Shift+P`
   - Search: "MCP: Add Server"
   - Add configuration:
   ```json
   {
     "name": "boiler-maintenance-mcp",
     "command": "node",
     "args": ["--loader", "ts-node/esm", "/Users/michaelwybraniec/Documents/GitHub/mcp-in-chat/src/mcp/mcp-server.ts"],
     "env": {"NODE_ENV": "development"}
   }
   ```

## 🧪 Test Commands

### Test 1: Boiler Info
```
"Get boiler information for customer CUST001"
```

### Test 2: Maintenance
```
"Schedule maintenance for CUST001 on 2024-08-15"
```

### Test 3: Purchase
```
"Process purchase for CUST001 - Worcester Bosch 8000 Style boiler"
```

### Test 4: Email
```
"Send confirmation email to test@example.com"
```

## ✅ Expected Results

- **4 Tools Available**: boiler-info, maintenance, purchase, email
- **Natural Integration**: Tools work seamlessly in conversation
- **Real Data**: Returns realistic boiler maintenance data
- **Error Handling**: Graceful handling of invalid requests

## 🔧 Troubleshooting

- **Server Not Found**: Check if both servers are running
- **Tools Missing**: Restart Cursor after MCP configuration
- **Execution Errors**: Verify API server on port 3001

## 📊 Success Indicators

✅ MCP server connects to Cursor  
✅ All 4 tools appear in tool list  
✅ Tools execute and return data  
✅ Integration feels natural  
✅ Error handling works properly  

---

**Status**: Ready for testing! 🎯 