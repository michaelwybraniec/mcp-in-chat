#!/usr/bin/env node

/**
 * MCP Tools Test Script
 * 
 * This script tests each MCP tool to verify they can be called and return expected responses.
 * It tests the tools directly without requiring the MCP server to be running.
 */

// Use ts-node loader for TypeScript imports
import { boilerInfoTool } from '../src/mcp/tools/boiler-info.ts';
import { maintenanceTool } from '../src/mcp/tools/maintenance.ts';
import { purchaseTool } from '../src/mcp/tools/purchase.ts';
import { emailTool } from '../src/mcp/tools/email.ts';

const API_BASE_URL = 'http://localhost:3001';
const API_KEY = 'demo-key';

// Test data
const TEST_CUSTOMER_ID = 'CUST001';
const TEST_EMAIL = 'test@example.com';

/**
 * Test helper function
 */
async function testTool(toolName, tool, testData, expectedFields = []) {
  console.log(`\n🧪 Testing ${toolName}...`);
  
  try {
    // Validate input schema
    console.log(`  📝 Validating input schema...`);
    const validatedInput = tool.inputSchema.parse(testData);
    console.log(`  ✅ Input validation passed`);
    
    // Test the tool handler
    console.log(`  🔄 Calling tool handler...`);
    const result = await tool.handler(validatedInput);
    console.log(`  ✅ Tool handler executed successfully`);
    
    // Validate output schema
    console.log(`  📝 Validating output schema...`);
    const validatedOutput = tool.outputSchema.parse(result);
    console.log(`  ✅ Output validation passed`);
    
    // Check for expected fields
    if (expectedFields.length > 0) {
      console.log(`  🔍 Checking expected fields...`);
      for (const field of expectedFields) {
        if (result.data && result.data[field] !== undefined) {
          console.log(`  ✅ Field '${field}' found`);
        } else {
          console.log(`  ⚠️  Field '${field}' not found or undefined`);
        }
      }
    }
    
    console.log(`  📊 Response summary:`);
    console.log(`     Success: ${result.success}`);
    console.log(`     Message: ${result.message}`);
    console.log(`     Timestamp: ${result.timestamp}`);
    
    return { success: true, result };
  } catch (error) {
    console.log(`  ❌ Test failed: ${error.message}`);
    if (error.message.includes('fetch')) {
      console.log(`  💡 Note: This might be because the backend API is not running`);
      console.log(`     Start the API with: npm run start:api`);
    }
    return { success: false, error: error.message };
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting MCP Tools Test Suite\n');
  console.log('=' .repeat(60));
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };
  
  // Test 1: Boiler Info Tool
  results.total++;
  const boilerInfoTest = await testTool(
    'Boiler Info Tool',
    boilerInfoTool,
    { customer_id: TEST_CUSTOMER_ID },
    ['customer', 'boiler', 'warranty']
  );
  results.details.push({ tool: 'boiler-info', ...boilerInfoTest });
  if (boilerInfoTest.success) results.passed++; else results.failed++;
  
  // Test 2: Maintenance Tool (GET)
  results.total++;
  const maintenanceGetTest = await testTool(
    'Maintenance Tool (GET)',
    maintenanceTool,
    { customer_id: TEST_CUSTOMER_ID, action: 'get' },
    ['customer', 'current_status']
  );
  results.details.push({ tool: 'maintenance-get', ...maintenanceGetTest });
  if (maintenanceGetTest.success) results.passed++; else results.failed++;
  
  // Test 3: Maintenance Tool (SCHEDULE)
  results.total++;
  const maintenanceScheduleTest = await testTool(
    'Maintenance Tool (SCHEDULE)',
    maintenanceTool,
    { 
      customer_id: TEST_CUSTOMER_ID, 
      action: 'schedule',
      service_date: '2024-07-15',
      service_type: 'annual'
    },
    ['customer', 'booking', 'technician']
  );
  results.details.push({ tool: 'maintenance-schedule', ...maintenanceScheduleTest });
  if (maintenanceScheduleTest.success) results.passed++; else results.failed++;
  
  // Test 4: Purchase Tool
  results.total++;
  const purchaseTest = await testTool(
    'Purchase Tool',
    purchaseTool,
    {
      customer_id: TEST_CUSTOMER_ID,
      boiler_model: 'Worcester Bosch 8000 Style',
      payment_info: {
        method: 'credit_card',
        card_number: '1234567890123456',
        expiry_date: '12/25',
        cvv: '123',
        billing_address: '123 Test Street, Test City',
        amount: 2500
      },
      installation_required: true
    },
    ['order', 'payment', 'boiler', 'installation']
  );
  results.details.push({ tool: 'purchase', ...purchaseTest });
  if (purchaseTest.success) results.passed++; else results.failed++;
  
  // Test 5: Email Tool
  results.total++;
  const emailTest = await testTool(
    'Email Tool',
    emailTool,
    {
      to_email: TEST_EMAIL,
      subject: 'Test Email',
      message: 'This is a test email from the MCP tools test suite.',
      email_type: 'confirmation',
      customer_id: TEST_CUSTOMER_ID
    },
    ['message_id', 'sent_to', 'subject', 'sent_at']
  );
  results.details.push({ tool: 'email', ...emailTest });
  if (emailTest.success) results.passed++; else results.failed++;
  
  // Print test summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  // Print detailed results
  console.log('\n📋 DETAILED RESULTS');
  console.log('-'.repeat(60));
  results.details.forEach((detail, index) => {
    const status = detail.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${detail.tool}: ${status}`);
    if (!detail.success) {
      console.log(`   Error: ${detail.error}`);
    }
  });
  
  // Exit with appropriate code
  if (results.failed > 0) {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! MCP tools are working correctly.');
    process.exit(0);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
}); 