/**
 * In-Memory Cache Utility (Redis-free fallback)
 * Provides the same caching interface as Redis but uses Node.js memory.
 * TTL-based expiry is handled automatically.
 * 
 * Benefits:
 * - Zero external dependencies (no Redis server needed)
 * - Same get/set/del/keys API as the Redis client
 * - Auto-expires entries using TTL (seconds)
 * - Production-safe with no connection errors
 */

class MemoryCache {
    constructor() {
        this.store = new Map();
        this.isReady = true; // Always ready - no connection needed

        // Periodically clean expired keys every 60 seconds to free memory
        setInterval(() => this._cleanup(), 60_000);
    }

    /**
     * Get value by key. Returns null if missing or expired.
     */
    async get(key) {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Set key with value and TTL in seconds.
     */
    async setEx(key, ttlSeconds, value) {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000
        });
    }

    /**
     * Delete one or more keys.
     */
    async del(keys) {
        if (Array.isArray(keys)) {
            keys.forEach(k => this.store.delete(k));
        } else {
            this.store.delete(keys);
        }
    }

    /**
     * Return all keys matching a pattern (supports * wildcard).
     */
    async keys(pattern) {
        const regexStr = pattern.replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexStr}$`);
        return [...this.store.keys()].filter(k => regex.test(k));
    }

    /**
     * Internal cleanup - removes expired keys to prevent memory leaks.
     */
    _cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (entry.expiresAt && now > entry.expiresAt) {
                this.store.delete(key);
            }
        }
    }
}

// Export a single shared instance
const cacheClient = new MemoryCache();
console.log('✅ In-Memory Cache Active (5-min TTL on product queries)');

module.exports = cacheClient;
