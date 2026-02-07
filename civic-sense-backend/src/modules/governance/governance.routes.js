import express from 'express';
import { createAdmin, disableAdmin, enableCity, disableCity, getListAdmins, updateAdminDetails, reassignDepartment } from './governance.controller.js';
import { verifyToken, requireRole } from '../../middleware/auth.js';

const router = express.Router();

// Strict SUPERADMIN access
router.use(verifyToken);
router.use(requireRole('SUPERADMIN'));

// Admin Management
router.get('/admins', getListAdmins);
router.post('/admin', createAdmin);
router.patch('/admin/:id', updateAdminDetails);
router.patch('/admin/:id/department', reassignDepartment);
router.patch('/admin/:id/disable', disableAdmin);

// City Management
router.patch('/city/:name/enable', enableCity);
router.patch('/city/:name/disable', disableCity);

export default router;
