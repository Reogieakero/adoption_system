import { AppError } from '../errors/AppError';
import { notificationRepository } from '../repositories/notification.repository';
import {
  CreateNotificationInput,
  Notification,
  NotificationListQuery,
  NotificationListResult,
  NotificationType,
} from '../types/notification.types';
import { rowToNotification } from '../utils/notificationMapper';

const VALID_TYPES: NotificationType[] = [
  'adoption_status', 'report_status', 'new_message',
  'new_report', 'new_community_listing', 'new_application',
];

function validateListQuery(query: NotificationListQuery): void {
  if (query.type && !VALID_TYPES.includes(query.type)) {
    throw new AppError(400, `Invalid notification type "${query.type}"`);
  }
}

function validateCreateInput(input: CreateNotificationInput): void {
  if (!input.type || !VALID_TYPES.includes(input.type)) {
    throw new AppError(400, `Invalid notification type "${input.type}"`);
  }
  if (!input.message_text) {
    throw new AppError(400, 'Field "message_text" is required');
  }
  if (!input.recipient_id) {
    throw new AppError(400, 'Field "recipient_id" is required');
  }
}

export const notificationService = {
  async list(query: NotificationListQuery): Promise<NotificationListResult> {
    validateListQuery(query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [{ rows, total }, unreadCount] = await Promise.all([
      notificationRepository.findAll({ ...query, page, limit }),
      notificationRepository.countUnread(),
    ]);

    return {
      notifications: rows.map(rowToNotification),
      total,
      unreadCount,
      page,
      limit,
    };
  },

  async getUnreadCount(): Promise<number> {
    return notificationRepository.countUnread();
  },

  async create(input: CreateNotificationInput): Promise<Notification> {
    validateCreateInput(input);
    const id = await notificationRepository.create(input);
    const row = await notificationRepository.findById(id);
    if (!row) {
      throw new AppError(500, 'Failed to create notification');
    }
    return rowToNotification(row);
  },

  async markAsRead(id: number): Promise<Notification> {
    const existing = await notificationRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Notification not found');
    }
    await notificationRepository.markAsRead(id);
    const updated = await notificationRepository.findById(id);
    return rowToNotification(updated!);
  },

  async markAllAsRead(): Promise<number> {
    return notificationRepository.markAllAsRead();
  },

  async remove(id: number): Promise<void> {
    const deleted = await notificationRepository.delete(id);
    if (!deleted) {
      throw new AppError(404, 'Notification not found');
    }
  },
};
