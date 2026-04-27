# LaundryOps - Complete Order Management System

A full-stack laundry order management system with REST API backend and React frontend.

## 🎯 Features Implemented

### Core Features (All 10 Requirements)
- ✅ Project scaffolding with clean structure
- ✅ Create orders with automatic billing
- ✅ Update order status (RECEIVED → PROCESSING → READY → DELIVERED)
- ✅ View all orders with filters
- ✅ Get single order details
- ✅ Dashboard with statistics
- ✅ Health check endpoint
- ✅ Centralized error handling
- ✅ Request/response logging
- ✅ Complete documentation

### Bonus Features
- ✅ **React Frontend** - Clean, responsive UI with Vite
- ✅ **Authentication** - JWT-based login/register system
- ✅ **SQLite Database** - Persistent data storage
- ✅ **Search by Garment** - Filter orders by garment type
- ✅ **Estimated Delivery Date** - Auto-calculated (3 days)
- ✅ **Deployment Ready** - Configs for Vercel, Railway, Render, AWS

## 📁 Project Structure

```
📦 LaundryOps
├── 📄 README.md                        # Main documentation
├── 📄 .gitignore                       # Git ignore rules
│
├── 📁 laundryops/                      # Backend (Node.js + Express)
│   ├── 📁 config/
│   │   └── prices.js                   # Garment pricing configuration
│   │
│   ├── 📁 db/
│   │   └── database.js                 # SQLite database setup
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                     # JWT authentication middleware
│   │   └── errorHandler.js            # Centralized error handling
│   │
│   ├── 📁 routes/
│   │   ├── auth.js                     # Authentication endpoints
│   │   ├── orders.js                   # Order management endpoints
│   │   └── dashboard.js                # Dashboard statistics
│   │
│   ├── 📁 tests/                       # Test suite
│   │   ├── README.md                   # Test documentation
│   │   ├── test-api.js                 # Quick API tests
│   │   └── test-comprehensive.js       # Full test suite (47 tests)
│   │
│   ├── .env.example                    # Environment variables template
│   ├── .gitignore                      # Backend git ignore
│   ├── index.js                        # Server entry point
│   ├── package.json                    # Backend dependencies
│   ├── render.yaml                     # Render deployment config
│   └── vercel.json                     # Vercel deployment config
│
└── 📁 laundryops-frontend/             # Frontend (React + Vite)
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── Auth.jsx                # Login/Register component
    │   │   ├── Dashboard.jsx           # Statistics dashboard
    │   │   ├── CreateOrder.jsx         # Order creation form
    │   │   └── OrdersList.jsx          # Orders list with filters
    │   ├── App.jsx                     # Main application component
    │   ├── main.jsx                    # React entry point
    │   └── index.css                   # Global styles
    │
    ├── .env.example                    # Frontend environment template
    ├── .gitignore                      # Frontend git ignore
    ├── index.html                      # HTML entry point
    ├── package.json                    # Frontend dependencies
    ├── README.md                       # Frontend documentation
    └── vite.config.js                  # Vite configuration
```

## 🚀 Quick Start

### Backend Setup

```bash
cd laundryops
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd laundryops-frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders (with filters)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update status

### Dashboard
- `GET /api/dashboard` - Get statistics

### Health
- `GET /health` - Health check

## 🔍 Search & Filter

Orders can be filtered by:
- **Status** - RECEIVED, PROCESSING, READY, DELIVERED
- **Customer Name** - Partial match
- **Phone** - Exact match
- **Garment Type** - NEW! Search by garment (e.g., "Shirt", "Saree")

## 💰 Pricing

| Garment | Price (₹) |
|---------|-----------|
| Shirt | 50 |
| Pants | 60 |
| Saree | 120 |
| Jacket | 150 |
| Kurta | 80 |
| Bedsheet | 100 |
| Towel | 30 |

## 🔐 Authentication

- JWT-based authentication
- Optional - system works without auth (guest mode)
- Tokens expire in 7 days (configurable)
- Password hashing with bcrypt

## 📅 Estimated Delivery

- Automatically calculated as 3 days from order creation
- Displayed in order details
- Can be customized in backend logic

## 🧪 Testing

Backend includes comprehensive test suite with **47 tests** covering all requirements:

```bash
cd laundryops/tests
node test-comprehensive.js
```

**Test Coverage:**
- ✅ All 10 core requirements (100%)
- ✅ Authentication flows (login/register)
- ✅ Input validation (unknown garments, missing fields, invalid quantities)
- ✅ Error handling (400, 404, 500)
- ✅ Search/filter functionality (status, name, phone, garment)
- ✅ Order lifecycle (create → update → retrieve)
- ✅ Dashboard statistics
- ✅ Health check endpoint

**Expected Result:**
```
📊 TEST SUMMARY:
   ✅ Passed: 47
   ❌ Failed: 0
   📈 Success Rate: 100.0%

🎉 ALL TESTS PASSED! LaundryOps is working perfectly!
```

**Quick API Test:**
```bash
cd laundryops/tests
node test-api.js
```

## 🌐 Deployment

### Backend Deployment

#### Option 1: Render (Recommended - Auto-configured)
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect repository: `Magenta91/laundaryops`
4. Render auto-detects `render.yaml` and configures everything
5. Click **"Apply"**

The `render.yaml` automatically:
- ✅ Sets up Node.js environment
- ✅ Installs dependencies
- ✅ Generates secure JWT_SECRET
- ✅ Configures all environment variables

#### Option 2: Vercel
```bash
cd laundryops
vercel
```
Set environment variables in Vercel dashboard.

#### Option 3: Railway
```bash
cd laundryops
railway up
```
Set environment variables via Railway CLI or dashboard.

### Frontend Deployment

#### Vercel (Recommended for Frontend)
```bash
cd laundryops-frontend
vercel
```
Set `VITE_API_URL` to your deployed backend URL.

#### Netlify
```bash
cd laundryops-frontend
npm run build
# Deploy the 'dist' folder
```

### Full Stack Deployment
- **Backend:** Render/Railway (Node.js)
- **Frontend:** Vercel/Netlify (Static)
- **Database:** SQLite (included, auto-created)

## 🔧 Environment Variables

### Backend (.env)
```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Generate secure JWT_SECRET for production:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Security Note:** The app will refuse to start in production without a valid `JWT_SECRET`.

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000

# For production, set to your deployed backend URL:
# VITE_API_URL=https://your-backend.onrender.com
```

## 📊 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (sql.js - pure JavaScript, no native compilation)
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs (password hashing)
- **CORS:** cors middleware
- **Dev Tools:** nodemon

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Vanilla CSS (no framework)
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Fetch API

### DevOps
- **Version Control:** Git
- **Deployment:** Render (backend), Vercel (frontend)
- **Testing:** Custom test suite (47 tests)
- **CI/CD Ready:** Automated deployment configs

## 🎨 Features Showcase

### Dashboard
- Total orders count
- Total revenue
- Status breakdown (Received, Processing, Ready, Delivered)

### Order Creation
- Visual garment selector
- Real-time total calculation
- Automatic order ID generation (ORD-xxxxxxxx)
- Estimated delivery date

### Order Management
- Filter by multiple criteria
- Update status with dropdown
- View detailed order information
- Search by garment type

### Authentication
- Secure login/register
- Guest mode available
- User profile display
- Token-based sessions

## 📝 License

ISC

## 👨‍💻 Development

Built with modern best practices:
- Clean code architecture
- Separation of concerns
- RESTful API design
- Responsive UI
- Error handling
- Input validation
- Security (JWT, bcrypt, CORS)

---

**Ready for production deployment!** 🚀
