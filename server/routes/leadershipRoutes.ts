import { Router } from 'express';
import { generateLeadershipUpdate } from '../controllers/leadershipController.js';

const router = Router();

router.post('/leadership-update', generateLeadershipUpdate);

export default router;
