const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET /api/dashboard - Get dashboard summary
router.get('/', (req, res) => {
  try {
    const db = getDb();
    
    // Get total orders
    const totalOrdersStmt = db.prepare('SELECT COUNT(*) as count FROM orders');
    totalOrdersStmt.step();
    const totalOrdersValues = totalOrdersStmt.get();
    const total_orders = totalOrdersValues[0];
    totalOrdersStmt.free();

    // Get total revenue
    const totalRevenueStmt = db.prepare('SELECT SUM(total_bill) as revenue FROM orders');
    totalRevenueStmt.step();
    const revenueValues = totalRevenueStmt.get();
    const revenue = revenueValues[0];
    const total_revenue = revenue ? parseFloat(revenue.toFixed(2)) : 0.00;
    totalRevenueStmt.free();

    // Get orders by status
    const statusCountStmt = db.prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    const statusCounts = [];
    
    while (statusCountStmt.step()) {
      const values = statusCountStmt.get();
      statusCounts.push({ status: values[0], count: values[1] });
    }
    statusCountStmt.free();

    const orders_by_status = {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0
    };

    statusCounts.forEach(({ status, count }) => {
      orders_by_status[status] = count;
    });

    res.status(200).json({
      total_orders,
      total_revenue,
      orders_by_status
    });

  } catch (error) {
    console.error('[DB ERROR]', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
