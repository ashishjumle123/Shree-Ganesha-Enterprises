const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Update Product ratings summary
const updateProductRatings = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                ratingsAverage: { $avg: '$rating' },
                ratingsCount: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: stats[0].ratingsAverage.toFixed(1),
            ratingsCount: stats[0].ratingsCount,
            // Sync legacy fields
            rating: stats[0].ratingsAverage,
            numReviews: stats[0].ratingsCount
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsCount: 0,
            rating: 0,
            numReviews: 0
        });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews/:productId
// @access  Private
const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 1. Check if user already reviewed
        const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed by you' });
        }

        // 2. Verified Purchase Check
        const order = await Order.findOne({
            user: req.user._id,
            orderStatus: { $ne: 'Cancelled' },
            'orderItems.product': productId
        });

        if (!order) {
            return res.status(403).json({
                message: "Only customers who purchased this product can submit a review."
            });
        }

        // 3. Create Review
        const review = await Review.create({
            user: req.user._id,
            product: productId,
            name: req.user.name,
            rating: Number(rating),
            comment,
            verifiedPurchase: true
        });

        // 4. Update Product Ratings
        await updateProductRatings(productId);

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: 'Error creating review', error: error.message });
    }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'recent' } = req.query;
        const productId = req.params.productId;

        let sortBy = { createdAt: -1 };
        if (sort === 'highest') sortBy = { rating: -1, createdAt: -1 };
        if (sort === 'lowest') sortBy = { rating: 1, createdAt: -1 };

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort(sortBy)
            .skip(skip)
            .limit(Number(limit));

        const totalReviews = await Review.countDocuments({ product: productId });

        res.json({
            reviews,
            page: Number(page),
            pages: Math.ceil(totalReviews / limit),
            totalReviews
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const productId = review.product;

        await review.deleteOne();

        // Update Product Ratings
        await updateProductRatings(productId);

        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

// @desc    Check if user can review a product
// @route   GET /api/reviews/check/:productId
// @access  Private
const checkReviewEligibility = async (req, res) => {
    try {
        const productId = req.params.productId;

        // 1. Check if already reviewed
        const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
        if (alreadyReviewed) {
            return res.json({ canReview: false, message: 'You have already reviewed this product.' });
        }

        // 2. Check if purchased and not cancelled
        const order = await Order.findOne({
            user: req.user._id,
            orderStatus: { $ne: 'Cancelled' },
            'orderItems.product': productId
        });

        if (order) {
            return res.json({ canReview: true });
        } else {
            return res.json({ canReview: false, message: 'Only customers who purchased this product can write a review.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking eligibility', error: error.message });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    deleteReview,
    checkReviewEligibility
};
