const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    createReview,
    getProductReviews,
    deleteReview,
    checkReviewEligibility
} = require('../controllers/reviewController');

// Define Routes
router.route('/:productId')
    .get(getProductReviews)
    .post(protect, createReview);

router.get('/check/:productId', protect, checkReviewEligibility);

router.route('/:id')
    .delete(protect, adminOnly, deleteReview);

module.exports = router;
