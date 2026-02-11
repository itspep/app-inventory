const db = require('../config/database');

const Category = {
  // Get all categories
  getAll: async () => {
    try {
      const result = await db.query(
        'SELECT * FROM categories ORDER BY name'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const result = await db.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get category with its items
  getWithItems: async (id) => {
    try {
      const categoryResult = await db.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
      );
      
      const itemsResult = await db.query(
        'SELECT * FROM items WHERE category_id = $1 ORDER BY name',
        [id]
      );

      return {
        category: categoryResult.rows[0],
        items: itemsResult.rows
      };
    } catch (error) {
      throw error;
    }
  },

  // Create new category
  create: async (name, description) => {
    try {
      const result = await db.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update category
  update: async (id, name, description) => {
    try {
      const result = await db.query(
        'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Delete category (only if no items exist due to RESTRICT constraint)
  delete: async (id) => {
    try {
      const result = await db.query(
        'DELETE FROM categories WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      // This will throw if items exist due to foreign key constraint
      throw error;
    }
  },

  // Check if category has items
  hasItems: async (id) => {
    try {
      const result = await db.query(
        'SELECT COUNT(*) FROM items WHERE category_id = $1',
        [id]
      );
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Category;

  // Get item count for category
  getItemCount: async (id) => {
    try {
      const result = await db.query(
        'SELECT COUNT(*) FROM items WHERE category_id = $1',
        [id]
      );
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error in Category.getItemCount:', error);
      throw error;
    }
  }
