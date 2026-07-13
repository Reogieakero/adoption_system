import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/', notificationController.list);
router.get('/unread-count', notificationController.unreadCount);
router.post('/', notificationController.create);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);
router.delete('/:id', notificationController.remove);

export default router;