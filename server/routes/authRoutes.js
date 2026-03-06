const express = require('express');
const router = express.Router();
const {
    registerUser,
    sendOtp,
    verifyOtp,
    sendForgotPasswordOtp,
    resetPassword,
    loginUser,
    getUserProfile,
    googleSignIn,
    refreshToken,
    logoutUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, registerUser);
router.post('/send-otp', registerLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password-otp', loginLimiter, sendForgotPasswordOtp);
router.post('/reset-password', loginLimiter, resetPassword);
router.post('/login', loginLimiter, loginUser);
router.post('/google', loginLimiter, googleSignIn);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
