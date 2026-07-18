import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRegister, handleValidationErrors } from '../middleware/validateRegister';

const router = Router();

router.post(
  '/register',
  validateRegister,
  handleValidationErrors,
  authController.register
);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-code', authController.resendCode);
router.post('/login', authController.login);
router.post('/google', authController.googleSignIn);
router.post('/google/complete', authController.googleSignUpComplete);

export default router;
