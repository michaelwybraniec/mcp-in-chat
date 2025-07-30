#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testCursorMCP() {
  console.log('🧪 Testing Cursor MCP Server...\n');
  
  const mcpProcess = spawn('node', [
    '../dist/mcp/mcp-server-cursor.js'
  ], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  const testMessages = [
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        clientInfo: { name: 'cursor', version: '1.0.0' }
      }
    },
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    }
  ];

  mcpProcess.stdout.on('data', (data) => {
    const response = data.toString().trim();
    console.log('📤 Response:', response);
    
    try {
      const parsed = JSON.parse(response);
      if (parsed.result && parsed.result.tools) {
        console.log(`✅ Found ${parsed.result.tools.length} tools`);
        parsed.result.tools.forEach(tool => {
          console.log(`   - ${tool.name}: ${tool.description}`);
        });
      }
    } catch (e) {
      console.log('⚠️  Non-JSON:', response);
    }
  });

  mcpProcess.stderr.on('data', (data) => {
    console.log('❌ Error:', data.toString().trim());
  });

  setTimeout(() => {
    console.log('\n📤 Sending messages...');
    testMessages.forEach((message, index) => {
      setTimeout(() => {
        const messageStr = JSON.stringify(message) + '\n';
        mcpProcess.stdin.write(messageStr);
      }, index * 1000);
    });
  }, 2000);

  setTimeout(() => {
    mcpProcess.kill();
  }, 8000);
}

testCursorMCP().catch(console.error); 