import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { authService } from '../services/auth.service';

function handleServiceError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...err.extra,
    });
    return;
  }
  next(err);
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body as {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      };

      const result = await authService.register({ firstName, lastName, email, password });

      res.status(201).json({
        success: true,
        requiresVerification: result.requiresVerification,
        message: 'Verification code sent to your email',
        user: result.user,
      });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, code } = req.body as { email?: string; code?: string };

    if (!email || !code) {
      res.status(400).json({ success: false, message: 'Email and code are required' });
      return;
    }

    try {
      await authService.verifyEmail(email, code);
      res.json({ success: true, message: 'Email verified successfully' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async resendCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body as { email?: string };

    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    try {
      await authService.resendCode(email);
      res.json({ success: true, message: 'A new code has been sent to your email' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    try {
      const result = await authService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idToken } = req.body as { idToken?: string };

    if (!idToken) {
      res.status(400).json({ success: false, message: 'idToken is required' });
      return;
    }

    try {
      const result = await authService.googleSignIn(idToken);
      res.json({ success: true, ...result });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
