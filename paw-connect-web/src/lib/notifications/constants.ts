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
  adoption_status: 'Adoption',
  report_status: 'Report',
  new_message: 'Message',
  new_report: 'Report',
  new_community_listing: 'Listing',
  new_application: 'Application',
};

export const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  adoption_status: PawPrint,
  report_status: AlertTriangle,
  new_message: MessageSquare,
  new_report: HeartPulse,
  new_community_listing: UserPlus,
  new_application: Settings,
};

export const NOTIFICATION_TABS = [
  { key: 'all' as const, label: 'All' },
  { key: 'unread' as const, label: 'Unread' },
  { key: 'adoption_status' as const, label: 'Adoptions' },
  { key: 'new_application' as const, label: 'Applications' },
  { key: 'new_message' as const, label: 'Messages' },
  { key: 'new_report' as const, label: 'Reports' },
  { key: 'new_community_listing' as const, label: 'Listings' },
] as const;
