import React from 'react';
import { Clock, Check, Heart, X } from 'lucide-react';
import type { AdoptionStatus as StatusType } from '@/types';
import styles from './SummaryCards.module.css';

interface SummaryCardsProps {
  counts: Record<StatusType, number>;
  activeTab: StatusType;
  onSelect: (status: StatusType) => void;
}

const STATUS_ORDER: StatusType[] = ['pending_review', 'approved', 'rejected', 'pet_unavailable'];

const DISPLAY_LABELS: Record<StatusType, string> = {
  pending_review: 'Pending requests',
  approved: 'Approved applications',
  rejected: 'Rejected cases',
  pet_unavailable: 'Adopted',
};

const DISPLAY_ICONS: Record<StatusType, React.ReactNode> = {
  pending_review: <Clock size={14} />,
  approved: <Check size={14} />,
  rejected: <X size={14} />,
  pet_unavailable: <Heart size={14} />,
};

const COLOR_CLASS: Record<StatusType, string> = {
  pending_review: 'badgePending',
  approved: 'badgeApproved',
  rejected: 'badgeRejected',
  pet_unavailable: 'badgeAdopted',
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
