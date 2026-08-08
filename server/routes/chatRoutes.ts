import { Router } from 'express';
import { processChatQuery } from '../controllers/chatController.js';

const router = Router();

router.post('/chat', processChatQuery);

export default router;
