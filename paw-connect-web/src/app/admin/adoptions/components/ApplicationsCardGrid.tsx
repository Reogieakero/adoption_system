import React from 'react';
import type { AdoptionApplication, AdoptionStatus } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ApplicationActions } from './ApplicationActions';
import styles from './ApplicationsCardGrid.module.css';

interface ApplicationsCardGridProps {
  applications: AdoptionApplication[];
  onUpdateStatus: (id: number, newStatus: AdoptionStatus) => void;
  onViewDetails: (application: AdoptionApplication) => void;
}

export function ApplicationsCardGrid({ applications, onUpdateStatus, onViewDetails }: ApplicationsCardGridProps) {
  if (applications.length === 0) {
    return (
      <div className={styles.cardWorkspaceGrid}>
        <div className={`${styles.emptyStateContainer} ${styles.fullSpan}`}>
          <div className={styles.emptyStateMessage}>No records available matching this criteria.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardWorkspaceGrid}>
      {applications.map((app) => (
        <div key={app.application_id} className={styles.recordItemCard}>
          <div className={styles.recordCardTopRow}>
            <div className={styles.animalProfileCell}>
              <img src={app.pet_photo_url ?? ''} alt={app.pet_name} className={styles.animalAvatar} />
              <div>
                <div className={styles.primaryCellText}>{app.pet_name}</div>
                <div className={styles.secondaryCellText}>{app.application_id} • {app.pet_species.toLowerCase()}</div>
              </div>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className={styles.recordCardBody}>
            <div className={styles.cardDataField}>
              <span className={styles.cardDataLabel}>Applicant:</span>
              <span className={styles.primaryCellText}>{app.resident_name}</span>
            </div>
            <div className={`${styles.cardDataField} ${styles.mb05}`}>
              <span className={styles.cardDataLabel}>Email:</span>
              <span className={styles.secondaryCellText}>{app.resident_email}</span>
            </div>
            <div className={styles.cardDataField}>
              <span className={styles.cardDataLabel}>Submitted:</span>
              <span className={styles.primaryCellText}>{app.submitted_at}</span>
            </div>
            <div className={styles.cardDataField}>
              <span className={styles.cardDataLabel}>Assigned:</span>
              <span className={styles.secondaryCellText}>{'—'}</span>
            </div>
          </div>

          <div className={styles.recordCardFooter}>
            <ApplicationActions
              status={app.status}
              layout="stacked"
              onUpdateStatus={(newStatus) => onUpdateStatus(app.application_id, newStatus)}
              onViewDetails={() => onViewDetails(app)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
