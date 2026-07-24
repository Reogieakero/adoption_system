export interface ChatConversation {
  conversation_id: number;
  participant_ids: number[];
  last_message: {
    message_id: number;
    message_text: string;
    sender_id: number;
    sent_at: string;
  } | null;
  last_message_at: string | null;
  unread_count: number;
  other_user_name: string;
  created_at: string;
}

export interface ChatMessage {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  message_text: string;
  photo_url: string | null;
  is_read: boolean;
  sent_at: string;
}