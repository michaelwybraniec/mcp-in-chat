import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';
const API_KEY = 'demo-key';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  // Test health endpoint
  try {
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health endpoint:', healthData);
  } catch (error) {
    console.log('❌ Health endpoint failed:', error.message);
  }

  // Test boiler-info endpoint
  try {
    const boilerResponse = await fetch(`${BASE_URL}/api/boiler-info?customer_id=CUST001`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const boilerData = await boilerResponse.json();
    console.log('✅ Boiler info endpoint:', boilerData.success ? 'Success' : 'Failed');
  } catch (error) {
    console.log('❌ Boiler info endpoint failed:', error.message);
  }

  // Test maintenance endpoint
  try {
    const maintenanceResponse = await fetch(`${BASE_URL}/api/maintenance?customer_id=CUST001`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const maintenanceData = await maintenanceResponse.json();
    console.log('✅ Maintenance endpoint:', maintenanceData.success ? 'Success' : 'Failed');
  } catch (error) {
    console.log('❌ Maintenance endpoint failed:', error.message);
  }

  // Test email endpoint
  try {
    const emailResponse = await fetch(`${BASE_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_email: 'test@example.com',
        subject: 'Test Email',
        message: 'This is a test email'
      })
    });
    const emailData = await emailResponse.json();
    console.log('✅ Email endpoint:', emailData.success ? 'Success' : 'Failed');
  } catch (error) {
    console.log('❌ Email endpoint failed:', error.message);
  }

  console.log('\n🏁 API testing complete!');
}

testAPI().catch(console.error); 