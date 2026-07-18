import React from 'react';
import styles from './CaseCard.module.css';
import type { RescueCase } from '@/types';

interface CaseCardProps {
  item: RescueCase;
  onView: (item: RescueCase) => void;
}

export default function CaseCard({ item, onView }: CaseCardProps) {
  const truncatedCondition = item.condition.length > 55
    ? `${item.condition.substring(0, 55)}...`
    : item.condition;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onView(item);
    }
  };

  return (
    <div
      className={styles.caseCard}
      onClick={() => onView(item)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.animalType} case ${item.id}`}
    >
      <div className={styles.cardAvatarHeader}>
        <div>
          <span className={styles.caseId}>{item.id}</span>
        </div>
        <div className={styles.cardAvatarFrame}>
          <img src={item.imageUrl} alt="" className={styles.cardInnerImage} />
        </div>
      </div>

      <div className={styles.cardContentBlock}>
        <div>
          <h3 className={styles.animalName}>{item.animalType}</h3>
          <p className={styles.cardBody}>{truncatedCondition}</p>
        </div>
      </div>
    </div>
  );
}
