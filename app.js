const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');

const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts so `views/layout.ejs` wraps views automatically
app.use(expressLayouts);
app.set('layout', 'layout');

// HEALTH CHECK ENDPOINT - Must return 200 OK quickly
app.get('/test', (req, res) => {
  res.status(200).send('OK');
});

// Detailed health check for database
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected at:', result.rows[0].now);
  }
});

// Import routes
const indexRouter = require('./routes/index');

// Use routes
app.use('/', indexRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/test`);
  console.log(`📊 Database health: http://localhost:${PORT}/health`);
});
