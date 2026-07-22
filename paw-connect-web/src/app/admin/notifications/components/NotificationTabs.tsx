'use client';

import Button from '@/components/ui/button';
import styles from './NotificationTabs.module.css';

export interface Tab {
  key: string;
  label: string;
}

interface NotificationTabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function NotificationTabs({ tabs, activeKey, onChange }: NotificationTabsProps) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant="admin-ghost"
          active={activeKey === tab.key}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
