import { Router } from 'express';
import { residentController } from '../controllers/resident.controller';
import { chatController } from '../controllers/chat.controller';
import { messageController } from '../controllers/message.controller';
import { authenticateUser } from '../middleware/authenticateUser';
import { uploadReports } from '../middleware/uploadReports';
import { uploadMessagePhoto } from '../middleware/uploadMessages';

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

// Chat
router.get('/chat/admins', residentController.listChatAdmins);
router.get('/chat/conversations', chatController.listConversations);
router.get('/chat/conversations/:id/messages', chatController.getMessages);
router.post('/chat/conversations/:id/messages', uploadMessagePhoto.single('photo'), chatController.sendMessage);
router.patch('/chat/conversations/:id/read', chatController.markRead);
router.post('/chat/conversations', chatController.findOrCreateConversation);
router.get('/chat/unread-count', chatController.getUnreadCount);

// Case-linked messaging
router.get('/messages/unread-count', messageController.getUnreadCount);
router.get('/messages', messageController.listThreads);
router.get('/messages/:thread_id/messages', messageController.getThreadMessages);
router.get('/messages/:linked_type/:linked_id', messageController.getThreadByLinkedEntity);
router.post('/messages/:linked_type/:linked_id/messages', uploadMessagePhoto.single('photo'), messageController.sendMessage);
router.patch('/messages/:thread_id/read', messageController.markRead);

export default router;
