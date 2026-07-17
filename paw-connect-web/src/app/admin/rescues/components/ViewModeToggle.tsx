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
        Cards
      </Button>
      <Button
        variant="admin-ghost"
        active={viewMode === 'table'}
        onClick={() => onChange('table')}
      >
        Table
      </Button>
    </div>
  );
}

