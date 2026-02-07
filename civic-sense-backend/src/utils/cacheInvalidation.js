import { invalidateCache } from './cacheHandler.js';

export const invalidateAnalytics = async (redis, cityId, stateId) => {
    // Deprecated direct call, forwarding to handler for backward compatibility if needed, 
    // or better yet, we just update the caller to use cacheHandler.js. 
    // But since I can only edit this file here...

    await invalidateCache(cityId, stateId);
};
