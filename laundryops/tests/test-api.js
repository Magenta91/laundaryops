// Simple API test script
const baseUrl = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing LaundryOps API\n');
  console.log('='.repeat(60));

  // Test 1: Health Check
  console.log('\n1. Testing Health Check...');
  try {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 2: Create Order 1
  console.log('\n2. Creating Order 1 (Rajesh Kumar)...');
  let orderId1;
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Rajesh Kumar',
        phone: '9876543210',
        garments: [
          { garment: 'Shirt', quantity: 3 },
          { garment: 'Pants', quantity: 2 }
        ]
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    orderId1 = data.id;
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 3: Create Order 2
  console.log('\n3. Creating Order 2 (Priya Sharma)...');
  let orderId2;
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Priya Sharma',
        phone: '9123456789',
        garments: [
          { garment: 'Saree', quantity: 2 },
          { garment: 'Kurta', quantity: 1 }
        ]
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    orderId2 = data.id;
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 4: Get All Orders
  console.log('\n4. Getting All Orders...');
  try {
    const res = await fetch(`${baseUrl}/api/orders`);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 5: Get Single Order
  if (orderId1) {
    console.log(`\n5. Getting Single Order (${orderId1})...`);
    try {
      const res = await fetch(`${baseUrl}/api/orders/${orderId1}`);
      const data = await res.json();
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.log('Error:', error.message);
    }
  }

  // Test 6: Update Order Status
  if (orderId1) {
    console.log(`\n6. Updating Order Status to PROCESSING...`);
    try {
      const res = await fetch(`${baseUrl}/api/orders/${orderId1}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSING' })
      });
      const data = await res.json();
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.log('Error:', error.message);
    }
  }

  // Test 7: Dashboard
  console.log('\n7. Getting Dashboard...');
  try {
    const res = await fetch(`${baseUrl}/api/dashboard`);
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 8: Validation - Unknown Garment
  console.log('\n8. Testing Validation (Unknown Garment - should fail)...');
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Test User',
        phone: '1234567890',
        garments: [{ garment: 'Socks', quantity: 1 }]
      })
    });
    const data = await res.json();
    console.log('Status:', res.status, '(Expected 400)');
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 9: Validation - Invalid Status
  console.log('\n9. Testing Validation (Invalid Status - should fail)...');
  try {
    const res = await fetch(`${baseUrl}/api/orders/ORD-test/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'INVALID' })
    });
    const data = await res.json();
    console.log('Status:', res.status, '(Expected 400)');
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 10: 404 - Order Not Found
  console.log('\n10. Testing 404 (Order Not Found)...');
  try {
    const res = await fetch(`${baseUrl}/api/orders/ORD-notfound`);
    const data = await res.json();
    console.log('Status:', res.status, '(Expected 404)');
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!\n');
}

testAPI().catch(console.error);
