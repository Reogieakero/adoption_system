import type { NotificationType } from '@/types';
import {
  PawPrint,
  AlertTriangle,
  MessageSquare,
  HeartPulse,
  UserPlus,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export const TYPE_LABELS: Record<NotificationType, string> = {
  adoption_application: 'Adoption',
  rescue_case: 'Rescue',
  message: 'Message',
  health_alert: 'Health',
  user_registration: 'New User',
  system: 'System',
};

export const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  adoption_application: PawPrint,
  rescue_case: AlertTriangle,
  message: MessageSquare,
  health_alert: HeartPulse,
  user_registration: UserPlus,
  system: Settings,
};

export const NOTIFICATION_TABS = [
  { key: 'all' as const, label: 'All' },
  { key: 'unread' as const, label: 'Unread' },
  { key: 'adoption_application' as const, label: 'Adoptions' },
  { key: 'rescue_case' as const, label: 'Rescues' },
  { key: 'message' as const, label: 'Messages' },
  { key: 'health_alert' as const, label: 'Health' },
  { key: 'system' as const, label: 'System' },
] as const;
