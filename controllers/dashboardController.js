const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');
const db = require('../config/database');

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      console.log('📊 Loading dashboard...');
      
      // Get stats
      const itemsResult = await db.query('SELECT COUNT(*) FROM items');
      const categoriesResult = await db.query('SELECT COUNT(*) FROM categories');
      const valueResult = await db.query('SELECT COALESCE(SUM(price * stock_quantity), 0) as total FROM items');
      const lowStockResult = await db.query('SELECT COUNT(*) FROM items WHERE stock_quantity < 5');
      const categoriesWithItemsResult = await db.query('SELECT COUNT(DISTINCT category_id) FROM items');
      
      // Get today's changes
      const today = new Date().toISOString().split('T')[0];
      const changesResult = await db.query(
        'SELECT COUNT(*) FROM item_changes WHERE DATE(changed_at) = $1',
        [today]
      );
      
      // Get recent items
      const recentItems = await db.query(
        `SELECT i.*, c.name as category_name 
         FROM items i 
         JOIN categories c ON i.category_id = c.id 
         ORDER BY i.created_at DESC 
         LIMIT 5`
      );
      
      const stats = {
        totalItems: parseInt(itemsResult.rows[0].count),
        totalCategories: parseInt(categoriesResult.rows[0].count),
        totalValue: parseFloat(valueResult.rows[0].total),
        lowStockItems: parseInt(lowStockResult.rows[0].count),
        categoriesWithItems: parseInt(categoriesWithItemsResult.rows[0].count),
        todaysChanges: changesResult.rows[0] ? parseInt(changesResult.rows[0].count) : 0
      };
      
      res.render('dashboard', {
        title: 'Dashboard',
        stats,
        recentItems: recentItems.rows || []
      });
      
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load dashboard'
      });
    }
  }
};

module.exports = dashboardController;
