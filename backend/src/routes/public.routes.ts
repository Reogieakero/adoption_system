import { Router } from 'express';
import { publicController } from '../controllers/public.controller';

const router = Router();

router.get('/pets/featured', publicController.featuredPets);
router.get('/pets', publicController.allPets);
router.get('/reports/recent', publicController.recentReports);
router.get('/content/testimonials', publicController.testimonials);
router.get('/content/stats', publicController.impactStats);

export default router;
