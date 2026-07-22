export type NotificationType = 'adoption_status' | 'report_status' | 'new_message' | 'new_report' | 'new_community_listing' | 'new_application';
export type NotificationLinkedType = 'adoption_application' | 'animal_report' | 'pet' | 'message_thread';

export interface AppNotification {
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

export interface NotificationListParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
}

export interface NotificationListResponse {
  success: true;
  notifications: AppNotification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}
