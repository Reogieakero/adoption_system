import { RowDataPacket } from 'mysql2/promise';
import { MessageWithSender, ThreadLinkedType } from '../types/message.types';

export interface MessageThreadRow extends RowDataPacket {
  thread_id: number;
  linked_type: ThreadLinkedType;
  linked_id: number;
  resident_id: number;
  created_at: Date;
}

export interface MessageRow extends RowDataPacket {
  message_id: number;
  thread_id: number;
  sender_id: number;
  message_text: string | null;
  photo_url: string | null;
  is_read: number;
  sent_at: Date;
}

export interface MessageWithSenderRow extends MessageRow {
  sender_name: string;
}

export interface ThreadDetailRow extends MessageThreadRow {
  resident_name: string;
  last_message_at: Date;
  unread_count: number;
}

export function rowToMessage(row: MessageWithSenderRow): MessageWithSender {
  return {
    message_id: row.message_id,
    thread_id: row.thread_id,
    sender_id: row.sender_id,
    message_text: row.message_text,
    photo_url: row.photo_url,
    is_read: Boolean(row.is_read),
    sent_at: row.sent_at instanceof Date ? row.sent_at.toISOString() : String(row.sent_at),
    sender_name: row.sender_name,
  };
}
