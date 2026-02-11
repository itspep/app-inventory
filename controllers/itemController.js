const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');

const itemController = {
  // List all items
  listItems: async (req, res) => {
    try {
      console.log('📋 Listing all items...');
      const items = await Item.getAll();
      console.log(`✅ Found ${items.length} items`);
      
      res.render('items/index', { 
        title: 'All Items',
        items: items || [],
        query: '',
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('❌ Error listing items:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load items'
      });
    }
  },

  // Show item details
  showItem: async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      console.log(`👀 Showing item ${itemId}...`);
      
      const item = await Item.getById(itemId);
      
      if (!item) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Item not found'
        });
      }

      res.render('items/show', {
        title: item.name,
        item
      });
    } catch (error) {
      console.error('❌ Error showing item:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load item'
      });
    }
  },

  // Show form to create new item
  showCreateForm: async (req, res) => {
    try {
      console.log('📝 Loading create item form...');
      const categories = await Category.getAll();
      const categoryId = req.query.category ? parseInt(req.query.category) : null;
      
      res.render('items/new', {
        title: 'Create New Item',
        item: { category_id: categoryId },
        categories: categories || []
      });
    } catch (error) {
      console.error('❌ Error loading create form:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load create form'
      });
    }
  },

  // Create new item
  createItem: async (req, res) => {
    try {
      const {
        category_id,
        name,
        brand,
        model,
        description,
        specifications,
        price,
        stock_quantity,
        sku,
        image_url
      } = req.body;

      // Validate required fields
      if (!name || name.trim() === '') {
        const categories = await Category.getAll();
        return res.render('items/new', {
          title: 'Create New Item',
          item: req.body,
          categories,
          error: 'Item name is required'
        });
      }

      if (!category_id) {
        const categories = await Category.getAll();
        return res.render('items/new', {
          title: 'Create New Item',
          item: req.body,
          categories,
          error: 'Category is required'
        });
      }

      const itemData = {
        category_id: parseInt(category_id),
        name: name.trim(),
        brand: brand?.trim() || null,
        model: model?.trim() || null,
        description: description?.trim() || null,
        specifications: specifications?.trim() || null,
        price: parseFloat(price) || 0,
        stock_quantity: parseInt(stock_quantity) || 0,
        sku: sku?.trim() || null,
        image_url: image_url?.trim() || null
      };

      const newItem = await Item.create(itemData);
      
      res.redirect(`/items/${newItem.id}?success=Item created successfully`);
    } catch (error) {
      console.error('❌ Error creating item:', error);
      
      const categories = await Category.getAll();
      
      if (error.code === '23505') {
        res.render('items/new', {
          title: 'Create New Item',
          item: req.body,
          categories,
          error: 'SKU already exists'
        });
      } else if (error.code === '23503') {
        res.render('items/new', {
          title: 'Create New Item',
          item: req.body,
          categories,
          error: 'Invalid category selected'
        });
      } else {
        res.status(500).render('error', {
          error: 'Server Error',
          message: 'Failed to create item'
        });
      }
    }
  },

  // Show form to edit item
  showEditForm: async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      console.log(`✏️ Loading edit form for item ${itemId}...`);
      
      const item = await Item.getById(itemId);
      const categories = await Category.getAll();
      
      if (!item) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Item not found'
        });
      }

      // Store original values for change tracking
      item.original_price = item.price;
      item.original_stock = item.stock_quantity;

      res.render('items/edit', {
        title: 'Edit Item',
        item,
        categories: categories || []
      });
    } catch (error) {
      console.error('❌ Error loading edit form:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load edit form'
      });
    }
  },

  // Update item with change tracking
  updateItem: async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const {
        category_id,
        name,
        brand,
        model,
        description,
        specifications,
        price,
        stock_quantity,
        sku,
        image_url
      } = req.body;

      const currentItem = await Item.getById(itemId);
      if (!currentItem) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Item not found'
        });
      }

      if (!name || name.trim() === '') {
        const categories = await Category.getAll();
        return res.render('items/edit', {
          title: 'Edit Item',
          item: { ...currentItem, ...req.body },
          categories,
          error: 'Item name is required'
        });
      }

      if (!category_id) {
        const categories = await Category.getAll();
        return res.render('items/edit', {
          title: 'Edit Item',
          item: { ...currentItem, ...req.body },
          categories,
          error: 'Category is required'
        });
      }

      const itemData = {
        category_id: parseInt(category_id),
        name: name.trim(),
        brand: brand?.trim() || null,
        model: model?.trim() || null,
        description: description?.trim() || null,
        specifications: specifications?.trim() || null,
        price: parseFloat(price) || 0,
        stock_quantity: parseInt(stock_quantity) || 0,
        sku: sku?.trim() || null,
        image_url: image_url?.trim() || null
      };

      const changes = [];
      if (currentItem.name !== itemData.name) changes.push(`Name: "${currentItem.name}" → "${itemData.name}"`);
      if (currentItem.category_id !== itemData.category_id) {
        const oldCat = await Category.getById(currentItem.category_id);
        const newCat = await Category.getById(itemData.category_id);
        changes.push(`Category: "${oldCat?.name || currentItem.category_id}" → "${newCat?.name || itemData.category_id}"`);
      }
      if (parseFloat(currentItem.price) !== parseFloat(itemData.price)) {
        changes.push(`Price: $${parseFloat(currentItem.price).toFixed(2)} → $${parseFloat(itemData.price).toFixed(2)}`);
      }
      if (parseInt(currentItem.stock_quantity) !== parseInt(itemData.stock_quantity)) {
        changes.push(`Stock: ${currentItem.stock_quantity} → ${itemData.stock_quantity}`);
      }
      if (currentItem.brand !== itemData.brand) changes.push(`Brand: "${currentItem.brand || 'none'}" → "${itemData.brand || 'none'}"`);
      if (currentItem.model !== itemData.model) changes.push(`Model: "${currentItem.model || 'none'}" → "${itemData.model || 'none'}"`);
      if (currentItem.sku !== itemData.sku) changes.push(`SKU: "${currentItem.sku || 'none'}" → "${itemData.sku || 'none'}"`);

      const updatedItem = await Item.update(itemId, itemData);
      
      let successMessage = 'Item updated successfully';
      if (changes.length > 0) {
        successMessage += `. Changes: ${changes.join(', ')}`;
      }
      
      res.redirect(`/items/${updatedItem.id}?success=${encodeURIComponent(successMessage)}`);
    } catch (error) {
      console.error('❌ Error updating item:', error);
      
      const categories = await Category.getAll();
      const item = await Item.getById(parseInt(req.params.id));
      
      if (error.code === '23505') {
        res.render('items/edit', {
          title: 'Edit Item',
          item: { ...item, ...req.body },
          categories,
          error: 'SKU already exists'
        });
      } else if (error.code === '23503') {
        res.render('items/edit', {
          title: 'Edit Item',
          item: { ...item, ...req.body },
          categories,
          error: 'Invalid category selected'
        });
      } else {
        res.status(500).render('error', {
          error: 'Server Error',
          message: 'Failed to update item'
        });
      }
    }
  },

  // Show delete confirmation
  showDeleteForm: async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await Item.getById(itemId);
      
      if (!item) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Item not found'
        });
      }

      res.render('items/delete', {
        title: 'Delete Item',
        item
      });
    } catch (error) {
      console.error('❌ Error loading delete form:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load delete form'
      });
    }
  },

  // Delete item
  deleteItem: async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      
      if (req.body.admin_password && req.body.admin_password !== process.env.ADMIN_PASSWORD) {
        const item = await Item.getById(itemId);
        return res.render('items/delete', {
          title: 'Delete Item',
          item,
          error: 'Incorrect admin password'
        });
      }

      const deletedItem = await Item.delete(itemId);
      res.redirect(`/categories/${deletedItem.category_id}?success=Item deleted successfully`);
    } catch (error) {
      console.error('❌ Error deleting item:', error);
      
      const item = await Item.getById(parseInt(req.params.id));
      res.render('items/delete', {
        title: 'Delete Item',
        item,
        error: 'Failed to delete item'
      });
    }
  },

  // Search items
  searchItems: async (req, res) => {
    try {
      const query = req.query.q || '';
      console.log(`🔍 Searching for: "${query}"`);
      
      let items = [];
      
      if (query.trim()) {
        items = await Item.search(query);
      }

      res.render('items/search', {
        title: 'Search Results',
        items: items || [],
        query: query
      });
    } catch (error) {
      console.error('❌ Error searching items:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to search items'
      });
    }
  },

  // Get low stock items
  showLowStock: async (req, res) => {
    try {
      const items = await Item.getLowStock();
      
      res.render('items/low-stock', {
        title: 'Low Stock Items',
        items: items || []
      });
    } catch (error) {
      console.error('❌ Error loading low stock items:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load low stock items'
      });
    }
  }
};

module.exports = itemController;
