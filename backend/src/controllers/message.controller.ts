import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services/message.service';
import { handleServiceError } from '../middleware/authenticateAdmin';
import { ThreadLinkedType } from '../types/message.types';

export const messageController = {
  async listThreads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = !!req.admin;
      const userId = isAdmin ? req.admin!.id : req.user!.id;
      const threads = await messageService.listThreads(userId, isAdmin);
      res.json({ success: true, threads });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getThreadByLinkedEntity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = !!req.admin;
      const userId = isAdmin ? req.admin!.id : req.user!.id;
      const { linked_type, linked_id } = req.params;
      const linkedId = Number(linked_id);

      if (!['adoption_application', 'animal_report'].includes(linked_type)) {
        res.status(400).json({ success: false, message: 'Invalid linked_type' });
        return;
      }
      if (isNaN(linkedId)) {
        res.status(400).json({ success: false, message: 'Invalid linked_id' });
        return;
      }

      const data = await messageService.getThreadByLinkedEntity(
        linked_type as ThreadLinkedType,
        linkedId,
        userId,
        isAdmin
      );
      res.json({ success: true, ...data });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getThreadMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = !!req.admin;
      const userId = isAdmin ? req.admin!.id : req.user!.id;
      const threadId = Number(req.params.thread_id);

      if (isNaN(threadId)) {
        res.status(400).json({ success: false, message: 'Invalid thread ID' });
        return;
      }

      const data = await messageService.getThreadMessages(threadId, userId, isAdmin);
      res.json({ success: true, ...data });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = !!req.admin;
      const senderId = isAdmin ? req.admin!.id : req.user!.id;
      const { linked_type, linked_id } = req.params;
      const linkedId = Number(linked_id);

      if (!['adoption_application', 'animal_report'].includes(linked_type)) {
        res.status(400).json({ success: false, message: 'Invalid linked_type' });
        return;
      }
      if (isNaN(linkedId)) {
        res.status(400).json({ success: false, message: 'Invalid linked_id' });
        return;
      }

      const messageText = req.body.message_text || null;
      const photoUrl = req.file ? `/uploads/messages/${req.file.filename}` : (req.body.photo_url || null);

      const result = await messageService.sendMessage(
        linked_type as ThreadLinkedType,
        linkedId,
        senderId,
        isAdmin ? 'admin' : 'resident',
        messageText,
        photoUrl
      );

      res.status(201).json({ success: true, message: result });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.admin ? req.admin!.id : req.user!.id;
      const threadId = Number(req.params.thread_id);

      if (isNaN(threadId)) {
        res.status(400).json({ success: false, message: 'Invalid thread ID' });
        return;
      }

      await messageService.markRead(threadId, userId);
      res.json({ success: true, message: 'Messages marked as read' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.admin ? req.admin!.id : req.user!.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const count = await messageService.getUnreadCount(userId);
      res.json({ success: true, unread_count: count });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
