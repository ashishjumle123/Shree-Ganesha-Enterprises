require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

// ─── Connect Database ──────────────────────────────────────────────────────────
connectDB();

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(compression());

// Helmet — production-safe CSP that allows Cloudinary, Lordicon, Razorpay, Google Fonts
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://checkout.razorpay.com",
                "https://cdn.lordicon.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "https://res.cloudinary.com",
                "https://images.unsplash.com",
                "https://cdn.lordicon.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "data:"
            ],
            connectSrc: [
                "'self'",
                "https://api.razorpay.com",
                "https://cdn.lordicon.com",
                "https://*.mongodb.net"
            ],
            frameSrc: [
                "'self'",
                "https://checkout.razorpay.com"
            ],
            workerSrc: ["'self'", "blob:"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// CORS — allow configured origin (set CLIENT_URL env var on Render)
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session (MongoDB-backed)
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60 * 24,
        autoRemove: 'native'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/users', require('./server/routes/userRoutes'));
app.use('/api/cart', require('./server/routes/cartRoutes'));
app.use('/api/payment', require('./server/routes/paymentRoutes'));
app.use('/api/orders', require('./server/routes/orderRoutes'));
app.use('/api/products', require('./server/routes/productRoutes'));
app.use('/api/upload', require('./server/routes/uploadRoutes'));
app.use('/api/contact', require('./server/routes/contactRoutes'));
app.use('/api/banners', require('./server/routes/bannerRoutes'));

// ─── Serve React Frontend (Vite Build) ────────────────────────────────────────
// Must come AFTER all API routes so /api/* is never intercepted by static serving
const clientDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback — Express 5 compatible (no wildcard, use middleware function)
// This catches all non-API requests and returns index.html so React Router works
app.use((req, res, next) => {
    // Only serve index.html for non-API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must have exactly 4 params (err, req, res, next) — Express uses this to detect error handlers
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});