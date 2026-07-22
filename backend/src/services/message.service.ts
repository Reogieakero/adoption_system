import { messageRepository } from '../repositories/message.repository';
import { notificationService } from './notification.service';
import { ThreadLinkedType } from '../types/message.types';
import { AppError } from '../errors/AppError';

export const messageService = {
  async listThreads() {
    const threads = await messageRepository.findThreadsWithDetails();
    return threads.map((t) => ({
      thread_id: t.thread_id,
      linked_type: t.linked_type,
      linked_id: t.linked_id,
      resident_id: t.resident_id,
      resident_name: t.resident_name,
      last_message_at: t.last_message_at,
      unread_count: t.unread_count,
      created_at: t.created_at instanceof Date ? t.created_at.toISOString() : String(t.created_at),
    }));
  },

  async getThreadMessages(threadId: number) {
    const thread = await messageRepository.findThreadById(threadId);
    if (!thread) throw new AppError(404, 'Thread not found');

    const messages = await messageRepository.findMessagesByThreadId(threadId);
    return {
      thread_id: thread.thread_id,
      linked_type: thread.linked_type,
      linked_id: thread.linked_id,
      resident_id: thread.resident_id,
      created_at: thread.created_at instanceof Date ? thread.created_at.toISOString() : String(thread.created_at),
      messages,
    };
  },

  async sendMessage(
    threadId: number,
    senderId: number,
    messageText: string | null,
    photoUrl: string | null
  ) {
    const thread = await messageRepository.findThreadById(threadId);
    if (!thread) throw new AppError(404, 'Thread not found');

    if (!messageText && !photoUrl) {
      throw new AppError(400, 'Message text or photo is required');
    }

    const messageId = await messageRepository.insertMessage(threadId, senderId, messageText, photoUrl);

    // Notify the resident about the new message
    await notificationService.create({
      recipient_id: thread.resident_id,
      type: 'new_message',
      linked_type: 'message_thread',
      linked_id: threadId,
      message_text: messageText
        ? `New message: "${messageText.length > 80 ? messageText.slice(0, 80) + '...' : messageText}"`
        : 'New message (photo)',
    });

    const messages = await messageRepository.findMessagesByThreadId(threadId);
    return messages.find((m) => m.message_id === messageId) ?? null;
  },

  async markRead(threadId: number, adminId: number) {
    const thread = await messageRepository.findThreadById(threadId);
    if (!thread) throw new AppError(404, 'Thread not found');
    await messageRepository.markThreadMessagesRead(threadId, adminId);
  },
};
