import { Router } from 'express';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { settingsController } from '../controllers/settings.controller';

const router = Router();

router.use(authenticateAdmin);

router.get('/profile', settingsController.getProfile);
router.patch('/profile', settingsController.updateProfile);
router.put('/password', settingsController.changePassword);
router.get('/notification-preferences', settingsController.getNotificationPreferences);
router.patch('/notification-preferences', settingsController.updateNotificationPreferences);
router.get('/app', settingsController.getAppSettings);
router.patch('/app', settingsController.updateAppSettings);

export default router;
