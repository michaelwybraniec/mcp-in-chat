#!/usr/bin/env node

/**
 * Test Compiled MCP Server
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testCompiledMCP() {
  console.log('🧪 Testing Compiled MCP Server...\n');
  
  const mcpProcess = spawn('node', [
    '../dist/mcp/mcp-server-simple.js'
  ], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test MCP protocol messages
  const testMessages = [
    // Initialize request
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    },
    // List tools request
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    }
  ];

  mcpProcess.stdout.on('data', (data) => {
    const response = data.toString().trim();
    console.log('📤 MCP Response:', response);
    
    try {
      const parsed = JSON.parse(response);
      if (parsed.result && parsed.result.tools) {
        console.log(`✅ Found ${parsed.result.tools.length} tools`);
        parsed.result.tools.forEach(tool => {
          console.log(`   - ${tool.name}: ${tool.description}`);
        });
      }
    } catch (e) {
      console.log('⚠️  Non-JSON response:', response);
    }
  });

  mcpProcess.stderr.on('data', (data) => {
    console.log('❌ MCP Error:', data.toString().trim());
  });

  // Send test messages
  setTimeout(() => {
    console.log('\n📤 Sending MCP protocol messages...');
    testMessages.forEach((message, index) => {
      setTimeout(() => {
        const messageStr = JSON.stringify(message) + '\n';
        console.log(`📤 Sending message ${index + 1}:`, messageStr.trim());
        mcpProcess.stdin.write(messageStr);
      }, index * 1000);
    });
  }, 2000);

  // Cleanup
  setTimeout(() => {
    console.log('\n🛑 Stopping MCP Server...');
    mcpProcess.kill();
  }, 8000);
}

testCompiledMCP().catch(console.error); 