import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/', healthController.list);
router.get('/:id', healthController.getByPetId);
router.post('/:id', healthController.upsert);
router.patch('/:id', healthController.update);

export default router;
