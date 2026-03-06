require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
// connect-mongo uses ES module default export; use .default for CommonJS require
const MongoStore = require('connect-mongo').default;

const app = express();
const port = process.env.PORT || 5000;

// Database Connection Setup
const connectDB = require('./config/db');
connectDB();

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Middleware
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Implement Compression middleware to compress API responses
app.use(compression());

// Implement Helmet security middleware
app.use(helmet({
    // Content-Security-Policy: Protects against XSS and insecure resource loading
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            // Allow images from Cloudinary, Unsplash, data URIs, and blob URIs
            imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://images.unsplash.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            connectSrc: ["'self'", "https://api.razorpay.com"],
            frameSrc: ["'self'", "https://checkout.razorpay.com"]
        },
    },
    // Cross-Origin-Resource-Policy: Set to "cross-origin" to avoid blocking API requests from React frontend and external images
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Cross-Origin-Opener-Policy: Set to allow popups to ensure Razorpay checkout window can communicate back
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    // Referrer-Policy: Prevents leaking sensitive URL info to external sites
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    // Note: X-Frame-Options and X-Content-Type-Options are automatically enabled by Helmet with secure defaults.
}));

const cors = require('cors');
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session Configuration using connect-mongo
// MUST be before routes so sessions are available everywhere
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60 * 24,         // Session TTL: 1 day
        autoRemove: 'native',       // Use MongoDB TTL index to auto-clean
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// API Routes
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/users', require('./server/routes/userRoutes'));
app.use('/api/cart', require('./server/routes/cartRoutes'));
app.use('/api/payment', require('./server/routes/paymentRoutes'));
app.use('/api/orders', require('./server/routes/orderRoutes'));
app.use('/api/products', require('./server/routes/productRoutes'));
app.use('/api/upload', require('./server/routes/uploadRoutes'));
app.use('/api/contact', require('./server/routes/contactRoutes'));
app.use('/api/banners', require('./server/routes/bannerRoutes'));

const Product = require('./models/Product');

// ... (Other routes can go here later)

// Basic route to render home page
app.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('listings/index', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products");
    }
});

// Product detail route
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.render('listings/show', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching product details");
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Start the Express Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`); // node restart triggered
});

import path from "path"

const __dirname = path.resolve()

app.use(express.static(path.join(__dirname, "client/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
})