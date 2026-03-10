const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// Define Routes
router.route('/')
    .get(getCategories)
    .post(protect, adminOnly, createCategory);

router.route('/:id')
    .put(protect, adminOnly, updateCategory)
    .delete(protect, adminOnly, deleteCategory);

module.exports = router;
