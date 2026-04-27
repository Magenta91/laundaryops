// Comprehensive API test script
const baseUrl = 'http://localhost:3000';

async function comprehensiveTest() {
  console.log('🧪 COMPREHENSIVE LaundryOps API TEST\n');
  console.log('='.repeat(70));

  let passedTests = 0;
  let failedTests = 0;

  const test = (name, condition, expected, actual) => {
    if (condition) {
      console.log(`✅ ${name}`);
      passedTests++;
    } else {
      console.log(`❌ ${name}`);
      console.log(`   Expected: ${expected}, Got: ${actual}`);
      failedTests++;
    }
  };

  // Test 1: Health Check
  console.log('\n📋 REQUIREMENT 7: Health Check');
  try {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    test('Health endpoint returns 200', res.status === 200, 200, res.status);
    test('Health has status "ok"', data.status === 'ok', 'ok', data.status);
    test('Health has db "connected"', data.db === 'connected', 'connected', data.db);
    test('Health has uptime_seconds', typeof data.uptime_seconds === 'number', 'number', typeof data.uptime_seconds);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    failedTests += 4;
  }

  // Test 2: Create Orders
  console.log('\n📋 REQUIREMENT 2: Create Order');
  let order1Id, order2Id, order3Id;
  
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
    test('Create order returns 201', res.status === 201, 201, res.status);
    test('Order has ID with ORD- prefix', data.id && data.id.startsWith('ORD-'), true, data.id?.startsWith('ORD-'));
    test('Order calculates total_bill correctly', data.total_bill === 270, 270, data.total_bill);
    test('Order status is RECEIVED', data.status === 'RECEIVED', 'RECEIVED', data.status);
    test('Order has items array', Array.isArray(data.items), true, Array.isArray(data.items));
    test('Order has 2 items', data.items?.length === 2, 2, data.items?.length);
    order1Id = data.id;
  } catch (error) {
    console.log('❌ Create order 1 failed:', error.message);
    failedTests += 6;
  }

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
    test('Create order 2 returns 201', res.status === 201, 201, res.status);
    test('Order 2 total_bill is 320', data.total_bill === 320, 320, data.total_bill);
    order2Id = data.id;
  } catch (error) {
    console.log('❌ Create order 2 failed:', error.message);
    failedTests += 2;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Amit Patel',
        phone: '9988776655',
        garments: [
          { garment: 'Jacket', quantity: 1 },
          { garment: 'Bedsheet', quantity: 2 },
          { garment: 'Towel', quantity: 5 }
        ]
      })
    });
    const data = await res.json();
    test('Create order 3 returns 201', res.status === 201, 201, res.status);
    test('Order 3 total_bill is 500', data.total_bill === 500, 500, data.total_bill);
    order3Id = data.id;
  } catch (error) {
    console.log('❌ Create order 3 failed:', error.message);
    failedTests += 2;
  }

  // Test 3: Validation Tests
  console.log('\n📋 REQUIREMENT 2: Validation');
  
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Test',
        phone: '1234567890',
        garments: [{ garment: 'Socks', quantity: 1 }]
      })
    });
    const data = await res.json();
    test('Unknown garment returns 400', res.status === 400, 400, res.status);
    test('Unknown garment error message', data.error === 'Unknown garment: Socks', 'Unknown garment: Socks', data.error);
  } catch (error) {
    console.log('❌ Unknown garment test failed:', error.message);
    failedTests += 2;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '1234567890',
        garments: [{ garment: 'Shirt', quantity: 1 }]
      })
    });
    const data = await res.json();
    test('Missing customer_name returns 400', res.status === 400, 400, res.status);
  } catch (error) {
    console.log('❌ Missing customer_name test failed:', error.message);
    failedTests++;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Test',
        phone: '1234567890',
        garments: []
      })
    });
    const data = await res.json();
    test('Empty garments array returns 400', res.status === 400, 400, res.status);
  } catch (error) {
    console.log('❌ Empty garments test failed:', error.message);
    failedTests++;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Test',
        phone: '1234567890',
        garments: [{ garment: 'Shirt', quantity: 0 }]
      })
    });
    const data = await res.json();
    test('Invalid quantity returns 400', res.status === 400, 400, res.status);
  } catch (error) {
    console.log('❌ Invalid quantity test failed:', error.message);
    failedTests++;
  }

  // Test 4: Update Status
  console.log('\n📋 REQUIREMENT 3: Update Order Status');
  
  if (order1Id) {
    try {
      const res = await fetch(`${baseUrl}/api/orders/${order1Id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSING' })
      });
      const data = await res.json();
      test('Update status returns 200', res.status === 200, 200, res.status);
      test('Update status response has correct status', data.status === 'PROCESSING', 'PROCESSING', data.status);
    } catch (error) {
      console.log('❌ Update status failed:', error.message);
      failedTests += 2;
    }
  }

  if (order2Id) {
    try {
      const res = await fetch(`${baseUrl}/api/orders/${order2Id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY' })
      });
      test('Update order 2 to READY returns 200', res.status === 200, 200, res.status);
    } catch (error) {
      console.log('❌ Update order 2 status failed:', error.message);
      failedTests++;
    }
  }

  if (order3Id) {
    try {
      const res = await fetch(`${baseUrl}/api/orders/${order3Id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DELIVERED' })
      });
      test('Update order 3 to DELIVERED returns 200', res.status === 200, 200, res.status);
    } catch (error) {
      console.log('❌ Update order 3 status failed:', error.message);
      failedTests++;
    }
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders/ORD-notfound/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PROCESSING' })
    });
    test('Update non-existent order returns 404', res.status === 404, 404, res.status);
  } catch (error) {
    console.log('❌ Update non-existent order test failed:', error.message);
    failedTests++;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders/${order1Id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'INVALID' })
    });
    test('Invalid status returns 400', res.status === 400, 400, res.status);
  } catch (error) {
    console.log('❌ Invalid status test failed:', error.message);
    failedTests++;
  }

  // Test 5: View All Orders
  console.log('\n📋 REQUIREMENT 4: View All Orders');
  
  try {
    const res = await fetch(`${baseUrl}/api/orders`);
    const data = await res.json();
    test('Get all orders returns 200', res.status === 200, 200, res.status);
    test('Get all orders has count', typeof data.count === 'number', 'number', typeof data.count);
    test('Get all orders has 3 orders', data.count === 3, 3, data.count);
    test('Orders sorted by created_at DESC', data.orders[0].created_at >= data.orders[data.orders.length - 1].created_at, true, data.orders[0].created_at >= data.orders[data.orders.length - 1].created_at);
  } catch (error) {
    console.log('❌ Get all orders failed:', error.message);
    failedTests += 4;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders?status=READY`);
    const data = await res.json();
    test('Filter by status READY returns 1 order', data.count === 1, 1, data.count);
  } catch (error) {
    console.log('❌ Filter by status failed:', error.message);
    failedTests++;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders?customer_name=Priya`);
    const data = await res.json();
    test('Filter by customer_name returns 1 order', data.count === 1, 1, data.count);
  } catch (error) {
    console.log('❌ Filter by customer_name failed:', error.message);
    failedTests++;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders?phone=9876543210`);
    const data = await res.json();
    test('Filter by phone returns 1 order', data.count === 1, 1, data.count);
  } catch (error) {
    console.log('❌ Filter by phone failed:', error.message);
    failedTests++;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders?status=INVALID`);
    test('Invalid status filter returns 400', res.status === 400, 400, res.status);
  } catch (error) {
    console.log('❌ Invalid status filter test failed:', error.message);
    failedTests++;
  }

  // Test 6: Get Single Order
  console.log('\n📋 REQUIREMENT 5: Get Single Order');
  
  if (order1Id) {
    try {
      const res = await fetch(`${baseUrl}/api/orders/${order1Id}`);
      const data = await res.json();
      test('Get single order returns 200', res.status === 200, 200, res.status);
      test('Single order has items array', Array.isArray(data.items), true, Array.isArray(data.items));
      test('Items have subtotal', data.items[0].subtotal !== undefined, true, data.items[0].subtotal !== undefined);
      test('Order status was updated', data.status === 'PROCESSING', 'PROCESSING', data.status);
    } catch (error) {
      console.log('❌ Get single order failed:', error.message);
      failedTests += 4;
    }
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders/ORD-notfound`);
    test('Get non-existent order returns 404', res.status === 404, 404, res.status);
  } catch (error) {
    console.log('❌ Get non-existent order test failed:', error.message);
    failedTests++;
  }

  // Test 7: Dashboard
  console.log('\n📋 REQUIREMENT 6: Dashboard');
  
  try {
    const res = await fetch(`${baseUrl}/api/dashboard`);
    const data = await res.json();
    test('Dashboard returns 200', res.status === 200, 200, res.status);
    test('Dashboard has total_orders', data.total_orders === 3, 3, data.total_orders);
    test('Dashboard has total_revenue', data.total_revenue === 1090, 1090, data.total_revenue);
    test('Dashboard has orders_by_status', typeof data.orders_by_status === 'object', 'object', typeof data.orders_by_status);
    test('Dashboard PROCESSING count is 1', data.orders_by_status.PROCESSING === 1, 1, data.orders_by_status.PROCESSING);
    test('Dashboard READY count is 1', data.orders_by_status.READY === 1, 1, data.orders_by_status.READY);
    test('Dashboard DELIVERED count is 1', data.orders_by_status.DELIVERED === 1, 1, data.orders_by_status.DELIVERED);
  } catch (error) {
    console.log('❌ Dashboard test failed:', error.message);
    failedTests += 7;
  }

  // Test 8: 404 Route
  console.log('\n📋 REQUIREMENT 8: Error Handling');
  
  try {
    const res = await fetch(`${baseUrl}/api/nonexistent`);
    const data = await res.json();
    test('Undefined route returns 404', res.status === 404, 404, res.status);
    test('404 has error message', data.error === 'Route not found', 'Route not found', data.error);
  } catch (error) {
    console.log('❌ 404 route test failed:', error.message);
    failedTests += 2;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log(`\n📊 TEST SUMMARY:`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! LaundryOps is working perfectly!\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  }
}

comprehensiveTest().catch(console.error);
