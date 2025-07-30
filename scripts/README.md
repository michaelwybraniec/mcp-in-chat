# Scripts Documentation

This folder contains utility scripts for monitoring, testing, and managing the Boiler Maintenance MCP Server.

## 🛠️ Scripts Overview

### Monitoring Scripts

#### `logs-dashboard.sh` - **Real-time Dashboard**
- **Purpose**: Comprehensive real-time monitoring dashboard
- **Features**: 
  - API server status monitoring
  - MCP server process tracking
  - Network connection monitoring
  - System resource usage
  - Quick health tests
- **Usage**: `npm run dashboard` or `./scripts/logs-dashboard.sh`
- **Output**: Color-coded status updates every 10 seconds

#### `monitor-logs.sh` - **Log Monitoring**
- **Purpose**: Basic log monitoring and process tracking
- **Features**:
  - Process status monitoring
  - Network connection checking
  - File activity tracking
- **Usage**: `npm run monitor` or `./scripts/monitor-logs.sh`
- **Output**: Simple status updates every 5 seconds

#### `status-check.sh` - **Quick Status Check**
- **Purpose**: One-time comprehensive status check
- **Features**:
  - API server health check
  - MCP server responsiveness test
  - Process listing
  - Cursor MCP instances count
- **Usage**: `npm run status` or `./scripts/status-check.sh`
- **Output**: Single comprehensive status report

## 🚀 Quick Commands

### Using npm Scripts (Recommended)
```bash
# Start monitoring dashboard
npm run dashboard

# Quick status check
npm run status

# Basic log monitoring
npm run monitor
```

### Direct Script Execution
```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run scripts directly
./scripts/logs-dashboard.sh
./scripts/status-check.sh
./scripts/monitor-logs.sh
```

## 📊 Dashboard Features

### Real-time Monitoring
- **API Server**: Port 3001 health checks
- **MCP Server**: Process status and responsiveness
- **Network**: Connection monitoring
- **Resources**: CPU and memory usage
- **Tests**: Automated health checks

### Color-coded Status
- 🟢 **Green**: All systems operational
- 🟡 **Yellow**: Warning or partial issues
- 🔴 **Red**: Critical errors or failures
- 🔵 **Blue**: Informational messages

### Auto-refresh
- **Dashboard**: Updates every 10 seconds
- **Monitor**: Updates every 5 seconds
- **Status**: Single comprehensive report

## 🔧 Script Dependencies

### Required Tools
- **curl**: API health checks
- **jq**: JSON parsing for API responses
- **ps**: Process monitoring
- **lsof**: Network connection checking
- **timeout**: Test timeouts

### System Requirements
- **Bash**: Shell script execution
- **Node.js**: Test script execution
- **Permissions**: Execute permissions on scripts

## 📈 Monitoring Metrics

### API Server Metrics
- **Response Time**: Health check latency
- **Status Code**: HTTP response codes
- **Uptime**: Process running duration
- **Port Status**: Port 3001 availability

### MCP Server Metrics
- **Process Count**: Number of running instances
- **Response Time**: Tool execution latency
- **Protocol Compliance**: MCP standard adherence
- **Tool Availability**: 4 tools operational status

### System Metrics
- **CPU Usage**: Process resource consumption
- **Memory Usage**: RAM utilization
- **Network Connections**: Active connections
- **File Activity**: Recent file changes

## 🎯 Use Cases

### Development
```bash
# Monitor during development
npm run dashboard
```

### Testing
```bash
# Quick health check before testing
npm run status
```

### Production
```bash
# Continuous monitoring
npm run monitor
```

### Troubleshooting
```bash
# Comprehensive status check
npm run status
```

## 🔍 Troubleshooting

### Common Issues

#### Script Not Executable
```bash
# Fix permissions
chmod +x scripts/*.sh
```

#### Missing Dependencies
```bash
# Install required tools (macOS)
brew install jq

# Install required tools (Ubuntu)
sudo apt-get install jq
```

#### API Server Not Responding
```bash
# Start API server
npm run start:api

# Check status
npm run status
```

#### MCP Server Issues
```bash
# Start MCP server
npm run start:mcp

# Test MCP server
npm run test:quick
```

## 📝 Customization

### Dashboard Refresh Rate
Edit `logs-dashboard.sh`:
```bash
# Change refresh interval (seconds)
sleep 10  # Default: 10 seconds
```

### Status Check Timeout
Edit `status-check.sh`:
```bash
# Change test timeout (seconds)
timeout 5 node quick-mcp-test.js  # Default: 5 seconds
```

### Monitor Interval
Edit `monitor-logs.sh`:
```bash
# Change update interval (seconds)
sleep 5  # Default: 5 seconds
```

## 🔒 Security Notes

### Script Permissions
- **Execute**: Scripts require execute permissions
- **Read**: Scripts read process and network information
- **Write**: Scripts may create log files

### Network Access
- **Local Only**: Scripts only access localhost
- **Port 3001**: API server health checks
- **No External**: No external network access

### Data Access
- **Process Info**: Reads system process information
- **Network Info**: Reads network connection data
- **File System**: Reads project files and logs

---

**Scripts Status**: ✅ **All scripts operational** - Ready for monitoring and management! 