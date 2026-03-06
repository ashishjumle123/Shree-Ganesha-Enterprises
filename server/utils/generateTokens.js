const jwt = require('jsonwebtoken');

const generateTokens = (userId, role) => {
    // Generate Access Token (expires in 15 minutes)
    const accessToken = jwt.sign(
        { id: userId, role },
        process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret',
        { expiresIn: '15m' }
    );

    // Generate Refresh Token (expires in 7 days)
    const refreshToken = jwt.sign(
        { id: userId, role },
        process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

module.exports = { generateTokens };
