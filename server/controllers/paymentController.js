const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_123'
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { amount } = req.body; // Amount in rupees

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Error creating Razorpay order' });
        }

        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        next(error);
    }
};

const Order = require('../models/Order');

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment verification parameters' });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_123';

        // Create HMAC SHA256 mapping
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
        }

        // Signature verified optionally update order dynamically
        if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'Completed',
                    update_time: new Date().toISOString()
                };
                order.paymentStatus = 'Paid';
                await order.save();
            }
        }

        res.json({ verified: true, message: 'Payment verified successfully' });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    verifyPayment
};
