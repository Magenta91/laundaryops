# LaundryOps Frontend

React frontend for the LaundryOps order management system.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` and proxy API requests to the backend at `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: empty string for same-origin requests)

## Features

- ✅ User authentication (login/register)
- ✅ Guest mode (use without authentication)
- ✅ Dashboard with statistics
- ✅ Create orders with garment selection
- ✅ View and filter orders
- ✅ Update order status
- ✅ Search by garment type
- ✅ Estimated delivery dates
- ✅ Responsive design
