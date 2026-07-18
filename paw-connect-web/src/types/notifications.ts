export type NotificationType =
  | 'adoption_application'
  | 'rescue_case'
  | 'message'
  | 'health_alert'
  | 'user_registration'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  entityType: string | null;
  entityId: number | null;
  priority: NotificationPriority;
  isRead: boolean;
  readAt: string | null;
  createdBy: number | null;
  link: string | null;
  createdAt: string;
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
