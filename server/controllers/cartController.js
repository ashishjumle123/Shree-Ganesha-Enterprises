const User = require('../models/User');

// Helper: fetch user with populated cart
const getPopulatedCart = async (userId) => {
    const user = await User.findById(userId).populate('cart.product');
    return user ? user.cart.filter(item => item.product) : []; // filter out deleted products
};

// @route  GET /api/cart
// @desc   Get all cart items for the logged-in user (populated)
// @access Private
const getCart = async (req, res) => {
    try {
        const cart = await getPopulatedCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching cart', error: error.message });
    }
};

// @route  POST /api/cart/add
// @desc   Add a product to cart (or increment quantity if already in cart)
// @access Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'productId is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const existingIdx = user.cart.findIndex(
            item => item.product.toString() === productId.toString()
        );

        if (existingIdx > -1) {
            // Already in cart — increment quantity
            user.cart[existingIdx].quantity += Number(quantity);
        } else {
            // New item — push to cart
            user.cart.push({ product: productId, quantity: Number(quantity) });
        }

        await user.save();
        const cart = await getPopulatedCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error adding to cart', error: error.message });
    }
};

// @route  PUT /api/cart/update
// @desc   Update quantity of a cart item
// @access Private
const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: 'productId and quantity are required' });
        }

        if (Number(quantity) < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const item = user.cart.find(
            item => item.product.toString() === productId.toString()
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = Number(quantity);
        await user.save();
        const cart = await getPopulatedCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating cart', error: error.message });
    }
};

// @route  DELETE /api/cart/remove/:productId
// @desc   Remove a product from cart
// @access Private
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cart = user.cart.filter(
            item => item.product.toString() !== productId.toString()
        );

        await user.save();
        const cart = await getPopulatedCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error removing from cart', error: error.message });
    }
};

// @route  POST /api/cart/merge
// @desc   Merge guest cart (from localStorage) into DB cart after login
// @access Private
const mergeCart = async (req, res) => {
    try {
        // guestCart: [{ _id: productId, quantity: N, ...productFields }]
        const { guestCart = [] } = req.body;

        if (!Array.isArray(guestCart) || guestCart.length === 0) {
            const cart = await getPopulatedCart(req.user._id);
            return res.json(cart);
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        for (const guestItem of guestCart) {
            const productId = guestItem._id || guestItem.productId;
            if (!productId) continue;

            const existingIdx = user.cart.findIndex(
                item => item.product.toString() === productId.toString()
            );

            if (existingIdx > -1) {
                // Take the higher quantity — prefer DB quantity
                user.cart[existingIdx].quantity = Math.max(
                    user.cart[existingIdx].quantity,
                    Number(guestItem.quantity) || 1
                );
            } else {
                user.cart.push({
                    product: productId,
                    quantity: Number(guestItem.quantity) || 1
                });
            }
        }

        await user.save();
        const cart = await getPopulatedCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error merging cart', error: error.message });
    }
};

// @route  DELETE /api/cart/clear
// @desc   Clear entire cart (used after order placement)
// @access Private
const clearCart = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { cart: [] });
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Server error clearing cart', error: error.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, mergeCart, clearCart };
