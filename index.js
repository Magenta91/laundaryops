const express = require('express');
const cors = require('cors');
const { initDatabase, getDb } = require('./db/database');
const ordersRouter = require('./routes/orders');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database before starting server
let serverReady = false;
initDatabase().then(() => {
  serverReady = true;
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    const db = getDb();
    if (!db || !serverReady) {
      return res.status(503).json({
        status: 'unhealthy',
        db: 'disconnected'
      });
    }
    
    res.status(200).json({
      status: 'ok',
      db: 'connected',
      uptime_seconds: Math.floor(process.uptime())
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      db: 'disconnected'
    });
  }
});

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/dashboard', dashboardRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server after database is ready
const startServer = () => {
  if (serverReady) {
    app.listen(PORT, () => {
      console.log(`LaundryOps server running on port ${PORT}`);
    });
  } else {
    setTimeout(startServer, 100);
  }
};

startServer();
