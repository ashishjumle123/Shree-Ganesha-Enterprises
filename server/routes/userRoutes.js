const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Define the routes under /api/users
router.route('/wishlist')
    .post(protect, toggleWishlist)
    .get(protect, getWishlist);

router.route('/profile')
    .patch(protect, updateProfile);

router.route('/change-password')
    .patch(protect, changePassword);

module.exports = router;
