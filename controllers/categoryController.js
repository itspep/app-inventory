const Category = require('../models/categoryModel');

const categoryController = {
  // List all categories
  listCategories: async (req, res) => {
    try {
      const categories = await Category.getAll();
      res.render('categories/index', { 
        title: 'Categories',
        categories,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('Error listing categories:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load categories'
      });
    }
  },

  // Show category details with items
  showCategory: async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const data = await Category.getWithItems(categoryId);
      
      if (!data.category) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Category not found'
        });
      }

      res.render('categories/show', {
        title: data.category.name,
        category: data.category,
        items: data.items
      });
    } catch (error) {
      console.error('Error showing category:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load category'
      });
    }
  },

  // Show form to create new category
  showCreateForm: (req, res) => {
    res.render('categories/new', {
      title: 'Create New Category',
      category: {}
    });
  },

  // Create new category
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      
      if (!name || name.trim() === '') {
        return res.render('categories/new', {
          title: 'Create New Category',
          category: { name, description },
          error: 'Category name is required'
        });
      }

      await Category.create(name.trim(), description?.trim() || '');
      
      res.redirect('/categories?success=Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      
      if (error.code === '23505') { // Unique violation
        res.render('categories/new', {
          title: 'Create New Category',
          category: req.body,
          error: 'Category name already exists'
        });
      } else {
        res.status(500).render('error', {
          error: 'Server Error',
          message: 'Failed to create category'
        });
      }
    }
  },

  // Show form to edit category
  showEditForm: async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await Category.getById(categoryId);
      
      if (!category) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Category not found'
        });
      }

      res.render('categories/edit', {
        title: 'Edit Category',
        category
      });
    } catch (error) {
      console.error('Error loading edit form:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load edit form'
      });
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const { name, description } = req.body;
      
      if (!name || name.trim() === '') {
        const category = await Category.getById(categoryId);
        return res.render('categories/edit', {
          title: 'Edit Category',
          category: { ...category, name, description },
          error: 'Category name is required'
        });
      }

      await Category.update(categoryId, name.trim(), description?.trim() || '');
      
      res.redirect('/categories?success=Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      
      if (error.code === '23505') { // Unique violation
        const category = await Category.getById(parseInt(req.params.id));
        res.render('categories/edit', {
          title: 'Edit Category',
          category: { ...category, ...req.body },
          error: 'Category name already exists'
        });
      } else {
        res.status(500).render('error', {
          error: 'Server Error',
          message: 'Failed to update category'
        });
      }
    }
  },

  // Show delete confirmation
  showDeleteForm: async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await Category.getById(categoryId);
      const hasItems = await Category.hasItems(categoryId);
      
      if (!category) {
        return res.status(404).render('error', {
          error: 'Not Found',
          message: 'Category not found'
        });
      }

      res.render('categories/delete', {
        title: 'Delete Category',
        category,
        hasItems
      });
    } catch (error) {
      console.error('Error loading delete form:', error);
      res.status(500).render('error', {
        error: 'Server Error',
        message: 'Failed to load delete form'
      });
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      
      // Check admin password if provided
      if (req.body.admin_password && req.body.admin_password !== process.env.ADMIN_PASSWORD) {
        const category = await Category.getById(categoryId);
        const hasItems = await Category.hasItems(categoryId);
        
        return res.render('categories/delete', {
          title: 'Delete Category',
          category,
          hasItems,
          error: 'Incorrect admin password'
        });
      }

      await Category.delete(categoryId);
      res.redirect('/categories?success=Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      
      if (error.code === '23503') { // Foreign key violation
        const category = await Category.getById(parseInt(req.params.id));
        const hasItems = await Category.hasItems(parseInt(req.params.id));
        
        res.render('categories/delete', {
          title: 'Delete Category',
          category,
          hasItems,
          error: 'Cannot delete category that has items. Delete or move the items first.'
        });
      } else {
        res.status(500).render('error', {
          error: 'Server Error',
          message: 'Failed to delete category'
        });
      }
    }
  }
};

module.exports = categoryController;
