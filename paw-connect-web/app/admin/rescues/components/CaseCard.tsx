import React from 'react';
import styles from './CaseCard.module.css';
import { RescueCase } from '../types';

interface CaseCardProps {
  item: RescueCase;
  onView: (item: RescueCase) => void;
}

export default function CaseCard({ item, onView }: CaseCardProps) {
  const truncatedCondition = item.condition.length > 55
    ? `${item.condition.substring(0, 55)}...`
    : item.condition;

  return (
    <div className={styles.caseCard}>
      <div className={styles.cardBlobBottomLeft} />

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

        <div className={styles.cardFooterRow}>
          <button
            type="button"
            className={styles.viewDetailsTrigger}
            onClick={() => onView(item)}
            aria-label="Inspect comprehensive dashboard details panel"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
