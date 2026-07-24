import { Router } from 'express';
import { adoptionController } from '../controllers/adoption.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/', adoptionController.list);
router.get('/pending-count', adoptionController.countPending);
router.get('/:id/details', adoptionController.getDetails);
router.patch('/:id/status', adoptionController.updateStatus);

export default router;
