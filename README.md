# Boiler Maintenance MCP Server Demo

A demonstration project showcasing how MCP (Model Context Protocol) Server can integrate with external chatbots (Claude, ChatGPT, Cursor) to provide boiler maintenance and sales tools. Project is built with AWP - Agentic Workflow Protocol.

## 🎯 Project Goal

Demonstrate MCP Server integration with LLM chatbots by providing 4 focused tools for boiler maintenance and sales:
- **Boiler Info Tool**: Get customer boiler details and warranty information
- **Maintenance Tool**: Schedule maintenance with weather data and AI predictions
- **Purchase Tool**: Process orders with inventory check and technician scheduling
- **Email Tool**: Send confirmation emails

## 🏗️ Architecture

```
External Chatbots → MCP Server → Backend API → Mock Services → JSON Data
```

- **MCP Server**: Tool wrapper that calls backend API
- **Backend API**: Express.js with security middleware and business logic
- **Mock Services**: Simulated external services (payments, emails, weather, AI)
- **Data Layer**: JSON files with realistic boiler maintenance data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Access to external chatbot (Claude, ChatGPT, or Cursor)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd mcp-in-chat

# Install dependencies
npm install

# Start the backend API
npm run start:api

# In another terminal, start the MCP Server
npm run start:mcp
```

### Connect to External Chatbot
1. Start the MCP Server
2. Configure your chatbot to connect to the MCP Server
3. Test the tools with sample conversations

## 📁 Project Structure

```
mcp-in-chat/
├── src/
│   ├── mcp/                   # MCP Server (Tool Wrapper)
│   │   ├── tools/             # MCP tools that call backend API
│   │   └── mcp-server.ts      # Main MCP server entry point
│   ├── api/                   # Backend API (All Business Logic)
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Security & validation
│   │   ├── services/          # Business logic services
│   │   └── server.ts          # Express API server
│   └── types/                 # TypeScript definitions
├── data/                      # Mock Database (JSON files)
├── docs/                      # Documentation
├── demo/                      # Demo materials
└── README.md
```

## 🛠️ Development

### 3-Hour Development Timeline
- **Phase 1**: Project Foundation & Setup (45 min)
- **Phase 2**: Backend API Development (90 min)
- **Phase 3**: MCP Server Development (45 min)
- **Phase 4**: External Integration & Demo (60 min)

### Key Features
- **Mock Everything**: All external services are simulated
- **Security**: Authentication, validation, and rate limiting
- **TypeScript**: Full type safety throughout
- **Comprehensive**: 4 API endpoints, 4 MCP tools, multiple mock services

## 📚 Documentation

- [Setup Guide](docs/setup.md) - Step-by-step installation
- [API Documentation](docs/api-endpoints.md) - All 4 API endpoints
- [MCP Tools](docs/mcp-tools.md) - Tool descriptions and examples
- [Demo Scenarios](demo/conversation-flows.md) - Sample conversations
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## 🎭 Demo Scenarios

### Scenario 1: Boiler Information
**User**: "What's the warranty status of my boiler?"
**Chatbot**: Uses Boiler Info Tool to retrieve customer boiler details and warranty information

### Scenario 2: Maintenance Scheduling
**User**: "I need to schedule maintenance for my boiler"
**Chatbot**: Uses Maintenance Tool to check schedule, consider weather, and book service

### Scenario 3: Boiler Upgrade
**User**: "I want to upgrade my boiler to a more efficient model"
**Chatbot**: Uses Purchase Tool to show inventory, compare models, and process order

### Scenario 4: Emergency Service
**User**: "My boiler is making strange noises, I need help"
**Chatbot**: Uses Maintenance Tool to schedule emergency service and Email Tool to send confirmation

## 🔧 Mock Services

All external services are mocked for demonstration:
- **Database**: JSON files instead of real database
- **Payments**: Mock payment processing (always succeeds)
- **Emails**: Console logging instead of real email sending
- **Weather**: Mock weather data for scheduling
- **AI Predictions**: Simulated maintenance predictions
- **Technician Scheduling**: Mock availability and booking

## 🎯 Success Criteria

- ✅ MCP Server starts and exposes all 4 tools
- ✅ Backend API responds to all tool requests
- ✅ External chatbot can successfully use the tools
- ✅ Demo shows realistic boiler maintenance scenarios
- ✅ All mock data and services work as expected
- ✅ Presentation demonstrates MCP Server integration value

## 🚨 Risk Mitigation

### External Chatbot Access
- **Plan A**: Test with Claude, ChatGPT, or Cursor
- **Plan B**: Use local testing with MCP client tools
- **Plan C**: Record demo video for presentation

### Time Overrun
- **Priority 1**: Core MCP tools (boiler info, maintenance)
- **Priority 2**: Purchase and email tools
- **Priority 3**: Enhanced features (weather, AI predictions)

### Technical Issues
- **Fallback**: Local testing with curl/Postman
- **Documentation**: Comprehensive troubleshooting guide
- **Support**: Clear error messages and logging

## 📊 Demo Success Metrics

- ✅ MCP Server connects to external chatbot
- ✅ All 4 tools respond correctly
- ✅ Complete conversation flow demonstrated
- ✅ Audience understands MCP Server value
- ✅ Demo runs smoothly without technical issues

## 🤝 Contributing

This is a demonstration project. For production use:
1. Replace mock services with real implementations
2. Add proper security and authentication
3. Implement real database connections
4. Add comprehensive testing and monitoring

## 📄 License

This project is for demonstration purposes only.

---

**Note**: This is a demonstration project focused on showcasing MCP Server capabilities, not a production-ready system. 