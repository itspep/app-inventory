const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

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

// Test database connection on startup
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected at:', result.rows[0].now);
  }
});

// ===== IMPORT ROUTES =====
const indexRouter = require('./routes/index');

// ===== ROUTES =====

// Test routes (before router)
app.get('/test', (req, res) => {
  res.send('✅ Server is working! <a href="/">Go Home</a>');
});

app.get('/test-db', async (req, res) => {
  try {
    const time = await pool.query('SELECT NOW()');
    const categories = await pool.query('SELECT COUNT(*) FROM categories');
    const items = await pool.query('SELECT COUNT(*) FROM items');
    
    res.json({
      status: 'ok',
      database_time: time.rows[0].now,
      categories: parseInt(categories.rows[0].count),
      items: parseInt(items.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Use the router for all routes
app.use('/', indexRouter);

// Debug route to see all registered routes
app.get('/debug-routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  
  res.json({
    message: 'Registered routes',
    routes: routes
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).render('error', { 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).render('error', { 
    error: '404 - Page Not Found',
    message: `The page ${req.url} was not found.` 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/test`);
  console.log(`🔗 Test DB: http://localhost:${PORT}/test-db`);
  console.log(`🔗 Home: http://localhost:${PORT}/`);
  console.log(`🔗 Categories: http://localhost:${PORT}/categories`);
  console.log(`🔗 Items: http://localhost:${PORT}/items`);
  console.log(`🔗 Debug routes: http://localhost:${PORT}/debug-routes`);
});
