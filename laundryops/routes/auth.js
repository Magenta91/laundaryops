const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb, saveDatabase } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const db = getDb();

    // Check if user exists
    const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    checkStmt.bind([username]);
    const exists = checkStmt.step();
    checkStmt.free();

    if (exists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertStmt = db.prepare(`
      INSERT INTO users (username, password, name, created_at)
      VALUES (?, ?, ?, ?)
    `);
    insertStmt.bind([username, hashedPassword, name || username, new Date().toISOString()]);
    insertStmt.step();
    insertStmt.free();
    saveDatabase();

    // Get user ID
    const userStmt = db.prepare('SELECT id, username, name FROM users WHERE username = ?');
    userStmt.bind([username]);
    userStmt.step();
    const values = userStmt.get();
    const user = {
      id: values[0],
      username: values[1],
      name: values[2]
    };
    userStmt.free();

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const db = getDb();

    // Get user
    const stmt = db.prepare('SELECT id, username, password, name FROM users WHERE username = ?');
    stmt.bind([username]);
    
    if (!stmt.step()) {
      stmt.free();
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const values = stmt.get();
    const user = {
      id: values[0],
      username: values[1],
      password: values[2],
      name: values[3]
    };
    stmt.free();

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', require('../middleware/auth').authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT id, username, name, created_at FROM users WHERE id = ?');
    stmt.bind([req.user.id]);
    
    if (!stmt.step()) {
      stmt.free();
      return res.status(404).json({ error: 'User not found' });
    }

    const values = stmt.get();
    const user = {
      id: values[0],
      username: values[1],
      name: values[2],
      created_at: values[3]
    };
    stmt.free();

    res.status(200).json({ user });

  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
