import express from 'express';
import { getStateAnalytics, getCityAnalytics, getHeatmap } from '../controllers/analyticsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/state', verifyToken, getStateAnalytics);
router.get('/city', verifyToken, getCityAnalytics);
router.get('/heatmap', verifyToken, getHeatmap);

export default router;
