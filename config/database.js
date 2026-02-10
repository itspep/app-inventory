const { Pool } = require('pg');
require('dotenv').config();

console.log('📋 Database Configuration:');
console.log('  User:', process.env.DB_USER);
console.log('  Database:', process.env.DB_NAME);
console.log('  Host:', process.env.DB_HOST);
console.log('  Port:', process.env.DB_PORT);

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'inventory_admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'electronic_store_inventory',
  password: process.env.DB_PASSWORD || '123',
  port: process.env.DB_PORT || 5432,
  // Connection settings
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test queries
    const timeResult = await client.query('SELECT NOW()');
    console.log('📅 Database time:', timeResult.rows[0].now);
    
    const categoriesResult = await client.query('SELECT COUNT(*) FROM categories');
    console.log(`📁 Categories: ${categoriesResult.rows[0].count}`);
    
    const itemsResult = await client.query('SELECT COUNT(*) FROM items');
    console.log(`📦 Items: ${itemsResult.rows[0].count}`);
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('  1. Run: ./recreate-tables.sh');
    console.error('  2. Check: sudo systemctl status postgresql');
    console.error('  3. Verify .env file has correct password');
  }
})();

// Query helper
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('❌ Query Error:', error.message);
    console.error('  Query:', text.substring(0, 200));
    if (params) console.error('  Params:', params);
    throw error;
  }
};

module.exports = {
  query,
  pool
};
