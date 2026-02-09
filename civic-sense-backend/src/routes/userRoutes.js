import express from 'express';
import { getUsers, warnUser, deleteUser, toggleBanUser } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users (filtrable by role)
router.get('/', verifyToken, requireRole('ADMIN'), getUsers);

// Warn a user (auto-bans on 3rd warning)
router.post('/:userId/warn', verifyToken, requireRole('ADMIN'), warnUser);

// Manual Ban/Unban toggle
router.patch('/:userId/ban', verifyToken, requireRole('ADMIN'), toggleBanUser);

// Delete a user
router.delete('/:userId', verifyToken, requireRole('ADMIN'), deleteUser);

export default router;
