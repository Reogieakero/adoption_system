export type NotificationType =
  | 'adoption_application'
  | 'rescue_case'
  | 'message'
  | 'health_alert'
  | 'user_registration'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
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

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: number;
  priority?: NotificationPriority;
  createdBy?: number;
  link?: string;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
}

export interface NotificationListResult {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}