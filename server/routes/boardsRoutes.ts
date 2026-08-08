import { Router } from 'express';
import { getBoardsOverview, getWorkOrders, getDeals } from '../controllers/boardsController.js';

const router = Router();

router.get('/boards', getBoardsOverview);
router.get('/work-orders', getWorkOrders);
router.get('/deals', getDeals);

export default router;
