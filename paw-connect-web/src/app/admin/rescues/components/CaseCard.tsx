import React from 'react';
import { Eye, Check, Send, Heart, X } from 'lucide-react';
import Button from '@/components/ui/button';
import styles from './CaseCard.module.css';
import type { AnimalReport } from '@/types';

interface CaseCardProps {
  item: AnimalReport;
  onView: (item: AnimalReport) => void;
  onAction?: (item: AnimalReport, actionId: string) => void;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  verify: <Check size={14} />,
  dispatch: <Send size={14} />,
  rescue: <Heart size={14} />,
  close: <X size={14} />,
};

const ACTION_IDS_BY_STATUS: Record<string, string[]> = {
  submitted: ['verify'],
  in_progress: ['dispatch'],
  dispatched: ['rescue'],
  resolved: ['close'],
};

export default function CaseCard({ item, onView, onAction }: CaseCardProps) {
  const truncatedCondition = item.condition_description.length > 55
    ? `${item.condition_description.substring(0, 55)}...`
    : item.condition_description;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onView(item);
    }
  };

  return (
    <div
      className={styles.caseCard}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.cardAvatarHeader}>
        <div>
          <span className={styles.caseId}>{item.report_id}</span>
        </div>
        <div className={styles.cardAvatarFrame}>
          <img src={item.photo_url} alt="" className={styles.cardInnerImage} />
        </div>
      </div>

      <div className={styles.cardContentBlock}>
        <h3 className={styles.animalName}>{item.species}</h3>
        <p className={styles.cardBody}>{truncatedCondition}</p>
      </div>

      <div className={styles.cardActions}>
        <Button variant="admin-ghost" square onClick={() => onView(item)} title="View Details">
          <Eye size={14} />
        </Button>
        {onAction && ACTION_IDS_BY_STATUS[item.status]?.map((actionId) => (
          <Button
            key={actionId}
            variant="admin-ghost"
            square
            onClick={() => onAction(item, actionId)}
            title={actionId.charAt(0).toUpperCase() + actionId.slice(1)}
          >
            {ACTION_ICONS[actionId]}
          </Button>
        ))}
      </div>
    </div>
  );
}
