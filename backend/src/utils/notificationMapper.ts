import { RowDataPacket } from 'mysql2';
import { Notification, NotificationPriority, NotificationType } from '../types/notification.types';

export interface NotificationRow extends RowDataPacket {
  id: number;
  type: string;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: number | null;
  priority: string;
  is_read: number;
  read_at: string | null;
  created_by: number | null;
  link: string | null;
  created_at: string;
}

export function rowToNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    type: row.type as NotificationType,
    title: row.title,
    message: row.message,
    entityType: row.entity_type,
    entityId: row.entity_id,
    priority: row.priority as NotificationPriority,
    isRead: Boolean(row.is_read),
    readAt: row.read_at,
    createdBy: row.created_by,
    link: row.link,
    createdAt: row.created_at,
  };
}