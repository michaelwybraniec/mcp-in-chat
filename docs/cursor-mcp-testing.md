# Testing MCP Server in Cursor IDE

This guide will help you test the Boiler Maintenance MCP Server in Cursor IDE.

## 🚀 Prerequisites

1. **Cursor IDE** installed and running
2. **Both servers running**:
   - Backend API: `npm run start:api` (port 3001)
   - MCP Server: `npm run start:mcp` (port 3000)

## 📋 Step-by-Step Testing Guide

### Step 1: Verify Servers are Running

Check that both servers are running:

```bash
# Check if API server is running
curl http://localhost:3001/health

# Check if MCP server is running
curl http://localhost:3000/health
```

### Step 2: Configure Cursor for MCP

1. **Open Cursor IDE**
2. **Open Command Palette**: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. **Search for "MCP"** or "Model Context Protocol"
4. **Select "MCP: Add Server"** or similar option

### Step 3: Add MCP Server Configuration

In Cursor's MCP configuration, add the following:

```json
{
  "name": "boiler-maintenance-mcp",
  "command": "node",
  "args": [
    "--loader", "ts-node/esm",
    "/Users/michaelwybraniec/Documents/GitHub/mcp-in-chat/src/mcp/mcp-server.ts"
  ],
  "env": {
    "NODE_ENV": "development"
  }
}
```

**Alternative Method**: If Cursor has a GUI for MCP configuration:
- **Server Name**: `boiler-maintenance-mcp`
- **Command**: `node`
- **Arguments**: `--loader ts-node/esm /path/to/your/project/src/mcp/mcp-server.ts`
- **Working Directory**: `/Users/michaelwybraniec/Documents/GitHub/mcp-in-chat`

### Step 4: Test MCP Tools in Cursor

Once connected, you can test the tools by asking Cursor to use them:

#### Test 1: Boiler Information
```
"Can you get the boiler information for customer CUST001?"
```

**Expected Response**: Cursor should use the `boiler-info` tool and return customer boiler details and warranty information.

#### Test 2: Maintenance Scheduling
```
"I need to schedule maintenance for customer CUST001 on 2024-08-15"
```

**Expected Response**: Cursor should use the `maintenance` tool to schedule maintenance with weather considerations and technician booking.

#### Test 3: Purchase Processing
```
"Customer CUST001 wants to purchase a Worcester Bosch 8000 Style boiler"
```

**Expected Response**: Cursor should use the `purchase` tool to process the order with payment and inventory check.

#### Test 4: Email Confirmation
```
"Send a confirmation email to test@example.com about the maintenance appointment"
```

**Expected Response**: Cursor should use the `email` tool to send a confirmation email.

## 🔧 Troubleshooting

### Issue 1: MCP Server Not Found
**Problem**: Cursor can't find the MCP server
**Solution**: 
- Verify the server is running: `ps aux | grep mcp-server`
- Check the path in configuration is correct
- Ensure working directory is set properly

### Issue 2: Tools Not Available
**Problem**: MCP tools don't appear in Cursor
**Solution**:
- Restart Cursor after adding MCP configuration
- Check server logs for any errors
- Verify both API and MCP servers are running

### Issue 3: Tool Execution Fails
**Problem**: Tools execute but return errors
**Solution**:
- Check API server is running on port 3001
- Verify authentication headers are being sent
- Check server logs for detailed error messages

## 📊 Expected Tool Responses

### boiler-info Tool
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "CUST001",
      "name": "John Smith",
      "email": "john.smith@email.com",
      "boiler_model": "Worcester Bosch 8000 Style"
    },
    "boiler": {
      "model": "Worcester Bosch 8000 Style",
      "manufacturer": "Worcester Bosch",
      "efficiency": "94%",
      "features": ["Combi boiler", "A-Rated efficiency", "10-year warranty"]
    },
    "warranty": {
      "duration": "10 years",
      "coverage": "Parts and labour",
      "conditions": "Annual service required"
    }
  }
}
```

### maintenance Tool (Schedule)
```json
{
  "success": true,
  "data": {
    "booking": {
      "booking_id": "BK-XXXXX",
      "service_date": "2024-08-15",
      "service_time": "09:00",
      "service_type": "annual",
      "technician_id": "TECH001",
      "status": "confirmed"
    },
    "technician": {
      "id": "TECH001",
      "rating": 4.8,
      "skills": ["Worcester Bosch", "Vaillant", "Ideal"]
    },
    "weather_conditions": {
      "suitable": true,
      "location": "London",
      "date": "2024-08-15"
    }
  }
}
```

### purchase Tool
```json
{
  "success": true,
  "data": {
    "order": {
      "order_id": "ORD-XXXXX",
      "customer_id": "CUST001",
      "boiler_model": "Worcester Bosch 8000 Style",
      "total": 2500,
      "payment_method": "credit_card",
      "payment_status": "completed"
    },
    "payment": {
      "success": true,
      "transaction_id": "TXN-XXXXX",
      "amount": 2500,
      "method": "credit_card"
    },
    "boiler": {
      "model": "Worcester Bosch 8000 Style",
      "manufacturer": "Worcester Bosch",
      "efficiency": "94%",
      "features": ["Combi boiler", "A-Rated efficiency"]
    }
  }
}
```

### email Tool
```json
{
  "success": true,
  "data": {
    "message_id": "MSG-XXXXX",
    "sent_to": "test@example.com",
    "subject": "Maintenance Confirmation",
    "sent_at": "2024-07-30T22:00:00.000Z"
  }
}
```

## 🎯 Success Criteria

✅ **MCP Server Connects**: Cursor successfully connects to the MCP server
✅ **Tools Available**: All 4 tools appear in Cursor's tool list
✅ **Tool Execution**: Each tool executes and returns expected data
✅ **Error Handling**: Proper error messages for invalid requests
✅ **Integration**: Seamless integration between Cursor and MCP tools

## 📝 Testing Checklist

- [ ] MCP server starts without errors
- [ ] Cursor can connect to MCP server
- [ ] All 4 tools are available in Cursor
- [ ] boiler-info tool returns customer data
- [ ] maintenance tool schedules appointments
- [ ] purchase tool processes orders
- [ ] email tool sends confirmations
- [ ] Error handling works for invalid requests
- [ ] Integration feels natural in conversation

## 🚨 Common Issues

1. **Port Conflicts**: Ensure ports 3000 and 3001 are available
2. **Path Issues**: Verify absolute paths in MCP configuration
3. **Permissions**: Ensure Cursor has permission to execute the MCP server
4. **Dependencies**: Make sure all npm dependencies are installed

## 📞 Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify both servers are running
3. Test the API endpoints directly with curl
4. Check Cursor's MCP documentation for configuration details

---

**Note**: This guide assumes Cursor has MCP support. If Cursor doesn't have built-in MCP support, you may need to use alternative methods or wait for MCP integration to be added to Cursor. 