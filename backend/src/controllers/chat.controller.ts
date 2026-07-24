import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { handleServiceError } from '../middleware/authenticateAdmin';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const chatController = {
  async listConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin ? req.admin.id : req.user!.id;
      const conversations = await chatService.getConversations(userId);
      res.json({ success: true, data: conversations });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin ? req.admin.id : req.user!.id;
      const conversationId = parseInt(req.params.id, 10);
      const messages = await chatService.getMessages(conversationId, userId);
      res.json({ success: true, data: messages });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.admin ? req.admin.id : req.user!.id;
      const conversationId = parseInt(req.params.id, 10);
      const { message_text, recipient_id } = req.body;
      const photoUrl = req.file ? `/uploads/messages/${req.file.filename}` : null;

      const message = await chatService.sendMessage(conversationId, senderId, message_text, recipient_id, photoUrl);
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin ? req.admin.id : req.user!.id;
      const conversationId = parseInt(req.params.id, 10);
      await chatService.markConversationRead(conversationId, userId);
      res.json({ success: true });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async findOrCreateConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin ? req.admin.id : req.user!.id;
      const { recipient_id } = req.body;
      const result = await chatService.findOrCreateConversation(userId, recipient_id);
      res.json({ success: true, data: result });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin ? req.admin.id : req.user!.id;
      const count = await chatService.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async listResidents(req: Request, res: Response, next: NextFunction) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT user_id, full_name FROM users WHERE role = 'resident'`
      );
      res.json({
        success: true,
        data: rows.map((r) => ({ user_id: Number(r.user_id), full_name: r.full_name })),
      });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};