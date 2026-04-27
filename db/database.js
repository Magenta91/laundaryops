const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'laundryops.db');

let db = null;

// Initialize database
const initDatabase = async () => {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  console.log(`Database connected: laundryops.db`);

  // Create tables if they don't exist
  const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    name        TEXT NOT NULL,
    created_at  TEXT NOT NULL
  );
  `;

  const createOrdersTable = `
  CREATE TABLE IF NOT EXISTS orders (
    id          TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone       TEXT NOT NULL,
    total_bill  REAL NOT NULL,
    status      TEXT NOT NULL DEFAULT 'RECEIVED',
    created_at  TEXT NOT NULL,
    estimated_delivery TEXT NOT NULL,
    user_id     INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  `;

  const createOrderItemsTable = `
  CREATE TABLE IF NOT EXISTS order_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    TEXT NOT NULL,
    garment     TEXT NOT NULL,
    quantity    INTEGER NOT NULL,
    unit_price  REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
  `;

  try {
    db.run(createUsersTable);
    db.run(createOrdersTable);
    db.run(createOrderItemsTable);
    saveDatabase();
  } catch (error) {
    console.error('[DB ERROR]', error.message);
    throw error;
  }

  return db;
};

// Save database to file
const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

// Helper functions to match better-sqlite3 API
const prepare = (sql) => {
  return {
    run: (...params) => {
      try {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();
        saveDatabase();
        return { changes: db.getRowsModified() };
      } catch (error) {
        console.error('[DB ERROR]', error.message);
        throw error;
      }
    },
    get: (...params) => {
      try {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const hasRow = stmt.step();
        if (!hasRow) {
          stmt.free();
          return undefined;
        }
        const columns = stmt.getColumnNames();
        const values = stmt.get();
        stmt.free();
        
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = values[idx];
        });
        return obj;
      } catch (error) {
        console.error('[DB ERROR]', error.message);
        throw error;
      }
    },
    all: (...params) => {
      try {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const results = [];
        const columns = stmt.getColumnNames();
        
        while (stmt.step()) {
          const values = stmt.get();
          const obj = {};
          columns.forEach((col, idx) => {
            obj[col] = values[idx];
          });
          results.push(obj);
        }
        stmt.free();
        return results;
      } catch (error) {
        console.error('[DB ERROR]', error.message);
        throw error;
      }
    }
  };
};

// Transaction helper
const transaction = (fn) => {
  return () => {
    const db = getDb();
    try {
      db.run('BEGIN TRANSACTION');
      fn();
      db.run('COMMIT');
      saveDatabase();
    } catch (error) {
      try {
        db.run('ROLLBACK');
      } catch (rollbackError) {
        console.error('[DB ERROR] Rollback failed:', rollbackError.message);
      }
      console.error('[DB ERROR] Transaction failed:', error.message);
      throw error;
    }
  };
};

const getDb = () => db;

module.exports = {
  initDatabase,
  transaction,
  saveDatabase,
  getDb
};
