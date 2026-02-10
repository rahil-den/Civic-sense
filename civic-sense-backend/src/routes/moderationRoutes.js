import express from 'express';
import { getFlaggedUsers, issueWarning, banUser } from '../controllers/moderationController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', verifyToken, requireRole('ADMIN'), getFlaggedUsers);
router.post('/warning', verifyToken, requireRole('ADMIN'), issueWarning);
router.patch('/users/:id/ban', verifyToken, requireRole('SUPERADMIN'), banUser); // Restrict ban to SuperAdmin? Or Admin? Task says "Moderation Panel". I'll allow ADMIN for now or check requirements.

export default router;
