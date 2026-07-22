import React from 'react';
import type { AdoptionStatus } from '@/types';
import Button from '@/components/ui/button';
import styles from './StatusTabs.module.css';

interface StatusTabsProps {
  counts: Record<AdoptionStatus, number>;
  activeTab: AdoptionStatus;
  onChange: (tab: AdoptionStatus) => void;
}

const TAB_ORDER: AdoptionStatus[] = ['pending_review', 'approved', 'rejected', 'pet_unavailable'];

const TAB_LABELS: Record<AdoptionStatus, string> = {
  pending_review: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
  pet_unavailable: 'Adopted',
};

export function StatusTabs({ counts, activeTab, onChange }: StatusTabsProps) {
  return (
    <nav className={styles.tabBar}>
      {TAB_ORDER.map((tab) => (
        <Button
          key={tab}
          variant="admin-ghost"
          active={activeTab === tab}
          onClick={() => onChange(tab)}
        >
          <span>{TAB_LABELS[tab]}</span>
          <span className={styles.tabCountBadge}>{counts[tab]}</span>
        </Button>
      ))}
    </nav>
  );
}

