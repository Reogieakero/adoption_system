import React from 'react';
import { FileText, ClipboardCheck, Send, Heart } from 'lucide-react';
import Button from '@/components/ui/button';
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
        <Button
          key={stage}
          variant="admin-ghost"
          active={activeStage === stage}
          onClick={() => onChange(stage)}
        >
          <span className={styles.tabIcon}>{STAGE_ICONS[stage]}</span>
          <span className={styles.tabCount}>{counts[stage]}</span>
        </Button>
      ))}
    </div>
  );
}

