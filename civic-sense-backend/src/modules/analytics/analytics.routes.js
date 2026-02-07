import express from 'express';
import { getStateStats, getCityStats, getTrendStats, getDepartmentLeaderboard, getHeatmap, getAreaTrend } from './analytics.controller.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = express.Router();

// Apply global RBAC for this router - All analytics require ADMIN
router.use(verifyToken);
router.use(requireRole('ADMIN'));

router.get('/state', getStateStats);
router.get('/city', getCityStats);
router.get('/trend', getTrendStats);
router.get('/leaderboard', getDepartmentLeaderboard);
router.get('/heatmap', getHeatmap);
router.get('/area-trend', getAreaTrend);

export default router;
