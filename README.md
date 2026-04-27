# LaundryOps — Mini Laundry Order Management System

A lightweight REST API and React frontend for managing daily dry-cleaning orders — from creation to delivery — with automatic billing, status tracking, and a live business dashboard.

---

## 📁 Project Structure

```
laundryops/
├── config/
│   └── prices.js              # Garment pricing map
├── db/
│   └── database.js            # SQLite setup + schema init
├── middleware/
│   ├── auth.js                # JWT authentication middleware
│   └── errorHandler.js        # Centralized error handling
├── routes/
│   ├── auth.js                # Register / Login / Me
│   ├── orders.js              # Order CRUD + status updates
│   └── dashboard.js           # Aggregated statistics
├── tests/
│   ├── test-api.js            # Quick smoke tests
│   └── test-comprehensive.js  # Full suite (47 tests)
├── frontend/                  # React + Vite UI
│   └── src/
│       ├── components/
│       │   ├── Auth.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreateOrder.jsx
│       │   └── OrdersList.jsx
│       └── App.jsx
├── .env.example
├── index.js                   # Express entry point
└── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm

### Backend

```bash
git clone https://github.com/Magenta91/laundaryops.git
cd laundaryops
npm install
cp .env.example .env
npm run dev
```

Server starts at **http://localhost:3000**

The SQLite database file (`laundryops.db`) is created automatically on first run. No database setup required.

### Frontend

The frontend is deployed and live at GitHub Pages — no local setup needed:

👉 **https://magenta91.github.io/laundaryops/**

To run locally:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Local frontend starts at **http://localhost:5173**

### Environment Variables

**Backend `.env`**

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Frontend `.env`**

```
VITE_API_URL=http://localhost:3000
```

---

## ✅ Features Implemented

### Core (All 4 Requirements)

| Feature | Endpoint | Status |
|---|---|---|
| Create Order with auto-billing | `POST /api/orders` | ✅ |
| Update Order Status | `PATCH /api/orders/:id/status` | ✅ |
| View All Orders with Filters | `GET /api/orders` | ✅ |
| Basic Dashboard | `GET /api/dashboard` | ✅ |
| View Single Order | `GET /api/orders/:id` | ✅ |
| Health Check | `GET /health` | ✅ |

### Bonus Features (All Completed)

| Bonus | Implementation | Status |
|---|---|---|
| React Frontend | Vite + React with Dashboard, Orders, Auth pages | ✅ |
| Authentication | JWT login/register with bcrypt password hashing | ✅ |
| SQLite Database | Persistent storage via `better-sqlite3` | ✅ |
| Search by Garment | `GET /api/orders?garment=Shirt` | ✅ |
| Estimated Delivery Date | Auto-calculated as 3 days from order creation | ✅ |
| Deployment Ready | `render.yaml` + `vercel.json` included | ✅ |

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | Register new user | `{ username, password }` | `201 { token }` |
| POST | `/api/auth/login` | Login | `{ username, password }` | `200 { token }` |
| GET | `/api/auth/me` | Get current user | — (Bearer token) | `200 { id, username }` |

### Orders

| Method | Endpoint | Description | Request Body / Query | Response |
|---|---|---|---|---|
| POST | `/api/orders` | Create an order | `{ customer_name, phone, garments[] }` | `201` full order object |
| GET | `/api/orders` | List all orders | `?status=&customer_name=&phone=&garment=` | `200 { count, orders[] }` |
| GET | `/api/orders/:id` | Get one order | — | `200` full order with items |
| PATCH | `/api/orders/:id/status` | Update status | `{ status }` | `200 { id, status, message }` |

### Dashboard & Utility

| Method | Endpoint | Description | Response |
|---|---|---|---|
| GET | `/api/dashboard` | Business summary | `200 { total_orders, total_revenue, orders_by_status }` |
| GET | `/health` | Health check | `200 { status, db, uptime_seconds }` |

### Order Status Values

`RECEIVED` → `PROCESSING` → `READY` → `DELIVERED`

### Validation Errors (400)

- `customer_name` or `phone` missing
- `garments` is empty or not an array
- Garment not in price list (e.g., "Jeans")
- `quantity` is not a positive integer

---

## 💰 Price List

| Garment | Price (₹) |
|---|---|
| Shirt | 50 |
| Pants | 60 |
| Saree | 120 |
| Jacket | 150 |
| Kurta | 80 |
| Bedsheet | 100 |
| Towel | 30 |

---

## 🤖 AI Usage Report

### Tools Used

- **Claude (Anthropic)** — primary tool for architecture decisions, scaffolding, and debugging
- **GitHub Copilot** — inline code completion during development

### How AI Was Used

The approach was AI-first throughout:

1. **Architecture** — Asked Claude to compare approaches (in-memory vs SQLite vs MongoDB) and recommend the best fit. It recommended Node.js + Express + SQLite as the optimal balance between speed and demonstrating real persistence.

2. **Initial Scaffold** — Provided Claude a detailed requirements prompt (structured like a spec doc with User Stories and Acceptance Criteria) and it generated the full folder structure, `index.js`, `database.js`, `prices.js`, and all three route files in a single pass.

3. **Validation Logic** — Prompted Claude to generate validation for the `POST /api/orders` endpoint. It got the garment lookup and total bill calculation right immediately.

4. **Bonus Features** — Asked Claude to add JWT auth, garment-type filtering, and estimated delivery date. Auth boilerplate (register/login/middleware) was generated in one prompt.

5. **Test Suite** — Asked Claude to generate a comprehensive test script covering all 47 cases. Required minor URL adjustments to match actual route structure.

### Sample Prompts Used

```
"Build a POST /api/orders endpoint that validates customer_name, phone,
and a garments array. Each garment must exist in PRICES config. Compute
total_bill from quantity × unit_price. Insert atomically into orders and
order_items tables. Return 201 with the full order object."
```

```
"Add JWT authentication to the Express app. Create register and login
endpoints. Add a middleware that protects routes when a token is present
but allows guest access when no token is sent."
```

### What AI Got Right

- Complete route and middleware boilerplate required almost no edits
- SQLite transaction logic for atomic inserts was correct on first generation
- Error response format was consistent across all routes
- The test suite structure and assertions were accurate

### What Needed Manual Fixes

- The initial scaffold used `express.Router()` in all files but mounted them incorrectly in `index.js` — fixed path prefixes manually
- AI generated `app.use(express.json())` after route mounting in one version — had to reorder middleware
- The garment filter for `GET /api/orders` required a SQL JOIN on `order_items` that the AI initially implemented as a JavaScript filter post-query — rewrote it as a proper JOIN for correctness and performance
- Frontend CORS issue: AI didn't include `cors()` middleware in the initial backend — added manually

---

## ⚖️ Tradeoffs

### What Was Skipped

- **Input sanitization** — phone and name fields accept any string; in production these would be sanitized and validated with regex
- **Pagination** — `GET /api/orders` returns all orders; a real system would use `LIMIT` / `OFFSET`
- **Role-based access** — auth is present but all authenticated users can see all orders; a production system would scope data per user or store
- **Unit tests** — test suite is integration-style (hits a live server); no isolated unit tests for service functions

### What SQLite Means for Production

SQLite is a single-file database with no concurrent write support. For a real store with multiple staff on different devices, this would be replaced with PostgreSQL or MySQL on a proper server. For this assignment's scope (one operator, demo environment), SQLite is perfectly appropriate — it's fast, zero-config, and ships with the repo.

### What Would Improve With More Time

- Add rate limiting per phone number to prevent order spam
- Add a proper order receipt endpoint (PDF generation)
- Improve the frontend to show an order timeline instead of just a status badge
- Add WebSocket support so the dashboard updates live without polling
- Replace the custom test runner with Jest for cleaner test output and mocking

---

## 🧪 Running Tests

```bash
# Quick API smoke test (requires server running)
node tests/test-api.js

# Full suite — 47 tests covering all requirements + bonus features
node tests/test-comprehensive.js
```

Expected output:

```
📊 TEST SUMMARY:
   ✅ Passed: 47
   ❌ Failed: 0
   📈 Success Rate: 100.0%

🎉 ALL TESTS PASSED!
```

---

## 🌐 Deployment

### Backend — Render (auto-configured)

1. Go to [render.com](https://render.com) → New → Blueprint
2. Connect repo: `Magenta91/laundaryops`
3. Render reads `render.yaml` and deploys automatically

### Frontend — GitHub Pages ✅ Live

Deployed at: **https://magenta91.github.io/laundaryops/**

Deployed via GitHub Actions on every push to `main`. The Vite build output is published to the `gh-pages` branch automatically.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18 |
| Framework | Express.js |
| Database | SQLite via `better-sqlite3` |
| Auth | JWT (`jsonwebtoken` + `bcryptjs`) |
| Frontend | React 18 + Vite |
| Testing | Custom Node.js test runner |
| Deployment | Render (backend) + GitHub Pages (frontend) |
