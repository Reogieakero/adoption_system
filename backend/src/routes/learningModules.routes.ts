import { Router } from 'express';
import { learningModuleController } from '../controllers/learningModule.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateAdmin);

router.get('/', learningModuleController.list);
router.get('/:id', learningModuleController.getById);
router.post('/', upload.single('image'), learningModuleController.create);
router.post('/:id/duplicate', learningModuleController.duplicate);
router.patch('/:id', upload.single('image'), learningModuleController.update);
router.delete('/:id', learningModuleController.remove);

export default router;