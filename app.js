const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Layouts for EJS
const expressLayouts = require('express-ejs-layouts');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Provide a default title for views to avoid EJS `title` undefined errors
app.use((req, res, next) => {
  res.locals.title = res.locals.title || 'ElectroStore';
  next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts so layout.ejs wraps views
app.use(expressLayouts);
app.set('layout', 'layout');

// HEALTH CHECK ENDPOINT - Must return 200 OK quickly
app.get('/test', (req, res) => {
  console.log('🔎 /test healthcheck received from', req.ip);
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
    res.status(200).json({ 
      status: 'degraded', 
      database: 'disconnected',
      message: 'App running but database not connected',
      timestamp: new Date().toISOString()
    });
  }
});

// Simple liveness endpoint (alternate)
app.get('/healthz', (req, res) => {
  console.log('🔎 /healthz received from', req.ip);
  res.status(200).json({ status: 'alive' });
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected at:', result.rows[0].now);
  }
});

// Import routes
const indexRouter = require('./routes/index');
// Root redirect to dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});
app.use('/', indexRouter);

// NOTE: root route is provided by routes/index.js (dashboard). Do not override.

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// CRITICAL FIX: Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅✅✅ SERVER STARTED SUCCESSFULLY on port ${PORT} ✅✅✅`);
  console.log(`🔗 Health check: /test`);
});

// Global error handlers to surface crashes in logs
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
