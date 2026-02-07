import redisClient from '../../config/redis.js';

/**
 * Get data from cache
 * @param {string} key 
 * @returns {Promise<any|null>} Parsed data or null
 */
export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        if (data) {
            return JSON.parse(data);
        }
        return null; // Explicitly return null if not found
    } catch (error) {
        console.error(`Redis Get Error for key ${key}:`, error);
        return null; // Fail safe return null to allow database fetch
    }
};

/**
 * Set data in cache
 * @param {string} key 
 * @param {any} data 
 * @param {number} ttl Seconds
 */
export const setCache = async (key, data, ttl) => {
    try {
        const serialized = JSON.stringify(data);
        if (ttl) {
            await redisClient.set(key, serialized, 'EX', ttl);
        } else {
            await redisClient.set(key, serialized);
        }
    } catch (error) {
        console.error(`Redis Set Error for key ${key}:`, error);
        // Do not throw, just log. Caching failure shouldn't crash app.
    }
};

/**
 * Clear specific cache key
 * @param {string} key 
 */
export const clearCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error(`Redis Del Error for key ${key}:`, error);
    }
};
