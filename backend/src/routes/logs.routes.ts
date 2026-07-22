import { Router } from 'express';
import { logController } from '../controllers/log.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();
router.use(authenticateAdmin);
router.get('/', logController.list);

export default router;
