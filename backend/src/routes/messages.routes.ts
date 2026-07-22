import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/', messageController.listThreads);
router.get('/:id/messages', messageController.getThreadMessages);
router.post('/:id/messages', messageController.sendMessage);
router.patch('/:id/read', messageController.markRead);

export default router;
