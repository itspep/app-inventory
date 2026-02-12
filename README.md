# Electronic Store Inventory Management System

A comprehensive inventory management application for an electronics store specializing in:
- Smart phones
- Tablets
- Computers
- PSP, GameBoy
- PS5 and Xbox consoles

## Features
- Category and item management
- Full CRUD operations
- Admin-protected destructive actions
- PostgreSQL database with relationships
- Responsive design

## Tech Stack
- Node.js/Express.js
- PostgreSQL
- EJS templates
- Vanilla CSS/JavaScript

## Setup Instructions
[To be filled]

## 🚂 Deploy on Railway (Free, No Credit Card Required)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/itspep/app-inventory)

### One-Click Deploy:
1. Click the button above
2. Login with GitHub
3. Click "Deploy"
4. Add PostgreSQL database
5. That's it! 🎉

### Manual Deploy:
1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "Deploy"
6. Click "New" → "Database" → "Add PostgreSQL"
7. Go to "Variables" and add:
   - `NODE_ENV=production`
   - `ADMIN_PASSWORD=your_secure_password`
   - `SESSION_SECRET=your_random_secret`
8. Go to "Shell" and run: `node scripts/railway-setup.js`

Your app will be live at `https://your-project-name.up.railway.app` 🚀
