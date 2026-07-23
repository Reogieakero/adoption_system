import { Router } from 'express';
import { residentController } from '../controllers/resident.controller';
import { authenticateUser } from '../middleware/authenticateUser';
import { uploadReports } from '../middleware/uploadReports';

const router = Router();

router.use(authenticateUser);

// Adoption applications
router.get('/adoptions', residentController.listMyApplications);
router.get('/adoptions/:id', residentController.getMyApplicationDetail);
router.post('/adoptions', residentController.submitApplication);

// Rescue reports
router.get('/reports', residentController.listMyReports);
router.get('/reports/:id', residentController.getMyReportDetail);
router.post('/reports', residentController.submitReport);
router.post('/reports/upload', uploadReports.array('photos', 5), residentController.uploadReportPhotos);

// Learning modules
router.get('/learning/modules', residentController.listPublishedModules);
router.get('/learning/modules/:id', residentController.getPublishedModuleById);
router.get('/learning/modules/:id/progress', residentController.getMyProgress);
router.patch('/learning/modules/:id/progress', residentController.updateMyProgress);

// Notifications
router.get('/notifications', residentController.listMyNotifications);
router.get('/notifications/unread-count', residentController.getUnreadCount);
router.patch('/notifications/:id/read', residentController.markNotificationRead);
router.patch('/notifications/read-all', residentController.markAllNotificationsRead);

export default router;
