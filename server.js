require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const Product = require('./models/Product');

const app = express();

// Connect Database
connectDB();

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(compression());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://images.unsplash.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      frameSrc: ["'self'", "https://checkout.razorpay.com"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session Configuration
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

// Home Page
app.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('listings/index', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
  }
});

// Product Detail Page
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

// Serve React Frontend (Vite build)
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});