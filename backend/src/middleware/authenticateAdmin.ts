import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';

interface AdminTokenPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Admin authentication required' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AdminTokenPayload;
    if (payload.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired admin token' });
  }
}

export function handleServiceError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  next(err);
}
