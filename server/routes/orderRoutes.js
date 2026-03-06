const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, getOrderById, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, adminOnly, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/status').put(protect, adminOnly, updateOrderStatus);

module.exports = router;
