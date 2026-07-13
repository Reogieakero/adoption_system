import React from 'react';
import type { StatusType } from '../types';
import styles from './SummaryCards.module.css';

interface SummaryCardsProps {
  counts: Record<StatusType, number>;
  activeTab: StatusType;
  onSelect: (status: StatusType) => void;
}

const STATUS_ORDER: StatusType[] = ['Pending', 'Under Review', 'Approved', 'Adopted', 'Rejected'];

const DISPLAY_LABELS: Record<StatusType, string> = {
  Pending: 'Pending requests',
  'Under Review': 'Under review',
  Approved: 'Approved applications',
  Adopted: 'Adopted animals',
  Rejected: 'Rejected cases',
};

const DISPLAY_ICONS: Record<StatusType, string> = {
  Pending: '↵',
  'Under Review': '⚏',
  Approved: '✓',
  Adopted: '♥',
  Rejected: '✕',
};

const COLOR_CLASS: Record<StatusType, string> = {
  Pending: 'badgePending',
  'Under Review': 'badgeReview',
  Approved: 'badgeApproved',
  Adopted: 'badgeAdopted',
  Rejected: 'badgeRejected',
};

export function SummaryCards({ counts, activeTab, onSelect }: SummaryCardsProps) {
  return (
    <section className={styles.summaryGrid}>
      {STATUS_ORDER.map((statusKey) => (
        <div
          key={statusKey}
          className={`${styles.card} ${activeTab === statusKey ? styles.cardActive : ''}`}
          onClick={() => onSelect(statusKey)}
        >
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardLabel}>{DISPLAY_LABELS[statusKey]}</span>
            <span className={`${styles.iconBadge} ${styles[COLOR_CLASS[statusKey]]}`}>
              {DISPLAY_ICONS[statusKey]}
            </span>
          </div>
          <div className={styles.cardMetric}>{counts[statusKey]}</div>
        </div>
      ))}
    </section>
  );
}
