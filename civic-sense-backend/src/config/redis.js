import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redis;

if (process.env.USE_REDIS === 'true') {
    redis = new Redis(process.env.REDIS_URI || 'redis://localhost:6379');
    
    redis.on('connect', () => {
        console.log('Redis connected successfully');
    });
    
    redis.on('error', (err) => {
        console.error('Redis connection error:', err);
    });
} else {
    console.warn('⚠️ Redis is disabled (USE_REDIS is not true). Using in-memory mock.');
    const store = new Map();
    redis = {
        on: () => {},
        get: async (key) => store.get(key) || null,
        set: async (key, val) => { store.set(key, val); },
        setex: async (key, ex, val) => { store.set(key, val); },
        del: async (keys) => {
            if (Array.isArray(keys)) keys.forEach(k => store.delete(k));
            else store.delete(keys);
        },
        call: async () => 1
    };
}

export default redis;
