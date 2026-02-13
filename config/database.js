const { Pool } = require('pg');
require('dotenv').config();

// Railway provides DATABASE_URL
const connectionString = process.env.DATABASE_URL;

console.log('🔌 Database Config:');
console.log('  DATABASE_URL exists:', !!connectionString);
console.log('  NODE_ENV:', process.env.NODE_ENV);

if (!connectionString) {
  console.log('⚠️ No DATABASE_URL found - app will run without database');
  // Create a dummy pool that logs errors but doesn't crash
  const dummyPool = {
    query: async () => { throw new Error('No database configured'); },
    connect: () => { throw new Error('No database configured'); }
  };
  module.exports = { query: dummyPool.query, pool: dummyPool };
  return;
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
};

module.exports = { query, pool };
