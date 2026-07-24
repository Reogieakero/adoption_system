import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticateAdmin } from '../middleware/authenticateAdmin';
import { uploadMessagePhoto } from '../middleware/uploadMessages';

const router = Router();

router.use(authenticateAdmin);

router.get('/', messageController.listThreads);
router.get('/:thread_id/messages', messageController.getThreadMessages);
router.get('/:linked_type/:linked_id', messageController.getThreadByLinkedEntity);
router.post('/:linked_type/:linked_id/messages', uploadMessagePhoto.single('photo'), messageController.sendMessage);
router.patch('/:thread_id/read', messageController.markRead);

export default router;
