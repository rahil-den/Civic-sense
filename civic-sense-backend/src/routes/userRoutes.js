import express from 'express';
import { getUsers, warnUser } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('ADMIN'), getUsers);
router.post('/:userId/warn', verifyToken, requireRole('ADMIN'), warnUser);

export default router;
