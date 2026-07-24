import { Router } from 'express';
import { learningModuleController } from '../controllers/learningModule.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateAdmin);

// Categories
router.get('/categories', learningModuleController.listCategories);
router.post('/categories', learningModuleController.createCategory);

// Modules
router.get('/', learningModuleController.listModules);
router.get('/category/:categoryId', learningModuleController.listByCategory);

// Progress (must come before /:id to avoid route collision)
router.get('/progress/completed-counts', learningModuleController.getCompletedCounts);

router.get('/:id', learningModuleController.getById);
router.post('/', upload.single('cover_image'), learningModuleController.create);
router.post('/:id/duplicate', learningModuleController.duplicate);
router.patch('/:id', upload.single('cover_image'), learningModuleController.update);
router.delete('/:id', learningModuleController.remove);
router.get('/:id/progress/:residentId', learningModuleController.getProgress);
router.post('/:id/progress', learningModuleController.updateProgress);

export default router;
