import express from 'express';
import { exportCityAnalyticsCsv, exportStateAnalyticsPdf } from './export.controller.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
// Exporting reports is likely an ADMIN function
router.get('/analytics/city/csv', requireRole('ADMIN'), exportCityAnalyticsCsv);
router.get('/analytics/state/pdf', requireRole('ADMIN'), exportStateAnalyticsPdf);

export default router;
