import { Router } from 'express';
import { rescueController } from '../controllers/rescue.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { validateMatiLandLocation } from '../middleware/validateMatiLandLocation';

const router = Router();

router.use(authenticateAdmin);

router.get('/', rescueController.list);
router.get('/:id/details', rescueController.getDetails);
router.patch('/:id/stage', rescueController.updateStage);
router.patch('/:id/status', rescueController.updateStatus);
router.patch('/:id/assign', rescueController.assignRescuer);
router.patch('/:id/priority', rescueController.updatePriority);
router.patch('/:id/notes', rescueController.updateNotes);
router.patch('/:id/location', validateMatiLandLocation, rescueController.updateLocation);

export default router;