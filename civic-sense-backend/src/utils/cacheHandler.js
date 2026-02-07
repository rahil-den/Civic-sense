import redis from '../config/redis.js';

export const invalidateCache = async (cityId, stateId) => {
    try {
        const keys = [];
        if (stateId) keys.push(`analytics:state`);
        if (cityId) {
            keys.push(`analytics:city:${cityId}`);
            keys.push(`heatmap:city:${cityId}`);
        }

        if (keys.length > 0) {
            await redis.del(keys);
            console.log(`Invalidated keys: ${keys.join(', ')}`);
        }
    } catch (error) {
        console.error('Cache Invalidation Error:', error);
    }
};
