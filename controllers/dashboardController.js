const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');
const db = require('../config/database');

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      console.log('📊 Loading dashboard...');
      
      // Get stats - handle missing tables gracefully
      let totalItems = 0, totalCategories = 0, totalValue = 0, lowStockItems = 0, categoriesWithItems = 0, todaysChanges = 0;
      
      try {
        const itemsResult = await db.query('SELECT COUNT(*) FROM items');
        totalItems = parseInt(itemsResult.rows[0].count) || 0;
      } catch (e) { console.log('Items table query failed'); }
      
      try {
        const categoriesResult = await db.query('SELECT COUNT(*) FROM categories');
        totalCategories = parseInt(categoriesResult.rows[0].count) || 0;
      } catch (e) { console.log('Categories table query failed'); }
      
      try {
        const valueResult = await db.query('SELECT COALESCE(SUM(price * stock_quantity), 0) as total FROM items');
        totalValue = parseFloat(valueResult.rows[0].total) || 0;
      } catch (e) { console.log('Value calculation failed'); }
      
      try {
        const lowStockResult = await db.query('SELECT COUNT(*) FROM items WHERE stock_quantity < 5');
        lowStockItems = parseInt(lowStockResult.rows[0].count) || 0;
      } catch (e) { console.log('Low stock query failed'); }
      
      try {
        const categoriesWithItemsResult = await db.query('SELECT COUNT(DISTINCT category_id) FROM items');
        categoriesWithItems = parseInt(categoriesWithItemsResult.rows[0].count) || 0;
      } catch (e) { console.log('Categories with items query failed'); }
      
      // Check if item_changes table exists
      try {
        const tableCheck = await db.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'item_changes'
          )`
        );
        
        if (tableCheck.rows[0].exists) {
          const today = new Date().toISOString().split('T')[0];
          const changesResult = await db.query(
            'SELECT COUNT(*) FROM item_changes WHERE DATE(changed_at) = $1',
            [today]
          );
          todaysChanges = parseInt(changesResult.rows[0].count) || 0;
        }
      } catch (e) { 
        console.log('Item_changes table not available');
      }
      
      // Get recent items
      let recentItems = [];
      try {
        const recentItemsResult = await db.query(
          `SELECT i.*, c.name as category_name 
           FROM items i 
           JOIN categories c ON i.category_id = c.id 
           ORDER BY i.created_at DESC 
           LIMIT 5`
        );
        recentItems = recentItemsResult.rows || [];
      } catch (e) { 
        console.log('Recent items query failed');
      }
      
      const stats = {
        totalItems,
        totalCategories,
        totalValue,
        lowStockItems,
        categoriesWithItems,
        todaysChanges
      };
      
      res.render('dashboard', {
        title: 'Dashboard',
        stats,
        recentItems: recentItems || []
      });
      
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
      // Still render dashboard with default values
      res.render('dashboard', {
        title: 'Dashboard',
        stats: {
          totalItems: 0,
          totalCategories: 0,
          totalValue: 0,
          lowStockItems: 0,
          categoriesWithItems: 0,
          todaysChanges: 0
        },
        recentItems: []
      });
    }
  }
};

module.exports = dashboardController;
