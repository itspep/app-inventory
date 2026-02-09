const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Electronic Store Inventory',
    message: 'Welcome to our inventory management system'
  });
});

// Categories routes
router.get('/categories', categoryController.listCategories);
router.get('/categories/new', categoryController.showCreateForm);
router.post('/categories', categoryController.createCategory);
router.get('/categories/:id', categoryController.showCategory);
router.get('/categories/:id/edit', categoryController.showEditForm);
router.put('/categories/:id', categoryController.updateCategory);
router.get('/categories/:id/delete', categoryController.showDeleteForm);
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
