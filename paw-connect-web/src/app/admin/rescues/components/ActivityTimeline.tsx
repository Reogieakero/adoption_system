import React from 'react';
import styles from './ActivityTimeline.module.css';

interface TimelineStep {
  title: string;
  timestamp: string;
  active: boolean;
}

interface ActivityTimelineProps {
  steps: TimelineStep[];
}

export default function ActivityTimeline({ steps }: ActivityTimelineProps) {
  return (
    <div className={styles.timelineContainer}>
      {steps.map((step) => (
        <div key={step.title} className={styles.timelineNode}>
          <div className={`${styles.timelineMarker} ${step.active ? styles.timelineMarkerActive : ''}`} />
          <div className={styles.timelineContent}>
            <span className={styles.timelineStepTitle}>{step.title}</span>
            <span className={styles.timelineTimestamp}>{step.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

