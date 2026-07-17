import React from 'react';
import styles from './status-badge.module.css';

interface StatusBadgeProps {
  status: string;
  variant?: 'adoption' | 'user';
  className?: string;
}

const ADOPTION_CLASSES: Record<string, string> = {
  Pending: 'badgePending',
  'Under Review': 'badgeReview',
  Approved: 'badgeApproved',
  Adopted: 'badgeAdopted',
  Rejected: 'badgeRejected',
};

const USER_CLASSES: Record<string, string> = {
  Active: 'statusActive',
  Pending: 'statusPending',
  Suspended: 'statusSuspended',
};

export function StatusBadge({ status, variant = 'adoption', className }: StatusBadgeProps) {
  const classMap = variant === 'user' ? USER_CLASSES : ADOPTION_CLASSES;
  const statusClass = styles[classMap[status] ?? 'badgePending'];

  if (variant === 'user') {
    return (
      <span className={`${styles.badgeStatus} ${statusClass} ${className ?? ''}`}>
        {status}
      </span>
    );
  }

  return (
    <span className={`${styles.statusBadge} ${statusClass} ${className ?? ''}`}>
      {status.toLowerCase()}
    </span>
  );
}
