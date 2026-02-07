import analyticsService from './analytics.service.js';
import { logAction } from '../audit/auditLogger.js';

export const getStateStats = async (req, res) => {
    try {
        const stats = await analyticsService.getStateAnalytics();

        // Audit Log
        const userId = req.user ? req.user.id : 'unknown';
        logAction(userId, 'VIEW_ANALYTICS', 'ANALYTICS', 'state-stats');

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in getStateStats:', error);
        res.status(500).json({ message: 'Server Error retrieving state analytics' });
    }
};

export const getCityStats = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'City parameter is required' });
        }

        const stats = await analyticsService.getCityAnalytics(city);

        const userId = req.user ? req.user.id : 'unknown';
        logAction(userId, 'VIEW_ANALYTICS', 'ANALYTICS', `city-stats-${city}`);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in getCityStats:', error);
        res.status(500).json({ message: 'Server Error retrieving city analytics' });
    }
};

export const getTrendStats = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const stats = await analyticsService.getTrendAnalytics(days);

        const userId = req.user ? req.user.id : 'unknown';
        logAction(userId, 'VIEW_ANALYTICS', 'ANALYTICS', `trend-${days}days`);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in getTrendStats:', error);
        res.status(500).json({ message: 'Server Error retrieving trend analytics' });
    }
};

export const getDepartmentLeaderboard = async (req, res) => {
    try {
        const stats = await analyticsService.getDepartmentLeaderboard();

        const userId = req.user ? req.user.id : 'unknown';
        logAction(userId, 'VIEW_ANALYTICS', 'ANALYTICS', 'department-leaderboard');

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in getDepartmentLeaderboard:', error);
        res.status(500).json({ message: 'Server Error retrieving leaderboard' });
    }
};

export const getHeatmap = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'City parameter is required' });
        }

        const stats = await analyticsService.getHeatmapAnalytics(city);

        const userId = req.user ? req.user.id : 'unknown';
        logAction(userId, 'VIEW_ANALYTICS', 'ANALYTICS', `heatmap-${city}`);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in getHeatmap:', error);
        res.status(500).json({ message: 'Server Error retrieving heatmap' });
    }
};

export const getAreaTrend = async (req, res) => {
    try {
        const { area } = req.query;
        const days = parseInt(req.query.days) || 30;

        if (!area) {
            return res.status(400).json({ message: 'Area parameter is required' });
        }

        const stats = await analyticsService.getAreaTrendAnalytics(area, days);

        const userId = req.user ? req.user.id : 'unknown';
        logAction(userId, 'VIEW_ANALYTICS', 'ANALYTICS', `areaTrend-${area}`);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in getAreaTrend:', error);
        res.status(500).json({ message: 'Server Error retrieving area trend' });
    }
};
