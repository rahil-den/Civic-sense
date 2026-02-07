import { invalidateAnalyticsCache } from './cacheInvalidation.js'; // Reuse existing logic

/**
 * Invalidates analytics cache when a report is modified.
 * Call this function whenever a report is created, updated, or deleted.
 * @param {string} city - The city of the report (optional but recommended for targeted clearing)
 * @param {object} io - Socket.io instance to emit updates
 */
export const invalidateReportAnalytics = async (city, io) => {
    console.log(`[CACHE] Report changed in ${city || 'Global'}. Invalidating analytics...`);

    // 1. Clear Redis Keys
    await invalidateAnalyticsCache(city);

    // 2. Emit Socket Event for Real-time Dashboard Update
    if (io) {
        io.emit('analyticsUpdated', { city });
        console.log(`[SOCKET] Emitted analyticsUpdated event for ${city || 'Global'}`);
    }
};
