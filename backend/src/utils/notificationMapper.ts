import { RowDataPacket } from 'mysql2';
import { Notification, NotificationType, NotificationLinkedType } from '../types/notification.types';

export interface NotificationRow extends RowDataPacket {
  notification_id: number;
  recipient_id: number;
  type: string;
  linked_type: string | null;
  linked_id: number | null;
  message_text: string;
  is_read: number;
  is_emailed: number;
  emailed_at: string | null;
  created_at: string;
}

export function rowToNotification(row: NotificationRow): Notification {
  return {
    notification_id: row.notification_id,
    recipient_id: row.recipient_id,
    type: row.type as NotificationType,
    linked_type: row.linked_type as NotificationLinkedType | null,
    linked_id: row.linked_id,
    message_text: row.message_text,
    is_read: Boolean(row.is_read),
    is_emailed: Boolean(row.is_emailed),
    emailed_at: row.emailed_at,
    created_at: row.created_at,
  };
}
