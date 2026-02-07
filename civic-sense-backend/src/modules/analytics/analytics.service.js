import Report from '../../models/Report.js';
import * as cacheService from '../cache/cache.service.js';

/**
 * Get State Level Analytics with Caching
 * @returns {Promise<Object>}
 */
export const getStateAnalytics = async () => {
    const CACHE_KEY = 'analytics:state';

    // 1. Check Cache
    const cachedData = await cacheService.getCache(CACHE_KEY);
    if (cachedData) {
        return cachedData;
    }

    // 2. Compute via Aggregation
    const pipeline = [
        {
            $facet: {
                // General Counts (Total, Resolved, Pending)
                statusCounts: [
                    {
                        $group: {
                            _id: null,
                            totalReports: { $sum: 1 },
                            resolvedReports: {
                                $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
                            },
                            rejectedReports: { // Optional but good to have
                                $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                            },
                            // Assuming "pending" is anything not resolved or rejected (reported + in_progress)
                            pendingReports: {
                                $sum: {
                                    $cond: [
                                        { $in: ["$status", ["reported", "in_progress"]] },
                                        1,
                                        0
                                    ]
                                }
                            }
                        }
                    },
                ],
                // Average Resolution Time (Only for resolved reports)
                resolutionMetrics: [
                    { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
                    {
                        $project: {
                            duration: { $subtract: ["$resolvedAt", "$createdAt"] } // duration in ms
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            avgDurationMs: { $avg: "$duration" }
                        }
                    }
                ],
                // Category Distribution
                categoryStats: [
                    {
                        $group: {
                            _id: "$category",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } } // Highest first
                ]
            }
        }
    ];

    const results = await Report.aggregate(pipeline);

    // Format Result
    const stats = results[0];
    const statusData = stats.statusCounts[0] || { totalReports: 0, resolvedReports: 0, pendingReports: 0 };
    const resolutionData = stats.resolutionMetrics[0] || { avgDurationMs: 0 };

    // Convert ms to hours
    const avgResolutionTimeHours = parseFloat((resolutionData.avgDurationMs / (1000 * 60 * 60)).toFixed(2));

    const finalResult = {
        totalReports: statusData.totalReports,
        resolvedReports: statusData.resolvedReports,
        pendingReports: statusData.pendingReports,
        avgResolutionTimeHours,
        categoryDistribution: stats.categoryStats.map(c => ({ category: c._id, count: c.count }))
    };

    // 3. Set Cache (TTL 300s)
    await cacheService.setCache(CACHE_KEY, finalResult, 300);

    return finalResult;
};

/**
 * Get City Level Analytics
 * @param {string} city 
 * @returns {Promise<Object>}
 */
export const getCityAnalytics = async (city) => {
    const CACHE_KEY = `analytics:city:${city}`;

    const cached = await cacheService.getCache(CACHE_KEY);
    if (cached) return cached;

    const pipeline = [
        { $match: { city: city } },
        {
            $facet: {
                counts: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            resolved: {
                                $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
                            }
                        }
                    }
                ],
                categories: [
                    { $group: { _id: "$category", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 5 }
                ],
                areas: [
                    { $group: { _id: "$area", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    // Limit hotspots? User said group with counts, didn't specify limit, but usually good to limit.
                    // keeping unlimited but simplified.
                    { $limit: 20 }
                ]
            }
        }
    ];

    const results = await Report.aggregate(pipeline);
    const data = results[0];
    const counts = data.counts[0] || { total: 0, resolved: 0 };

    const resolutionRate = counts.total > 0
        ? parseFloat(((counts.resolved / counts.total) * 100).toFixed(2))
        : 0;

    const response = {
        city,
        totalReports: counts.total,
        resolvedReports: counts.resolved,
        resolutionRate: `${resolutionRate}%`,
        topCategories: data.categories.map(c => ({ category: c._id, count: c.count })),
        areaHotspots: data.areas.map(a => ({ area: a._id, count: a.count }))
    };

    await cacheService.setCache(CACHE_KEY, response, 300);
    return response;
};

/**
 * Get Report Trends Over Time
 * @param {number} days 
 * @returns {Promise<Array>}
 */
export const getTrendAnalytics = async (days = 7) => {
    const CACHE_KEY = `analytics:trend:${days}`;

    const cached = await cacheService.getCache(CACHE_KEY);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const pipeline = [
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } } // Ascending date
    ];

    const results = await Report.aggregate(pipeline);

    // Map to clean format
    const formatted = results.map(r => ({ date: r._id, count: r.count }));

    await cacheService.setCache(CACHE_KEY, formatted, 300);
    return formatted;
};

/**
 * Get Department Leaderboard
 * @returns {Promise<Array>}
 */
export const getDepartmentLeaderboard = async () => {
    const CACHE_KEY = 'analytics:leaderboard';

    const cached = await cacheService.getCache(CACHE_KEY);
    if (cached) return cached;

    const pipeline = [
        { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
        {
            $project: {
                department: 1,
                duration: { $subtract: ["$resolvedAt", "$createdAt"] }
            }
        },
        {
            $group: {
                _id: "$department",
                avgDurationMs: { $avg: "$duration" },
                resolvedCount: { $sum: 1 }
            }
        },
        { $sort: { avgDurationMs: 1 } } // Lowest time first = fastest
    ];

    const results = await Report.aggregate(pipeline);

    const formatted = results.map(r => ({
        department: r._id,
        avgResolutionTimeHours: parseFloat((r.avgDurationMs / (1000 * 60 * 60)).toFixed(2)),
        resolvedCount: r.resolvedCount
    }));

    await cacheService.setCache(CACHE_KEY, formatted, 600); // 10 min TTL
    return formatted;
};

// Export object for cleaner import if needed, or mostly named exports are fine in modern JS
/**
 * Get Heatmap Data
 * @param {string} city 
 * @returns {Promise<Array>}
 */
export const getHeatmapAnalytics = async (city) => {
    const CACHE_KEY = `heatmap:city:${city}`;

    const cached = await cacheService.getCache(CACHE_KEY);
    if (cached) return cached;

    const pipeline = [
        { $match: { city: city } },
        {
            $project: {
                // Round coordinates to ~1.1km precision (2 decimal places) for clustering
                // Using 3 decimals as requested in implementation details (~100m)
                lat: { $arrayElemAt: ["$location.coordinates", 1] },
                lng: { $arrayElemAt: ["$location.coordinates", 0] }
            }
        },
        {
            $group: {
                _id: {
                    lat: { $round: ["$lat", 2] },
                    lng: { $round: ["$lng", 2] }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                lat: "$_id.lat",
                lng: "$_id.lng",
                count: 1
            }
        }
    ];

    const results = await Report.aggregate(pipeline);

    await cacheService.setCache(CACHE_KEY, results, 300);
    return results;
};

/**
 * Get Area Trend
 * @param {string} area 
 * @param {number} days 
 * @returns {Promise<Array>}
 */
export const getAreaTrendAnalytics = async (area, days = 30) => {
    const CACHE_KEY = `analytics:areaTrend:${area}:${days}`;

    const cached = await cacheService.getCache(CACHE_KEY);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const pipeline = [
        {
            $match: {
                area: area,
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ];

    const results = await Report.aggregate(pipeline);
    const formatted = results.map(r => ({ date: r._id, count: r.count }));

    await cacheService.setCache(CACHE_KEY, formatted, 300);
    return formatted;
};

export default {
    getStateAnalytics,
    getCityAnalytics,
    getTrendAnalytics,
    getDepartmentLeaderboard,
    getHeatmapAnalytics,
    getAreaTrendAnalytics
};
