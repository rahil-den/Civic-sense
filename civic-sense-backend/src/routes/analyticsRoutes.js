import express from 'express';
import { getStateAnalytics, getCityAnalytics, getHeatmap, getCityComparison } from '../controllers/analyticsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/state', verifyToken, getStateAnalytics);
router.get('/city', verifyToken, getCityAnalytics);
router.get('/heatmap', verifyToken, getHeatmap);
router.get('/comparison', verifyToken, getCityComparison);

export default router;
