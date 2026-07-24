import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { MessageThreadRow, MessageWithSenderRow, rowToMessage, ThreadDetailRow } from '../utils/messageMapper';
import { ThreadLinkedType } from '../types/message.types';

export async function findThreadById(threadId: number): Promise<MessageThreadRow | null> {
  const [rows] = await pool.query<MessageThreadRow[]>(
    'SELECT * FROM message_threads WHERE thread_id = ?',
    [threadId]
  );
  return rows[0] ?? null;
}

export async function findThreadByLinkedEntity(
  linkedType: ThreadLinkedType,
  linkedId: number
): Promise<MessageThreadRow | null> {
  const [rows] = await pool.query<MessageThreadRow[]>(
    'SELECT * FROM message_threads WHERE linked_type = ? AND linked_id = ?',
    [linkedType, linkedId]
  );
  return rows[0] ?? null;
}

export async function findMessagesByThreadId(threadId: number): Promise<ReturnType<typeof rowToMessage>[]> {
  const [rows] = await pool.query<MessageWithSenderRow[]>(
    `SELECT m.*, u.full_name AS sender_name
     FROM messages m
     JOIN users u ON u.user_id = m.sender_id
     WHERE m.thread_id = ?
     ORDER BY m.sent_at ASC`,
    [threadId]
  );
  return rows.map(rowToMessage);
}

export async function findThreadsForResident(residentId: number): Promise<ThreadDetailRow[]> {
  const [rows] = await pool.query<ThreadDetailRow[]>(
    `SELECT mt.*, u.full_name AS resident_name,
            COALESCE(lm.last_message_at, mt.created_at) AS last_message_at,
            COALESCE(uc.unread_count, 0) AS unread_count
     FROM message_threads mt
     JOIN users u ON u.user_id = mt.resident_id
     LEFT JOIN (
       SELECT thread_id, MAX(sent_at) AS last_message_at
       FROM messages GROUP BY thread_id
     ) lm ON lm.thread_id = mt.thread_id
     LEFT JOIN (
       SELECT thread_id, COUNT(*) AS unread_count
       FROM messages WHERE is_read = 0 AND sender_id != ?
       GROUP BY thread_id
     ) uc ON uc.thread_id = mt.thread_id
     WHERE mt.resident_id = ?
     ORDER BY last_message_at DESC`,
    [residentId, residentId]
  );
  return rows;
}

export async function findAllThreadsForAdmin(): Promise<ThreadDetailRow[]> {
  const [rows] = await pool.query<ThreadDetailRow[]>(
    `SELECT mt.*, u.full_name AS resident_name,
            COALESCE(lm.last_message_at, mt.created_at) AS last_message_at,
            COALESCE(uc.unread_count, 0) AS unread_count
     FROM message_threads mt
     JOIN users u ON u.user_id = mt.resident_id
     LEFT JOIN (
       SELECT thread_id, MAX(sent_at) AS last_message_at
       FROM messages GROUP BY thread_id
     ) lm ON lm.thread_id = mt.thread_id
     LEFT JOIN (
       SELECT thread_id, COUNT(*) AS unread_count
       FROM messages WHERE is_read = 0
       GROUP BY thread_id
     ) uc ON uc.thread_id = mt.thread_id
     ORDER BY last_message_at DESC`
  );
  return rows;
}

export async function createThread(
  linkedType: ThreadLinkedType,
  linkedId: number,
  residentId: number
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO message_threads (linked_type, linked_id, resident_id) VALUES (?, ?, ?)',
    [linkedType, linkedId, residentId]
  );
  return result.insertId;
}

export async function insertMessage(
  threadId: number,
  senderId: number,
  messageText: string | null,
  photoUrl: string | null
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO messages (thread_id, sender_id, message_text, photo_url) VALUES (?, ?, ?, ?)',
    [threadId, senderId, messageText, photoUrl]
  );
  return result.insertId;
}

export async function markThreadMessagesRead(threadId: number, userId: number): Promise<void> {
  await pool.query(
    'UPDATE messages SET is_read = 1 WHERE thread_id = ? AND sender_id != ? AND is_read = 0',
    [threadId, userId]
  );
}

export async function getUnreadCountForUser(userId: number): Promise<number> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM messages m
     JOIN message_threads mt ON mt.thread_id = m.thread_id
     WHERE m.is_read = 0 AND m.sender_id != ? AND mt.resident_id = ?`,
    [userId, userId]
  );
  return Number(rows[0].total);
}

export const messageRepository = {
  findThreadById,
  findThreadByLinkedEntity,
  findMessagesByThreadId,
  findThreadsForResident,
  findAllThreadsForAdmin,
  createThread,
  insertMessage,
  markThreadMessagesRead,
  getUnreadCountForUser,
};
