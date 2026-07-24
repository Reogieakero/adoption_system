import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface ConversationRow extends RowDataPacket {
  conversation_id: number;
  participant_ids: string;
  created_at: string;
}

export interface MessageRow extends RowDataPacket {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  message_text: string;
  photo_url: string | null;
  is_read: number;
  sent_at: string;
}

export interface ConversationSummaryRow extends RowDataPacket {
  conversation_id: number;
  participant_ids: string;
  created_at: string;
  last_message_id: number | null;
  last_message_text: string | null;
  last_message_at: string | null;
  last_sender_id: number | null;
  unread_count: number;
}

export const chatRepository = {
  async findOrCreateConversation(userId1: number, userId2: number): Promise<number> {
    const ids = [userId1, userId2].sort((a, b) => a - b);
    const key = JSON.stringify(ids);

    const [existing] = await pool.execute<ConversationRow[]>(
      `SELECT conversation_id FROM chat_conversations WHERE participant_ids = CAST(? AS JSON) LIMIT 1`,
      [key]
    );

    if (existing.length > 0) return existing[0].conversation_id;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO chat_conversations (participant_ids) VALUES (?)`,
      [key]
    );

    return result.insertId;
  },

  async getConversationsForUser(userId: number): Promise<ConversationSummaryRow[]> {
    const [rows] = await pool.execute<ConversationSummaryRow[]>(
      `SELECT
        c.conversation_id,
        c.participant_ids,
        c.created_at,
        cm.message_id AS last_message_id,
        cm.message_text AS last_message_text,
        cm.sent_at AS last_message_at,
        cm.sender_id AS last_sender_id,
        (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.conversation_id AND sender_id != ? AND is_read = FALSE) AS unread_count
      FROM chat_conversations c
      LEFT JOIN chat_messages cm ON cm.message_id = (
        SELECT MAX(m2.message_id) FROM chat_messages m2 WHERE m2.conversation_id = c.conversation_id
      )
      WHERE JSON_CONTAINS(c.participant_ids, CAST(? AS JSON))
      ORDER BY COALESCE(cm.sent_at, c.created_at) DESC`,
      [userId, userId]
    );

    return rows;
  },

  async getMessages(conversationId: number, limit: number = 50, offset: number = 0): Promise<MessageRow[]> {
    const [rows] = await pool.query<MessageRow[]>(
      `SELECT
        m.message_id,
        m.conversation_id,
        m.sender_id,
        u.full_name AS sender_name,
        m.message_text,
        m.photo_url,
        m.is_read,
        m.sent_at
      FROM chat_messages m
      JOIN users u ON u.user_id = m.sender_id
      WHERE m.conversation_id = ?
      ORDER BY m.sent_at DESC
      LIMIT ? OFFSET ?`,
      [conversationId, limit, offset]
    );

    return rows.reverse();
  },

  async createMessage(conversationId: number, senderId: number, text: string, photoUrl?: string | null): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO chat_messages (conversation_id, sender_id, message_text, photo_url) VALUES (?, ?, ?, ?)`,
      [conversationId, senderId, text, photoUrl || null]
    );

    return result.insertId;
  },

  async markConversationRead(conversationId: number, userId: number): Promise<void> {
    await pool.execute(
      `UPDATE chat_messages SET is_read = TRUE WHERE conversation_id = ? AND sender_id != ? AND is_read = FALSE`,
      [conversationId, userId]
    );
  },

  async getUnreadCount(userId: number): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS count
       FROM chat_messages m
       JOIN chat_conversations c ON c.conversation_id = m.conversation_id
       WHERE JSON_CONTAINS(c.participant_ids, CAST(? AS JSON))
         AND m.sender_id != ?
         AND m.is_read = FALSE`,
      [userId, userId]
    );
    return rows[0].count;
  },

  async getUserName(userId: number): Promise<string | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT full_name FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0]?.full_name ?? null;
  },
};
