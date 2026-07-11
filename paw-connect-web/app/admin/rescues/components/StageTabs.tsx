import React from 'react';
import styles from './StageTabs.module.css';
import { RescueStage } from '../types';

interface StageTabsProps {
  stages: RescueStage[];
  counts: Record<RescueStage, number>;
  activeStage: RescueStage;
  onChange: (stage: RescueStage) => void;
}

export default function StageTabs({ stages, counts, activeStage, onChange }: StageTabsProps) {
  return (
    <div className={styles.tabBar}>
      {stages.map((stage) => (
        <button
          key={stage}
          type="button"
          className={`${styles.tabButton} ${activeStage === stage ? styles.tabButtonActive : ''}`}
          onClick={() => onChange(stage)}
        >
          {stage}
          <span className={styles.tabCount}>{counts[stage]}</span>
        </button>
      ))}
    </div>
  );
}
