import { Router } from 'express';
import { publicController } from '../controllers/public.controller';

const router = Router();

router.get('/pets/featured', publicController.featuredPets);
router.get('/pets', publicController.allPets);
router.get('/pets/:id', publicController.petDetail);
router.get('/reports/recent', publicController.recentReports);
router.get('/content/testimonials', publicController.testimonials);
router.get('/content/stats', publicController.impactStats);
router.get('/content/latest-module', publicController.latestModule);

export default router;
