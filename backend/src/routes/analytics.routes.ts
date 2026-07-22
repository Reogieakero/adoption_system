import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/overview', analyticsController.overview);

export default router;
