import React from 'react';
import styles from './TabsBar.module.css';

const TABS = ['All', 'Unread', 'Adoption', 'Rescue', 'General'];

interface TabsBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function TabsBar({ activeTab, onChange }: TabsBarProps) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsTrack}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
