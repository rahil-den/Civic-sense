import express from 'express';
import { createIssue, getIssues, getIssueById, updateStatus, resolveIssue, getDuplicateIssues } from '../controllers/issueController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createIssue);
router.get('/', verifyToken, getIssues);
router.get('/:id', verifyToken, getIssueById);

// Admin actions
router.get('/duplicates', verifyToken, requireRole('ADMIN'), getDuplicateIssues);
router.put('/:id/status', verifyToken, requireRole('ADMIN'), updateStatus);
router.post('/:id/resolve', verifyToken, requireRole('ADMIN'), resolveIssue);

export default router;
