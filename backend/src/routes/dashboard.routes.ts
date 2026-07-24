import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();
router.use(authenticateAdmin);

router.get('/stats', dashboardController.stats);
router.get('/reports/recent', dashboardController.recentReports);
router.get('/adoptions/recent', dashboardController.recentAdoptions);
router.get('/adoptions/trends', dashboardController.adoptionTrends);
router.get('/rescues/efficiency', dashboardController.rescueEfficiency);
router.get('/rescues/geo-distribution', dashboardController.geoDistribution);

export default router;
