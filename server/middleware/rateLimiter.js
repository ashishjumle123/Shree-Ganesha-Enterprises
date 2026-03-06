const rateLimit = require('express-rate-limit');

/**
 * Login Limiter
 * Maximum 5 requests per 15 minutes per IP
 * Purpose: prevent brute-force login attacks
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Register Limiter
 * Maximum 5 requests per 15 minutes per IP
 * Purpose: prevent fake account creation
 */
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Payment Limiter
 * Maximum 10 requests per minute per IP
 * Purpose: prevent payment API abuse
 */
const paymentLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    loginLimiter,
    registerLimiter,
    paymentLimiter
};
