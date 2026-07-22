export type NotificationType = 'adoption_status' | 'report_status' | 'new_message' | 'new_report' | 'new_community_listing' | 'new_application';
export type NotificationLinkedType = 'adoption_application' | 'animal_report' | 'pet' | 'message_thread';

export interface Notification {
  notification_id: number;
  recipient_id: number;
  type: NotificationType;
  linked_type: NotificationLinkedType | null;
  linked_id: number | null;
  message_text: string;
  is_read: boolean;
  is_emailed: boolean;
  emailed_at: string | null;
  created_at: string;
}

export interface CreateNotificationInput {
  recipient_id: number;
  type: NotificationType;
  linked_type?: NotificationLinkedType | null;
  linked_id?: number | null;
  message_text: string;
  is_emailed?: boolean;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
  recipient_id?: number;
}

export interface NotificationListResult {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}
