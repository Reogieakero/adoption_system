import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services/message.service';
import { AppError } from '../errors/AppError';

function handleServiceError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  next(err);
}

export const messageController = {
  async listThreads(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const threads = await messageService.listThreads();
      res.json({ success: true, threads });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getThreadMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const threadId = Number(req.params.id);
      if (isNaN(threadId)) {
        res.status(400).json({ success: false, message: 'Invalid thread ID' });
        return;
      }
      const data = await messageService.getThreadMessages(threadId);
      res.json({ success: true, ...data });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const threadId = Number(req.params.id);
      if (isNaN(threadId)) {
        res.status(400).json({ success: false, message: 'Invalid thread ID' });
        return;
      }

      const adminId = (req as any).user?.id;
      if (!adminId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { message_text, photo_url } = req.body as {
        message_text?: string;
        photo_url?: string;
      };

      const message = await messageService.sendMessage(threadId, adminId, message_text ?? null, photo_url ?? null);
      res.status(201).json({ success: true, message });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const threadId = Number(req.params.id);
      if (isNaN(threadId)) {
        res.status(400).json({ success: false, message: 'Invalid thread ID' });
        return;
      }

      const adminId = (req as any).user?.id;
      if (!adminId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      await messageService.markRead(threadId, adminId);
      res.json({ success: true, message: 'Messages marked as read' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
