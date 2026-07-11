import React from 'react';
import type { StatusType } from '../../types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: StatusType;
}

const STATUS_CLASS_MAP: Record<StatusType, string> = {
  Pending: 'badgePending',
  'Under Review': 'badgeReview',
  Approved: 'badgeApproved',
  Adopted: 'badgeAdopted',
  Rejected: 'badgeRejected',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.statusBadge} ${styles[STATUS_CLASS_MAP[status]]}`}>
      {status.toLowerCase()}
    </span>
  );
}
