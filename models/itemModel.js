const db = require('../config/database');

const Item = {
  // Get all items with category details
  getAll: async () => {
    try {
      const result = await db.query(
        `SELECT 
          i.*,
          c.name as category_name
         FROM items i
         JOIN categories c ON i.category_id = c.id
         ORDER BY i.name`
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Item.getAll:', error);
      throw error;
    }
  },

  // Get item by ID with category details
  getById: async (id) => {
    try {
      const result = await db.query(
        `SELECT 
          i.*,
          c.name as category_name,
          c.description as category_description
         FROM items i
         JOIN categories c ON i.category_id = c.id
         WHERE i.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Item.getById:', error);
      throw error;
    }
  },

  // Get items by category
  getByCategory: async (categoryId) => {
    try {
      const result = await db.query(
        `SELECT 
          i.*,
          c.name as category_name
         FROM items i
         JOIN categories c ON i.category_id = c.id
         WHERE i.category_id = $1
         ORDER BY i.name`,
        [categoryId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Item.getByCategory:', error);
      throw error;
    }
  },

  // Create new item
  create: async (itemData) => {
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
    } = itemData;

    try {
      // Parse specifications if it's a string
      let specs = specifications;
      if (typeof specifications === 'string') {
        try {
          specs = JSON.parse(specifications);
        } catch {
          specs = {};
        }
      }

      const result = await db.query(
        `INSERT INTO items (
          category_id, name, brand, model, description, 
          specifications, price, stock_quantity, sku, image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          category_id,
          name,
          brand || null,
          model || null,
          description || null,
          specs || null,
          price || 0,
          stock_quantity || 0,
          sku || null,
          image_url || null
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Item.create:', error);
      throw error;
    }
  },

  // Update item
  update: async (id, itemData) => {
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
    } = itemData;

    try {
      // Parse specifications if it's a string
      let specs = specifications;
      if (typeof specifications === 'string') {
        try {
          specs = JSON.parse(specifications);
        } catch {
          specs = {};
        }
      }

      const result = await db.query(
        `UPDATE items SET
          category_id = $1,
          name = $2,
          brand = $3,
          model = $4,
          description = $5,
          specifications = $6,
          price = $7,
          stock_quantity = $8,
          sku = $9,
          image_url = $10,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *`,
        [
          category_id,
          name,
          brand || null,
          model || null,
          description || null,
          specs || null,
          price || 0,
          stock_quantity || 0,
          sku || null,
          image_url || null,
          id
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Item.update:', error);
      throw error;
    }
  },

  // Delete item
  delete: async (id) => {
    try {
      const result = await db.query(
        'DELETE FROM items WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Item.delete:', error);
      throw error;
    }
  },

  // Search items
  search: async (query) => {
    try {
      const result = await db.query(
        `SELECT 
          i.*,
          c.name as category_name
         FROM items i
         JOIN categories c ON i.category_id = c.id
         WHERE i.name ILIKE $1 
            OR i.brand ILIKE $1 
            OR i.model ILIKE $1 
            OR i.description ILIKE $1
            OR c.name ILIKE $1
         ORDER BY i.name`,
        [`%${query}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Item.search:', error);
      throw error;
    }
  },

  // Get low stock items (less than 5 in stock)
  getLowStock: async () => {
    try {
      const result = await db.query(
        `SELECT 
          i.*,
          c.name as category_name
         FROM items i
         JOIN categories c ON i.category_id = c.id
         WHERE i.stock_quantity < 5
         ORDER BY i.stock_quantity`
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Item.getLowStock:', error);
      throw error;
    }
  },

  // Get item change history
  getChangeHistory: async (itemId) => {
    try {
      // Check if item_changes table exists
      const tableCheck = await db.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'item_changes'
        )`
      );
      
      if (!tableCheck.rows[0].exists) {
        console.log('item_changes table does not exist yet');
        return [];
      }
      
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
      return result.rows;
    } catch (error) {
      console.error('Error in Item.getChangeHistory:', error);
      return [];
    }
  },

  // Get recent changes across all items
  getRecentChanges: async (limit = 50) => {
    try {
      // Check if item_changes table exists
      const tableCheck = await db.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'item_changes'
        )`
      );
      
      if (!tableCheck.rows[0].exists) {
        console.log('item_changes table does not exist yet');
        return [];
      }
      
      const result = await db.query(
        `SELECT 
          ic.*,
          i.name as item_name,
          c.name as category_name
         FROM item_changes ic
         JOIN items i ON ic.item_id = i.id
         JOIN categories c ON i.category_id = c.id
         ORDER BY ic.changed_at DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error in Item.getRecentChanges:', error);
      return [];
    }
  }
};

module.exports = Item;
