import { clearCache } from './cache.service.js';

/**
 * Invalidates analytics cache when reports or governance change
 * @param {string} city - The city related to the change (optional)
 */
export const invalidateAnalyticsCache = async (city) => {
    try {
        const keys = [
            'analytics:state',
            'analytics:leaderboard',
            'analytics:trend:*', // Wildcard needs careful handling in real Redis, here implementing as clearing specific known trend key for simplicity or iterating
            'analytics:trend:7',
            'analytics:trend:30'
        ];

        if (city) {
            keys.push(`analytics:city:${city}`);
            keys.push(`heatmap:city:${city}`);
        }

        console.log(`[CACHE] Invalidating keys for city: ${city || 'Global'}`);

        // Parallel deletion
        await Promise.all(keys.map(key => clearCache(key)));

    } catch (error) {
        console.error('Error invalidating analytics cache:', error);
    }
};
