import express from 'express';
import { exportCityIssues, exportStateReport } from '../controllers/exportController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/city/csv', verifyToken, requireRole('ADMIN'), exportCityIssues);
router.get('/state/pdf', verifyToken, requireRole('ADMIN'), exportStateReport);

export default router;
