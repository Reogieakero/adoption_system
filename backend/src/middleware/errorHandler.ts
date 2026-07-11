import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

interface MysqlError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: MysqlError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err.stack || err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...err.extra,
    });
    return;
  }

  if (err.code === 'ER_DUP_ENTRY') {
    res.status(409).json({
      success: false,
      message: 'An account with this email already exists',
    });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Route not found' });
}
