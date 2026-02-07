import Issue from '../models/Issue.js';
import redis from '../config/redis.js';
import mongoose from 'mongoose';

// GET /api/analytics/state
export const getStateAnalytics = async (req, res) => {
    try {
        const cacheKey = `analytics:state`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const analytics = await Issue.aggregate([
            {
                $group: {
                    _id: null,
                    totalIssues: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ["$status", "SOLVED"] }, 1, 0] }
                    },
                    pending: {
                        $sum: { $cond: [{ $ne: ["$status", "SOLVED"] }, 1, 0] }
                    }
                }
            }
        ]);

        const categoryDist = await Issue.aggregate([
            {
                $lookup: {
                    from: "issue_categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryDoc"
                }
            },
            {
                $unwind: "$categoryDoc"
            },
            {
                $group: {
                    _id: "$categoryDoc.name",
                    count: { $sum: 1 }
                }
            }
        ]);

        const avgResolution = await Issue.aggregate([
            { $match: { status: 'SOLVED' } },
            {
                $project: {
                    duration: { $subtract: ["$updatedAt", "$createdAt"] }
                }
            },
            {
                $group: {
                    _id: null,
                    avgTime: { $avg: "$duration" }
                }
            }
        ]);

        const result = {
            summary: analytics[0] || { totalIssues: 0, resolved: 0, pending: 0 },
            avgResolutionTimeMs: avgResolution[0] ? avgResolution[0].avgTime : 0,
            categoryDistribution: categoryDist
        };

        await redis.setex(cacheKey, 300, JSON.stringify(result));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/analytics/city?cityId=
export const getCityAnalytics = async (req, res) => {
    try {
        const { cityId } = req.query;
        if (!cityId) return res.status(400).json({ message: 'City ID is required' });

        const cacheKey = `analytics:city:${cityId}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const analytics = await Issue.aggregate([
            { $match: { cityId: new mongoose.Types.ObjectId(cityId) } },
            {
                $group: {
                    _id: null,
                    totalIssues: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ["$status", "SOLVED"] }, 1, 0] }
                    }
                }
            }
        ]);

        const areaHotspots = await Issue.aggregate([
            { $match: { cityId: new mongoose.Types.ObjectId(cityId) } },
            {
                $group: {
                    _id: "$areaId",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "areas",
                    localField: "_id",
                    foreignField: "_id",
                    as: "areaInfo"
                }
            },
            {
                $project: {
                    count: 1,
                    areaName: { $arrayElemAt: ["$areaInfo.name", 0] }
                }
            }
        ]);

        const total = analytics[0]?.totalIssues || 0;
        const resolved = analytics[0]?.resolved || 0;
        const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(2) : 0;

        const result = {
            total,
            resolutionRate,
            areaHotspots
        };

        await redis.setex(cacheKey, 300, JSON.stringify(result));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/analytics/heatmap?cityId=
export const getHeatmap = async (req, res) => {
    try {
        // ... (Same logic, update field names)
        const { cityId } = req.query;
        if (!cityId) return res.status(400).json({ message: 'City ID is required' });

        const cacheKey = `heatmap:city:${cityId}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const issues = await Issue.find({ cityId: cityId }).select('location');

        const heatmap = issues.map(issue => ({
            lat: issue.location.coordinates[1],
            lng: issue.location.coordinates[0],
            count: 1
        }));

        await redis.setex(cacheKey, 300, JSON.stringify(heatmap));

        res.json(heatmap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
