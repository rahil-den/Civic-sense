import express from 'express';
import { getFeed } from '../controllers/communityController.js';

const router = express.Router();

router.get('/', getFeed);

export default router;
