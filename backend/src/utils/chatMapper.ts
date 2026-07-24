import { ChatMessage } from '../types/chat.types';
import { MessageRow } from '../repositories/chat.repository';

export function mapMessageRow(row: MessageRow): ChatMessage {
  return {
    message_id: row.message_id,
    conversation_id: row.conversation_id,
    sender_id: row.sender_id,
    sender_name: row.sender_name,
    message_text: row.message_text,
    is_read: !!row.is_read,
    sent_at: String(row.sent_at),
  };
}