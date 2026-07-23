import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { adminAuthService } from '../services/adminAuth.service';

function handleServiceError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  next(err);
}

export const adminAuthController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    try {
      const result = await adminAuthService.login(email, password, req.ip);
      res.json({ success: true, ...result });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
