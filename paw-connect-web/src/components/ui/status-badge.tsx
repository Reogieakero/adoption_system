import React from 'react';
import { formatStatus } from '@/lib/format-status';
import styles from './status-badge.module.css';

interface StatusBadgeProps {
  status: string;
  variant?: 'adoption' | 'user';
  className?: string;
}

const ADOPTION_CLASSES: Record<string, string> = {
  pending_review: 'badgePending',
  approved: 'badgeApproved',
  rejected: 'badgeRejected',
  pet_unavailable: 'badgeAdopted',
};

const USER_CLASSES: Record<string, string> = {
  active: 'statusActive',
  pending_verification: 'statusPending',
  suspended: 'statusSuspended',
};

export function StatusBadge({ status, variant = 'adoption', className }: StatusBadgeProps) {
  const classMap = variant === 'user' ? USER_CLASSES : ADOPTION_CLASSES;
  const statusClass = styles[classMap[status] ?? 'badgePending'];

  return (
    <span className={`${variant === 'user' ? styles.badgeStatus : styles.statusBadge} ${statusClass} ${className ?? ''}`}>
      {formatStatus(status)}
    </span>
  );
}
