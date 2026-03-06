const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getBanners, createBanner, deleteBanner } = require('../controllers/bannerController');

router.route('/').get(getBanners).post(protect, adminOnly, createBanner);
router.route('/:id').delete(protect, adminOnly, deleteBanner);

module.exports = router;
