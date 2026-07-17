import React from 'react';
import type { StatusType } from '../types';
import Button from '@/components/ui/button';
import styles from './StatusTabs.module.css';

interface StatusTabsProps {
  counts: Record<StatusType, number>;
  activeTab: StatusType;
  onChange: (tab: StatusType) => void;
}

const TAB_ORDER: StatusType[] = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Adopted'];

const TAB_LABELS: Record<StatusType, string> = {
  Pending: 'Pending',
  'Under Review': 'Under review',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Adopted: 'Adopted',
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

