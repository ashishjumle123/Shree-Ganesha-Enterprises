const mongoose = require('mongoose');
require('dotenv').config();

// ─── Configuration ─────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
const RETRY_DELAY = 5000;   // ms between reconnection attempts
const MAX_RETRIES = 10;     // max retry attempts before giving up
let retryCount = 0;
let isConnecting = false;  // Guard to prevent concurrent connect calls

// ─── Connection Options ─────────────────────────────────────────────────────
const MONGO_OPTIONS = {
    maxPoolSize: 10,     // Max concurrent connections in pool
    minPoolSize: 2,     // Keep at least 2 connections warm
    serverSelectionTimeoutMS: 10000,  // Give up selecting a server after 10s
    socketTimeoutMS: 45000,  // Kill idle sockets after 45s
    connectTimeoutMS: 10000,  // Abort connection attempt after 10s
    heartbeatFrequencyMS: 10000,  // Check server health every 10s
    retryWrites: true,
    retryReads: true,
};

// ─── Error Classifier ──────────────────────────────────────────────────────
const getTip = (message = '') => {
    if (message.includes('ENOTFOUND') || message.includes('querySrv'))
        return '👉 Check internet connection or Atlas cluster hostname.';
    if (message.includes('Authentication failed') || message.includes('bad auth'))
        return '👉 Check Atlas username/password in MONGO_URI inside .env';
    if (message.includes('whitelist') || message.includes('IP'))
        return '👉 Your IP is not whitelisted. Go to Atlas → Network Access → Add Current IP.';
    if (message.includes('timed out') || message.includes('ETIMEDOUT'))
        return '👉 Connection timed out. Ensure cluster is running and IP is whitelisted.';
    return '👉 Check that your MONGO_URI is correct and Atlas cluster is active.';
};

// ─── Core Connect Function ─────────────────────────────────────────────────
const connectDB = async () => {
    if (isConnecting) return;  // Prevent concurrent calls
    isConnecting = true;

    if (!MONGO_URI) {
        console.error('❌ MONGO_URI is not defined in .env — server cannot start.');
        process.exit(1);
    }

    try {
        console.log(`🔄 Connecting to MongoDB Atlas... (attempt ${retryCount + 1})`);
        const conn = await mongoose.connect(MONGO_URI, MONGO_OPTIONS);

        retryCount = 0;       // Reset on successful connection
        isConnecting = false;

        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);

    } catch (error) {
        isConnecting = false;
        retryCount++;

        console.error(`❌ MongoDB Connection Failed! (attempt ${retryCount}/${MAX_RETRIES})`);
        console.error(`   Reason : ${error.message}`);
        console.error(`   Tip    : ${getTip(error.message)}`);

        if (retryCount >= MAX_RETRIES) {
            console.error('🚨 Max retry attempts reached. Please check your MongoDB Atlas setup.');
            console.error('   The server will keep running but database operations will fail.');
            return; // Don't crash — let the server stay up for health checks
        }

        console.log(`⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
        setTimeout(connectDB, RETRY_DELAY);
    }
};

// ─── Connection Event Listeners ────────────────────────────────────────────
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB Atlas.');
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Scheduling automatic reconnect...');
    // Auto-reconnect after a short delay when Atlas temporarily drops the connection
    if (!isConnecting) {
        setTimeout(connectDB, RETRY_DELAY);
    }
});

mongoose.connection.on('reconnected', () => {
    retryCount = 0;
    console.log('✅ MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
    // Log but don't crash — Mongoose handles reconnection internally
    console.error(`❌ MongoDB runtime error: ${err.message}`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
    // SIGINT is also sent by nodemon during hot-reloads — detect and skip those
    // nodemon sets process.env.npm_lifecycle_script; real shutdowns come from user Ctrl+C
    const isNodemonRestart = !!process.env.NODEMON_RESTART;
    if (isNodemonRestart) return;

    console.log(`\n🛑 ${signal} received. Closing MongoDB connection gracefully...`);
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed cleanly. Goodbye.');
    } catch (err) {
        console.error('⚠️  Error closing MongoDB connection:', err.message);
    } finally {
        process.exit(0);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Docker / PM2 stop
// SIGINT on Windows: only handle when not spawned by nodemon
if (!process.env.npm_lifecycle_script?.includes('nodemon')) {
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Ctrl+C
}

module.exports = connectDB;
