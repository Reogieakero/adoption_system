import { Router } from 'express';
import { animalController } from '../controllers/animal.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateAdmin);

router.get('/', animalController.list);
router.get('/:id', animalController.getById);
router.post('/', upload.single('photo'), animalController.create);
router.patch('/:id', upload.single('photo'), animalController.update);
router.delete('/:id', animalController.remove);

export default router;