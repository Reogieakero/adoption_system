import React from 'react';
import Button from '@/components/ui/button';
import styles from './TabsBar.module.css';

const TABS = ['All', 'Unread', 'Adoption', 'Report'];

interface TabsBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function TabsBar({ activeTab, onChange }: TabsBarProps) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsTrack}>
        {TABS.map(tab => (
          <Button
            key={tab}
            variant="admin-ghost"
            active={activeTab === tab}
            onClick={() => onChange(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
    </div>
  );
}
