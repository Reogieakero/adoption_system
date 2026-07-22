import { Router } from 'express';
import { animalReportController } from '../controllers/animalReport.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/', animalReportController.list);
router.get('/:id/details', animalReportController.getDetails);
router.patch('/:id/status', animalReportController.updateStatus);

export default router;
