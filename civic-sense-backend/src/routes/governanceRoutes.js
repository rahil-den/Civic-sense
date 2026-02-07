import express from 'express';
import { getAdmins, updateAdmin, toggleCityStatus, addCategory } from '../controllers/governanceController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Super Admin only routes
router.get('/admins', verifyToken, requireRole('SUPERADMIN'), getAdmins);
router.patch('/admin/:id', verifyToken, requireRole('SUPERADMIN'), updateAdmin);
router.patch('/city/:id/toggle', verifyToken, requireRole('SUPERADMIN'), toggleCityStatus);
router.post('/category', verifyToken, requireRole('SUPERADMIN'), addCategory);

export default router;
