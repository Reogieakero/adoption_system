import { Router } from 'express';
import { petController } from '../controllers/pet.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateAdmin);

router.get('/', petController.list);
router.get('/:id', petController.getById);
router.post('/', upload.single('photo'), petController.create);
router.patch('/:id', upload.single('photo'), petController.update);
router.delete('/:id', petController.remove);
router.post('/:id/generate-3d', petController.generate3D);
router.post('/:id/generate-3d-from-description', petController.generate3DDescription);

export default router;
