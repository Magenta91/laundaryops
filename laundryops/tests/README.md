# LaundryOps Tests

Comprehensive test suite for the LaundryOps API.

## Prerequisites

Make sure the backend server is running:
```bash
cd ../
npm run dev
```

## Running Tests

### Quick API Test
```bash
node test-api.js
```

Tests basic functionality:
- Health check
- Create orders
- Get orders
- Update status
- Dashboard

### Comprehensive Test Suite
```bash
node test-comprehensive.js
```

Tests all 10 requirements plus bonus features:
- ✅ Health check
- ✅ Order creation with validation
- ✅ Status updates
- ✅ Filtering (status, name, phone, garment)
- ✅ Single order retrieval
- ✅ Dashboard statistics
- ✅ Error handling (400, 404)
- ✅ Authentication flows

## Clean Database Before Testing

To run tests on a fresh database:

```bash
# Stop the server first (Ctrl+C)
rm ../laundryops.db
npm run dev
# Then run tests
node test-comprehensive.js
```

## Expected Results

All tests should pass with 100% success rate:
```
📊 TEST SUMMARY:
   ✅ Passed: 47
   ❌ Failed: 0
   📈 Success Rate: 100.0%

🎉 ALL TESTS PASSED! LaundryOps is working perfectly!
```

## Test Coverage

- **Requirement 1**: Project scaffolding ✅
- **Requirement 2**: Create order with validation ✅
- **Requirement 3**: Update order status ✅
- **Requirement 4**: View all orders with filters ✅
- **Requirement 5**: Get single order ✅
- **Requirement 6**: Dashboard statistics ✅
- **Requirement 7**: Health check ✅
- **Requirement 8**: Error handling ✅
- **Requirement 9**: Logging (manual verification) ✅
- **Requirement 10**: Documentation ✅

## Bonus Features Tested

- ✅ Authentication (login/register)
- ✅ Search by garment type
- ✅ Estimated delivery dates
- ✅ User-specific orders (when authenticated)
