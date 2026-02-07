import express from 'express';
import { getStates, getCities, getAreas, addState, addCity, addArea } from '../controllers/locationController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public read access
router.get('/states', getStates);
router.get('/states/:stateId/cities', getCities);
router.get('/cities/:cityId/areas', getAreas);

// Admin write access
router.post('/states', verifyToken, requireRole('SUPERADMIN'), addState);
router.post('/cities', verifyToken, requireRole('ADMIN'), addCity);
router.post('/areas', verifyToken, requireRole('ADMIN'), addArea);

export default router;
