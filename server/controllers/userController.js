const User = require('../models/User');

// @route   POST /api/users/wishlist
// @desc    Toggle product in wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isAlreadyInWishlist = user.wishlist.includes(productId);

        if (isAlreadyInWishlist) {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
        } else {
            // Add to wishlist
            user.wishlist.push(productId);
        }

        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error toggling wishlist', error: error.message });
    }
};

// @route   GET /api/users/wishlist
// @desc    Get populated wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error retrieving wishlist', error: error.message });
    }
};

const bcrypt = require('bcryptjs');

// @route   PATCH /api/users/profile
// @desc    Update user profile (name)
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating profile', error: error.message });
    }
};

// @route   PATCH /api/users/change-password
// @desc    Change user password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }

            // user model has pre-save hook that hashes passwords if modified
            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error changing password', error: error.message });
    }
};

module.exports = {
    toggleWishlist,
    getWishlist,
    updateProfile,
    changePassword
};
