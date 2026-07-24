import React from 'react';
import { FileText, ClipboardCheck, Send, Heart } from 'lucide-react';
import styles from './StageTabs.module.css';
import type { RescueStage } from '@/types';

interface StageTabsProps {
  stages: RescueStage[];
  counts: Record<string, number>;
  activeStage: RescueStage;
  onChange: (stage: RescueStage) => void;
  labels?: Record<string, string>;
}

const STAGE_ICONS: Record<string, React.ReactNode> = {
  submitted: <FileText size={14} />,
  in_progress: <ClipboardCheck size={14} />,
  dispatched: <Send size={14} />,
  resolved: <Heart size={14} />,
};

export default function StageTabs({ stages, counts, activeStage, onChange, labels }: StageTabsProps) {
  return (
    <div className={styles.tabBar}>
      {stages.map((stage) => (
        <button
          key={stage}
          className={`${styles.tab} ${activeStage === stage ? styles.tabActive : ''}`}
          onClick={() => onChange(stage)}
        >
          <span className={styles.tabIcon}>{STAGE_ICONS[stage]}</span>
          <span className={styles.tabLabel}>{labels?.[stage] ?? stage.replace('_', ' ')}</span>
          <span className={styles.tabCount}>{counts[stage]}</span>
        </button>
      ))}
    </div>
  );
}

