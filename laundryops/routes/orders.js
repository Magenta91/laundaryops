const express = require('express');
const router = express.Router();
const { getDb, transaction } = require('../db/database');
const PRICES = require('../config/prices');
const { v4: uuidv4 } = require('uuid');
const { optionalAuth } = require('../middleware/auth');

// Helper function to calculate estimated delivery date
const calculateDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3); // 3 days from now
  return date.toISOString();
};

// POST /api/orders - Create new order
router.post('/', optionalAuth, (req, res) => {
  const { customer_name, phone, garments } = req.body;

  // Validation
  if (!customer_name || !phone || customer_name.trim() === '' || phone.trim() === '') {
    return res.status(400).json({ error: 'customer_name and phone are required' });
  }

  if (!garments || !Array.isArray(garments) || garments.length === 0) {
    return res.status(400).json({ error: 'garments must be a non-empty array' });
  }

  // Validate garments and calculate total
  let total_bill = 0;
  const validatedGarments = [];

  for (const item of garments) {
    const { garment, quantity } = item;

    // Check if garment exists in price list
    if (!PRICES[garment]) {
      return res.status(400).json({ error: `Unknown garment: ${garment}` });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: `quantity must be a positive integer for garment: ${garment}` });
    }

    const unit_price = PRICES[garment];
    const subtotal = quantity * unit_price;
    total_bill += subtotal;

    validatedGarments.push({
      garment,
      quantity,
      unit_price,
      subtotal
    });
  }

  // Generate order ID
  const orderId = `ORD-${uuidv4().substring(0, 8)}`;
  const created_at = new Date().toISOString();
  const status = 'RECEIVED';
  const estimated_delivery = calculateDeliveryDate();
  const user_id = req.user ? req.user.id : null;

  // Insert into database using transaction
  try {
    const db = getDb();
    
    const txn = transaction(() => {
      // Insert order
      const insertOrderStmt = db.prepare(`
        INSERT INTO orders (id, customer_name, phone, total_bill, status, created_at, estimated_delivery, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertOrderStmt.bind([orderId, customer_name, phone, total_bill, status, created_at, estimated_delivery, user_id]);
      insertOrderStmt.step();
      insertOrderStmt.free();
      
      // Insert items
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (order_id, garment, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `);
      
      for (const item of validatedGarments) {
        insertItemStmt.bind([orderId, item.garment, item.quantity, item.unit_price]);
        insertItemStmt.step();
        insertItemStmt.reset();
      }
      insertItemStmt.free();
    });

    txn();

    // Return created order
    res.status(201).json({
      id: orderId,
      customer_name,
      phone,
      total_bill,
      status,
      created_at,
      estimated_delivery,
      items: validatedGarments
    });

  } catch (error) {
    console.error('[DB ERROR]', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status. Must be one of: RECEIVED, PROCESSING, READY, DELIVERED' 
    });
  }

  try {
    const db = getDb();
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    stmt.bind([status, id]);
    stmt.step();
    const changes = db.getRowsModified();
    stmt.free();
    
    const { saveDatabase } = require('../db/database');
    saveDatabase();

    if (changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      id,
      status,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('[DB ERROR]', error.message);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET /api/orders - View all orders with optional filters
router.get('/', optionalAuth, (req, res) => {
  const { status, customer_name, phone, garment } = req.query;

  const validStatuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status filter' });
  }

  try {
    const db = getDb();
    let query = 'SELECT DISTINCT orders.* FROM orders';
    const params = [];
    let joinAdded = false;

    // Add join if searching by garment
    if (garment) {
      query += ' INNER JOIN order_items ON orders.id = order_items.order_id';
      joinAdded = true;
    }

    query += ' WHERE 1=1';

    if (status) {
      query += ' AND orders.status = ?';
      params.push(status);
    }

    if (customer_name) {
      query += ' AND orders.customer_name LIKE ?';
      params.push(`%${customer_name}%`);
    }

    if (phone) {
      query += ' AND orders.phone = ?';
      params.push(phone);
    }

    if (garment) {
      query += ' AND order_items.garment LIKE ?';
      params.push(`%${garment}%`);
    }

    // Filter by user if authenticated
    if (req.user) {
      query += ' AND orders.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY orders.created_at DESC';

    const stmt = db.prepare(query);
    stmt.bind(params);
    
    const orders = [];
    const columns = stmt.getColumnNames();
    
    while (stmt.step()) {
      const values = stmt.get();
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = values[idx];
      });
      orders.push(obj);
    }
    stmt.free();

    res.status(200).json({
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('[DB ERROR]', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get single order with items
router.get('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const db = getDb();
    
    // Get order
    const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    orderStmt.bind([id]);
    
    if (!orderStmt.step()) {
      orderStmt.free();
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const orderColumns = orderStmt.getColumnNames();
    const orderValues = orderStmt.get();
    const order = {};
    orderColumns.forEach((col, idx) => {
      order[col] = orderValues[idx];
    });
    orderStmt.free();

    // Get items
    const itemsStmt = db.prepare('SELECT garment, quantity, unit_price FROM order_items WHERE order_id = ?');
    itemsStmt.bind([id]);
    
    const items = [];
    const itemColumns = itemsStmt.getColumnNames();
    
    while (itemsStmt.step()) {
      const values = itemsStmt.get();
      const item = {};
      itemColumns.forEach((col, idx) => {
        item[col] = values[idx];
      });
      item.subtotal = item.quantity * item.unit_price;
      items.push(item);
    }
    itemsStmt.free();

    res.status(200).json({
      ...order,
      items
    });

  } catch (error) {
    console.error('[DB ERROR]', error.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
