import React from 'react';
import Button from '@/components/ui/button';
import styles from './StageTabs.module.css';
import type { RescueStage } from '@/types';

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
        <Button
          key={stage}
          variant="admin-ghost"
          active={activeStage === stage}
          onClick={() => onChange(stage)}
        >
          {stage}
          <span className={styles.tabCount}>{counts[stage]}</span>
        </Button>
      ))}
    </div>
  );
}

