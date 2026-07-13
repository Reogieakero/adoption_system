import { AppError } from '../errors/AppError';
import { notificationRepository } from '../repositories/notification.repository';
import {
  CreateNotificationInput,
  Notification,
  NotificationListQuery,
  NotificationListResult,
} from '../types/notification.types';
import { rowToNotification } from '../utils/notificationMapper';

const VALID_TYPES = [
  'adoption_application',
  'rescue_case',
  'message',
  'health_alert',
  'user_registration',
  'system',
];
const VALID_PRIORITIES = ['low', 'normal', 'high', 'urgent'];

function validateListQuery(query: NotificationListQuery): void {
  if (query.type && !VALID_TYPES.includes(query.type)) {
    throw new AppError(400, `Invalid notification type "${query.type}"`);
  }
}

function validateCreateInput(input: CreateNotificationInput): void {
  if (!input.type || !VALID_TYPES.includes(input.type)) {
    throw new AppError(400, `Invalid notification type "${input.type}"`);
  }
  if (!input.title || !input.message) {
    throw new AppError(400, 'Fields "title" and "message" are required');
  }
  if (input.priority && !VALID_PRIORITIES.includes(input.priority)) {
    throw new AppError(400, `Invalid priority "${input.priority}"`);
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

  /**
   * Called internally by other services (adoption, rescue, message, health)
   * whenever an event happens that admins should be notified about.
   * See trigger_examples.md for how to wire this in.
   */
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