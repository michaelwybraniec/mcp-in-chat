#!/usr/bin/env node

/**
 * Simple MCP Server Connection Test
 * Tests if the MCP server is responding correctly
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testMCPServer() {
  console.log('🧪 Testing MCP Server Connection...\n');
  
  const mcpProcess = spawn('node', [
    '--loader', 'ts-node/esm',
    '../src/mcp/mcp-server.ts'
  ], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  let errorOutput = '';

  mcpProcess.stdout.on('data', (data) => {
    output += data.toString();
    console.log('📤 MCP Output:', data.toString().trim());
  });

  mcpProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.log('❌ MCP Error:', data.toString().trim());
  });

  mcpProcess.on('close', (code) => {
    console.log(`\n🔍 MCP Server exited with code ${code}`);
    
    if (code === 0) {
      console.log('✅ MCP Server started successfully');
      if (output.includes('Available tools:')) {
        console.log('✅ Tools are being registered');
      } else {
        console.log('⚠️  No tools found in output');
      }
    } else {
      console.log('❌ MCP Server failed to start');
      console.log('Error output:', errorOutput);
    }
  });

  // Wait a bit for the server to start
  setTimeout(() => {
    console.log('\n🛑 Stopping MCP Server...');
    mcpProcess.kill();
  }, 5000);
}

testMCPServer().catch(console.error); 