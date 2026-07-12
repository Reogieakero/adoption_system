import { Router } from 'express';
import { authenticateAdmin } from '../middleware/authenticateAdmin'; // TODO: confirm export name/path
import { listUsers, updateStatus, deleteUser } from '../controllers/adminUsers.controller';

const router = Router();

router.use(authenticateAdmin);

router.get('/', listUsers);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteUser);

export default router;