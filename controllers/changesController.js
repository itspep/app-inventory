const Item = require('../models/itemModel');
const db = require('../config/database');

const changesController = {
  // Show recent changes
  showRecentChanges: async (req, res) => {
    try {
      console.log('📋 Loading recent changes...');
      
      // Check if item_changes table exists
      const tableCheck = await db.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'item_changes'
        )`
      );
      
      let changes = [];
      
      if (tableCheck.rows[0].exists) {
        const result = await db.query(
          `SELECT 
            ic.*,
            i.name as item_name,
            c.name as category_name
           FROM item_changes ic
           JOIN items i ON ic.item_id = i.id
           JOIN categories c ON i.category_id = c.id
           ORDER BY ic.changed_at DESC
           LIMIT 100`
        );
        changes = result.rows;
      }
      
      res.render('changes/index', {
        title: 'Recent Changes',
        changes: changes || []
      });
      
    } catch (error) {
      console.error('❌ Error loading changes:', error);
      // Still render the page, just with empty changes
      res.render('changes/index', {
        title: 'Recent Changes',
        changes: []
      });
    }
  },

  // Show item change history
  showItemHistory: async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await Item.getById(itemId);
      
      // Check if item_changes table exists
      const tableCheck = await db.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'item_changes'
        )`
      );
      
      let changes = [];
      
      if (tableCheck.rows[0].exists) {
        const result = await db.query(
          `SELECT 
            field_name as field,
            old_value,
            new_value,
            changed_at,
            changed_by
           FROM item_changes
           WHERE item_id = $1
           ORDER BY changed_at DESC`,
          [itemId]
        );
        changes = result.rows;
      }
      
      if (!item) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Item not found'
        });
      }

      res.render('items/history', {
        title: 'Edit History',
        item,
        changes: changes || []
      });
    } catch (error) {
      console.error('❌ Error loading item history:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load item history'
      });
    }
  }
};

module.exports = changesController;
