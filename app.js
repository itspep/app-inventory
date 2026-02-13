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

// Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// HEALTH CHECK ENDPOINT - Always returns 200 even without DB
app.get('/test', (req, res) => {
  console.log('✅ Health check endpoint hit');
  res.status(200).send('OK');
});

// Health check with DB status
app.get('/health', async (req, res) => {
  console.log('📊 Health check endpoint hit');
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
      message: 'Application running but database not connected',
      timestamp: new Date().toISOString()
    });
  }
});

// Root route
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint hit');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Electronic Store Inventory</title>
        <style>
            body { font-family: Arial; padding: 40px; text-align: center; }
            .success { color: green; }
            .warning { color: orange; }
            .card { border: 1px solid #ccc; padding: 20px; margin: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <h1>🚀 Electronic Store Inventory</h1>
        <div class="card">
            <h2 class="success">✅ Application is running!</h2>
            <p>Server is up and responding on port ${PORT}</p>
        </div>
        <div class="card">
            <h3>🔍 Available Endpoints:</h3>
            <ul style="list-style: none; padding: 0;">
                <li><a href="/test">/test</a> - Health check</li>
                <li><a href="/health">/health</a> - Detailed health</li>
                <li><a href="/dashboard">/dashboard</a> - Dashboard (requires DB)</li>
                <li><a href="/categories">/categories</a> - Categories (requires DB)</li>
                <li><a href="/items">/items</a> - Items (requires DB)</li>
            </ul>
        </div>
        <div class="card">
            <h3>📊 Database Status:</h3>
            <p id="db-status">Checking...</p>
        </div>
        <script>
            fetch('/health')
                .then(r => r.json())
                .then(data => {
                    const status = document.getElementById('db-status');
                    if (data.database === 'connected') {
                        status.innerHTML = '<span class="success">✅ Connected</span>';
                    } else {
                        status.innerHTML = '<span class="warning">⚠️ Disconnected - Add PostgreSQL in Railway dashboard</span>';
                    }
                });
        </script>
    </body>
    </html>
  `);
});

// Dashboard route (simple version without DB)
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Dashboard</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            .nav { background: #333; padding: 10px; }
            .nav a { color: white; margin-right: 10px; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/categories">Categories</a>
            <a href="/items">Items</a>
        </div>
        <h1>📊 Dashboard</h1>
        <p>Waiting for database connection...</p>
        <p>Please add a PostgreSQL database in your Railway dashboard.</p>
    </body>
    </html>
  `);
});

// Categories route (simple version)
app.get('/categories', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Categories</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            .nav { background: #333; padding: 10px; }
            .nav a { color: white; margin-right: 10px; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/categories">Categories</a>
            <a href="/items">Items</a>
        </div>
        <h1>📁 Categories</h1>
        <p>Please add a PostgreSQL database in your Railway dashboard.</p>
    </body>
    </html>
  `);
});

// Items route (simple version)
app.get('/items', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Items</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            .nav { background: #333; padding: 10px; }
            .nav a { color: white; margin-right: 10px; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/categories">Categories</a>
            <a href="/items">Items</a>
        </div>
        <h1>📦 Items</h1>
        <p>Please add a PostgreSQL database in your Railway dashboard.</p>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).send('Not found');
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅✅✅ SERVER STARTED SUCCESSFULLY! ✅✅✅`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/test`);
  console.log(`📊 Health details: http://localhost:${PORT}/health`);
  console.log(`🌎 Public URL: https://app-inventory-production.up.railway.app`);
});

server.on('error', (err) => {
  console.error('❌❌❌ SERVER ERROR:', err);
});
