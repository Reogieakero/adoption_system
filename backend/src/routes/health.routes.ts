import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/', healthController.list);
router.get('/:id', healthController.getDetail);
router.post('/:id/history', healthController.addHistoryEntry);
router.patch('/:id/vitals', healthController.updateVitals);

export default router;