import { messageRepository } from '../repositories/message.repository';
import { notificationService } from './notification.service';
import { ThreadLinkedType } from '../types/message.types';
import { getIO } from '../socket';
import { AppError } from '../errors/AppError';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

async function validateCaseOwnership(
  linkedType: ThreadLinkedType,
  linkedId: number,
  residentId: number
): Promise<void> {
  if (linkedType === 'adoption_application') {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT resident_id FROM adoption_applications WHERE application_id = ?',
      [linkedId]
    );
    if (!rows[0]) throw new AppError(404, 'Adoption application not found');
    if (rows[0].resident_id !== residentId) throw new AppError(403, 'This adoption application does not belong to you');
  } else {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT resident_id FROM animal_reports WHERE report_id = ?',
      [linkedId]
    );
    if (!rows[0]) throw new AppError(404, 'Animal report not found');
    if (rows[0].resident_id !== residentId) throw new AppError(403, 'This animal report does not belong to you');
  }
}

async function getResidentIdForCase(linkedType: ThreadLinkedType, linkedId: number): Promise<number> {
  if (linkedType === 'adoption_application') {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT resident_id FROM adoption_applications WHERE application_id = ?',
      [linkedId]
    );
    if (!rows[0]) throw new AppError(404, 'Adoption application not found');
    return rows[0].resident_id;
  } else {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT resident_id FROM animal_reports WHERE report_id = ?',
      [linkedId]
    );
    if (!rows[0]) throw new AppError(404, 'Animal report not found');
    return rows[0].resident_id;
  }
}

export const messageService = {
  async listThreads(userId: number, isAdmin: boolean) {
    const threads = isAdmin
      ? await messageRepository.findAllThreadsForAdmin()
      : await messageRepository.findThreadsForResident(userId);

    return threads.map((t) => ({
      thread_id: t.thread_id,
      linked_type: t.linked_type,
      linked_id: t.linked_id,
      resident_id: t.resident_id,
      resident_name: t.resident_name,
      last_message_at: t.last_message_at instanceof Date ? t.last_message_at.toISOString() : String(t.last_message_at),
      unread_count: t.unread_count,
      created_at: t.created_at instanceof Date ? t.created_at.toISOString() : String(t.created_at),
    }));
  },

  async getThreadByLinkedEntity(linkedType: ThreadLinkedType, linkedId: number, userId: number, isAdmin: boolean) {
    if (!isAdmin) {
      await validateCaseOwnership(linkedType, linkedId, userId);
    }

    const thread = await messageRepository.findThreadByLinkedEntity(linkedType, linkedId);
    if (!thread) {
      return { thread: null, messages: [] };
    }

    if (!isAdmin && thread.resident_id !== userId) {
      throw new AppError(403, 'Access denied');
    }

    const messages = await messageRepository.findMessagesByThreadId(thread.thread_id);
    return {
      thread: {
        thread_id: thread.thread_id,
        linked_type: thread.linked_type,
        linked_id: thread.linked_id,
        resident_id: thread.resident_id,
        created_at: thread.created_at instanceof Date ? thread.created_at.toISOString() : String(thread.created_at),
      },
      messages,
    };
  },

  async getThreadMessages(threadId: number, userId: number, isAdmin: boolean) {
    const thread = await messageRepository.findThreadById(threadId);
    if (!thread) throw new AppError(404, 'Thread not found');

    if (!isAdmin && thread.resident_id !== userId) {
      throw new AppError(403, 'Access denied');
    }

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
    linkedType: ThreadLinkedType,
    linkedId: number,
    senderId: number,
    senderRole: 'admin' | 'resident',
    messageText: string | null,
    photoUrl: string | null
  ) {
    if (!messageText && !photoUrl) {
      throw new AppError(400, 'Message text or photo is required');
    }

    const residentId = await getResidentIdForCase(linkedType, linkedId);

    if (senderRole === 'resident' && residentId !== senderId) {
      throw new AppError(403, 'This case does not belong to you');
    }

    let thread = await messageRepository.findThreadByLinkedEntity(linkedType, linkedId);
    let isNewThread = false;

    if (!thread) {
      const threadId = await messageRepository.createThread(linkedType, linkedId, residentId);
      thread = await messageRepository.findThreadById(threadId);
      if (!thread) throw new AppError(500, 'Failed to create thread');
      isNewThread = true;
    }

    const messageId = await messageRepository.insertMessage(thread.thread_id, senderId, messageText, photoUrl);
    const messages = await messageRepository.findMessagesByThreadId(thread.thread_id);
    const newMessage = messages.find((m) => m.message_id === messageId);
    if (!newMessage) throw new AppError(500, 'Failed to create message');

    // Determine recipient
    const recipientId = senderRole === 'admin' ? residentId : undefined; // admin is the other party

    // Real-time emit
    try {
      const io = getIO();
      const payload = {
        message_id: newMessage.message_id,
        thread_id: newMessage.thread_id,
        sender_id: newMessage.sender_id,
        sender_name: newMessage.sender_name,
        message_text: newMessage.message_text,
        photo_url: newMessage.photo_url,
        is_read: newMessage.is_read,
        sent_at: newMessage.sent_at,
        linked_type: linkedType,
        linked_id: linkedId,
      };

      if (senderRole === 'admin') {
        io.to(`user-${residentId}`).emit('message:new', payload);
      } else {
        io.to('admin').emit('message:new', payload);
      }
    } catch { }

    // Trigger notification
    if (senderRole === 'admin') {
      await notificationService.create({
        recipient_id: residentId,
        type: 'new_message',
        linked_type: 'message_thread',
        linked_id: thread.thread_id,
        message_text: messageText
          ? `New message: "${messageText.length > 80 ? messageText.slice(0, 80) + '...' : messageText}"`
          : 'New message (photo)',
      });
    }

    return {
      ...newMessage,
      is_new_thread: isNewThread,
    };
  },

  async markRead(threadId: number, userId: number) {
    const thread = await messageRepository.findThreadById(threadId);
    if (!thread) throw new AppError(404, 'Thread not found');
    await messageRepository.markThreadMessagesRead(threadId, userId);
  },

  async getUnreadCount(userId: number) {
    return messageRepository.getUnreadCountForUser(userId);
  },
};
