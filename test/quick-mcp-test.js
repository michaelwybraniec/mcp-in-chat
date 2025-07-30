#!/usr/bin/env node

import { spawn } from 'child_process';

async function quickMCPTest() {
  return new Promise((resolve) => {
    const mcpProcess = spawn('node', [
      'dist/mcp/mcp-server-cursor.js'
    ], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const testMessage = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        clientInfo: { name: 'test', version: '1.0.0' }
      }
    };

    let responseReceived = false;
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        mcpProcess.kill();
        resolve(false);
      }
    }, 3000);

    mcpProcess.stdout.on('data', (data) => {
      try {
        const response = JSON.parse(data.toString().trim());
        if (response.jsonrpc === '2.0' && response.result) {
          responseReceived = true;
          clearTimeout(timeout);
          mcpProcess.kill();
          resolve(true);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    });

    mcpProcess.stderr.on('data', () => {
      // Ignore stderr
    });

    setTimeout(() => {
      const messageStr = JSON.stringify(testMessage) + '\n';
      mcpProcess.stdin.write(messageStr);
    }, 500);
  });
}

// Run the test
quickMCPTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(() => {
  process.exit(1);
}); 