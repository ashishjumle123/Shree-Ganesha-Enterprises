const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getProducts,
    getUniqueBrands,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteProductReview,
    getProductRecommendations
} = require('../controllers/productController');

// Define Routes
router.route('/')
    .get(getProducts)
    .post(protect, adminOnly, createProduct);

router.route('/brands/:category')
    .get(getUniqueBrands);

router.route('/recommendations/:id')
    .get(getProductRecommendations);

router.route('/:id')
    .get(getProductById)
    .put(protect, adminOnly, updateProduct)
    .delete(protect, adminOnly, deleteProduct);

router.route('/:id/reviews')
    .post(protect, createProductReview);

router.route('/:id/reviews/:reviewId')
    .delete(protect, deleteProductReview);

module.exports = router;
