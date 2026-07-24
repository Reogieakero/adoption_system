import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { uploadMessagePhoto } from '../middleware/uploadMessages';

const router = Router();

router.use(authenticateAdmin);

router.get('/conversations', chatController.listConversations);
router.get('/conversations/:id/messages', chatController.getMessages);
router.post('/conversations/:id/messages', uploadMessagePhoto.single('photo'), chatController.sendMessage);
router.patch('/conversations/:id/read', chatController.markRead);
router.post('/conversations', chatController.findOrCreateConversation);
router.get('/unread-count', chatController.getUnreadCount);
router.get('/residents', chatController.listResidents);

export default router;