const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'inventory_admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'electronic_store_inventory',
  password: process.env.DB_PASSWORD || '123',
  port: process.env.DB_PORT || 5432,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Successfully connected to database');
    release();
  }
});

// Query function helper
const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  pool
};
