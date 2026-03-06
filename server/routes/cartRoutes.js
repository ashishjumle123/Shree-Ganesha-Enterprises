const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    mergeCart,
    clearCart
} = require('../controllers/cartController');

// All routes are protected — require JWT auth
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove/:productId', protect, removeFromCart);
router.post('/merge', protect, mergeCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
