import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { CreateNotificationInput, NotificationType } from '../types/notification.types';
import { handleServiceError } from '../middleware/authenticateAdmin';

export const notificationController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, type, unreadOnly } = req.query;
      const result = await notificationService.list({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        type: type as NotificationType | undefined,
        unreadOnly: unreadOnly === 'true',
      });
      res.json({ success: true, ...result });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async unreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await notificationService.getUnreadCount();
      res.json({ success: true, count });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateNotificationInput;
      const notification = await notificationService.create(input);
      res.status(201).json({ success: true, notification });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await notificationService.markAsRead(Number(req.params.id));
      res.json({ success: true, notification });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await notificationService.markAllAsRead();
      res.json({ success: true, updated });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.remove(Number(req.params.id));
      res.json({ success: true });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
