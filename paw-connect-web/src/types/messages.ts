export type ThreadLinkedType = 'adoption_application' | 'animal_report';

export interface MessageThread {
  thread_id: number;
  linked_type: ThreadLinkedType;
  linked_id: number;
  resident_id: number;
  created_at: string;
}

export interface Message {
  message_id: number;
  thread_id: number;
  sender_id: number;
  sender_name: string;
  message_text: string | null;
  photo_url: string | null;
  is_read: boolean;
  sent_at: string;
}

export interface Conversation {
  thread_id: number;
  linked_type: ThreadLinkedType;
  linked_id: number;
  resident_id: number;
  resident_name: string;
  messages: Message[];
  created_at: string;
}
