const Item = require('../models/itemModel');

const changesController = {
  // Show recent changes
  showRecentChanges: async (req, res) => {
    try {
      const changes = await Item.getRecentChanges(100);
      
      res.render('changes/index', {
        title: 'Recent Changes',
        changes: changes || []
      });
    } catch (error) {
      console.error('❌ Error loading changes:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load recent changes'
      });
    }
  },

  // Show item change history
  showItemHistory: async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await Item.getById(itemId);
      const changes = await Item.getChangeHistory(itemId);
      
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
