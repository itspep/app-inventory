const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT: Static files must be served from the correct path
app.use(express.static(path.join(__dirname, 'public')));

// Log all static file requests for debugging
app.use((req, res, next) => {
    if (req.url.startsWith('/css/') || req.url.startsWith('/js/')) {
        console.log(`📁 Static file requested: ${req.url}`);
    }
    next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts so `views/layout.ejs` wraps views automatically
app.use(expressLayouts);
app.set('layout', 'layout');

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected at:', result.rows[0].now);
  }
});

// Test route
app.get('/test', (req, res) => {
  res.send('✅ Server is working!');
});

// Test static route
app.get('/test-static', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Static Test</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <div style="padding: 20px;">
            <h1 style="color: var(--primary);">Static File Test</h1>
            <div class="btn btn-primary">Primary Button</div>
            <div class="btn btn-success">Success Button</div>
            <div class="btn btn-danger">Danger Button</div>
            <div class="card" style="margin-top: 20px; padding: 20px;">
                <h3>Card Test</h3>
                <p>If you see styled buttons and cards, CSS is working!</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Import routes
const indexRouter = require('./routes/index');

// Use routes
app.use('/', indexRouter);

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
    message: 'The page you are looking for does not exist.' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔍 Test static: http://localhost:${PORT}/test-static`);
  console.log(`📁 CSS file should be at: http://localhost:${PORT}/css/style.css`);
  console.log(`📁 JS file should be at: http://localhost:${PORT}/js/main.js`);
});
