import React from 'react';
import Button from '@/components/ui/button';
import styles from './ViewModeToggle.module.css';

export type ViewMode = 'cards' | 'table';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className={styles.toggleGroup}>
      <Button
        variant="admin-ghost"
        active={viewMode === 'cards'}
        onClick={() => onChange('cards')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Cards
      </Button>
      <Button
        variant="admin-ghost"
        active={viewMode === 'table'}
        onClick={() => onChange('table')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Table
      </Button>
    </div>
  );
}

