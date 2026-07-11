import { Router } from 'express';
import { heatmapController } from '../controllers/heatmap.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/', heatmapController.getData);

export default router;