import { Router } from 'express';
import { adminAuthController } from '../controllers/adminAuth.controller';

const router = Router();

router.post('/login', adminAuthController.login);

export default router;
