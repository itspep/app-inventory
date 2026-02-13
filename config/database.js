const { Pool } = require('pg');
require('dotenv').config();

// Railway provides DATABASE_URL environment variable
const connectionString = process.env.DATABASE_URL;

console.log('🔌 Database Configuration:');
console.log('  DATABASE_URL exists:', !!connectionString);

if (!connectionString) {
  console.error('❌ DATABASE_URL not found! Make sure you have added a PostgreSQL database in Railway.');
  process.exit(1);
}

// Database configuration for Railway
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Railway
  },
  // Connection settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection on startup
pool.connect((err, client, done) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('  This is expected if you haven't added a PostgreSQL database in Railway yet.');
    console.error('  Go to your Railway project dashboard and add a PostgreSQL database.');
  } else {
    console.log('✅ Database connected successfully');
    client.query('SELECT NOW()', (err, res) => {
      done();
      if (err) {
        console.error('❌ Query failed:', err.message);
      } else {
        console.log('📅 Database time:', res.rows[0].now);
      }
    });
  }
});

// Query helper
const query = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 Executed query (${duration}ms)`);
    return res;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
};

module.exports = {
  query,
  pool
};
