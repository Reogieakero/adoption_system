import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { chatRepository, ConversationSummaryRow } from '../repositories/chat.repository';
import { getIO } from '../socket';
import { AppError } from '../errors/AppError';
import { ChatMessage } from '../types/chat.types';

export const chatService = {
  async getConversations(userId: number) {
    const rows = await chatRepository.getConversationsForUser(userId);
    const results = await Promise.all(
      rows.map(async (r: ConversationSummaryRow) => {
        const participantIds: number[] =
          typeof r.participant_ids === 'string' ? JSON.parse(r.participant_ids) : r.participant_ids;
        const otherUserId = participantIds.find((id: number) => id !== userId) ?? 0;
        const otherUserName = await chatRepository.getUserName(otherUserId);
        return {
          conversation_id: r.conversation_id,
          participant_ids: participantIds,
          last_message: r.last_message_id
            ? {
                message_id: r.last_message_id,
                message_text: r.last_message_text,
                sender_id: r.last_sender_id,
                sent_at: r.last_message_at,
              }
            : null,
          last_message_at: r.last_message_at,
          unread_count: r.unread_count,
          other_user_name: otherUserName ?? 'Unknown',
          created_at: r.created_at,
        };
      })
    );
    return results;
  },

  async getMessages(conversationId: number, userId: number) {
    const rows = await chatRepository.getConversationsForUser(userId);
    const conv = rows.find((r: ConversationSummaryRow) => r.conversation_id === conversationId);
    if (!conv) throw new AppError(404, 'Conversation not found');

    const messages = await chatRepository.getMessages(conversationId);
    const mapped: ChatMessage[] = messages.map((m) => ({
      message_id: m.message_id,
      conversation_id: m.conversation_id,
      sender_id: m.sender_id,
      sender_name: m.sender_name,
      message_text: m.message_text,
      is_read: !!m.is_read,
      sent_at: String(m.sent_at),
    }));
    return mapped;
  },

  async sendMessage(conversationId: number, senderId: number, text: string, _recipientId?: number, photoUrl?: string | null) {
    if (!text || !text.trim()) throw new AppError(400, 'Message text is required');

    const messageId = await chatRepository.createMessage(conversationId, senderId, text, photoUrl);
    const messages = await chatRepository.getMessages(conversationId);
    const message = messages.find((m) => m.message_id === messageId);
    if (!message) throw new AppError(500, 'Failed to create message');

    const [convRows] = await pool.execute<RowDataPacket[]>(
      'SELECT participant_ids FROM chat_conversations WHERE conversation_id = ?',
      [conversationId]
    );
    const raw = convRows[0].participant_ids;
    const participantIds: number[] = Array.isArray(raw) ? raw : JSON.parse(raw);
    const recipientId = participantIds.find((id: number) => id !== senderId) ?? 0;

    const io = getIO();
    const recipientRoom = `user-${recipientId}`;
    const senderRoom = `user-${senderId}`;

    const payload = {
      message_id: message.message_id,
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      sender_name: message.sender_name,
      message_text: message.message_text,
      photo_url: message.photo_url,
      is_read: !!message.is_read,
      sent_at: String(message.sent_at),
    };

    if (recipientId) {
      io.to(recipientRoom).emit('chat:new-message', payload);
    }
    io.to(senderRoom).emit('chat:new-message', payload);

    return payload;
  },

  async markConversationRead(conversationId: number, userId: number) {
    await chatRepository.markConversationRead(conversationId, userId);
  },

  async getUnreadCount(userId: number) {
    return chatRepository.getUnreadCount(userId);
  },

  async findOrCreateConversation(userId1: number, userId2: number) {
    if (userId1 === userId2) throw new AppError(400, `Cannot create a conversation with yourself (userId1=${userId1}, userId2=${userId2})`);
    const conversationId = await chatRepository.findOrCreateConversation(userId1, userId2);
    return { conversation_id: conversationId };
  },
};