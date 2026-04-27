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
laundryops/                    # Backend (Node.js + Express)
├── config/
│   └── prices.js             # Garment pricing
├── db/
│   └── database.js           # SQLite setup
├── middleware/
│   ├── auth.js               # JWT authentication
│   └── errorHandler.js       # Error handling
├── routes/
│   ├── auth.js               # Auth endpoints
│   ├── orders.js             # Order management
│   └── dashboard.js          # Dashboard stats
├── .env.example
├── index.js                  # Server entry point
├── package.json
└── README.md

laundryops-frontend/           # Frontend (React + Vite)
├── src/
│   ├── components/
│   │   ├── Auth.jsx          # Login/Register
│   │   ├── Dashboard.jsx     # Statistics
│   │   ├── CreateOrder.jsx   # Order creation
│   │   └── OrdersList.jsx    # Orders list
│   ├── App.jsx               # Main app
│   ├── main.jsx              # Entry point
│   └── index.css             # Styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
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

Backend includes comprehensive test suite:

```bash
cd laundryops
node test-comprehensive.js
```

Tests cover:
- All 10 core requirements
- Authentication flows
- Validation
- Error handling
- Search/filter functionality

## 🌐 Deployment

### Vercel
```bash
cd laundryops
vercel
```

### Railway
```bash
cd laundryops
railway up
```

### Render
- Connect GitHub repo
- Use `render.yaml` configuration

### AWS EC2
See `DEPLOYMENT.md` for detailed instructions

## 🔧 Environment Variables

### Backend (.env)
```
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## 📊 Tech Stack

### Backend
- Node.js
- Express.js
- SQLite (sql.js)
- JWT (jsonwebtoken)
- bcrypt

### Frontend
- React 18
- Vite
- Vanilla CSS

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
