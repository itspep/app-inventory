const express = require('express');
const router = express.Router();

// Import controllers
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');
const changesController = require('../controllers/changesController');
const dashboardController = require('../controllers/dashboardController');

// Home page - Dashboard
router.get('/dashboard', dashboardController.getDashboard);

// ===== CATEGORY ROUTES =====
router.get('/categories', categoryController.listCategories);
router.get('/categories/new', categoryController.showCreateForm);
router.post('/categories', categoryController.createCategory);
router.get('/categories/:id', categoryController.showCategory);
router.get('/categories/:id/edit', categoryController.showEditForm);
router.put('/categories/:id', categoryController.updateCategory);
router.get('/categories/:id/delete', categoryController.showDeleteForm);
router.delete('/categories/:id', categoryController.deleteCategory);

// ===== ITEM ROUTES =====
router.get('/items', itemController.listItems);
router.get('/items/new', itemController.showCreateForm);
router.post('/items', itemController.createItem);
router.get('/items/:id', itemController.showItem);
router.get('/items/:id/edit', itemController.showEditForm);
router.put('/items/:id', itemController.updateItem);
router.get('/items/:id/delete', itemController.showDeleteForm);
router.delete('/items/:id', itemController.deleteItem);

// Search and special routes
router.get('/search', itemController.searchItems);
router.get('/low-stock', itemController.showLowStock);

// Changes routes
router.get('/changes', changesController.showRecentChanges);
router.get('/items/:id/history', changesController.showItemHistory);

module.exports = router;
