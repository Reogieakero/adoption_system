import React from 'react';
import type { AdoptionApplication, StatusType } from '../types';
import { StatusBadge } from './StatusBadge';
import { ApplicationActions } from './ApplicationActions';
import styles from './ApplicationsCardGrid.module.css';

interface ApplicationsCardGridProps {
  applications: AdoptionApplication[];
  onUpdateStatus: (id: string, newStatus: StatusType) => void;
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
        <div key={app.id} className={styles.recordItemCard}>
          <div className={styles.recordCardTopRow}>
            <div className={styles.animalProfileCell}>
              <img src={app.animalPhoto} alt={app.animalName} className={styles.animalAvatar} />
              <div>
                <div className={styles.primaryCellText}>{app.animalName}</div>
                <div className={styles.secondaryCellText}>{app.id} â€¢ {app.species.toLowerCase()}</div>
              </div>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className={styles.recordCardBody}>
            <div className={styles.cardDataField}>
              <span className={styles.cardDataLabel}>Applicant:</span>
              <span className={styles.primaryCellText}>{app.applicantName}</span>
            </div>
            <div className={`${styles.cardDataField} ${styles.mb05}`}>
              <span className={styles.cardDataLabel}>Email:</span>
              <span className={styles.secondaryCellText}>{app.applicantEmail}</span>
            </div>
            <div className={styles.cardDataField}>
              <span className={styles.cardDataLabel}>Submitted:</span>
              <span className={styles.primaryCellText}>{app.applicationDate}</span>
            </div>
            <div className={styles.cardDataField}>
              <span className={styles.cardDataLabel}>Assigned:</span>
              <span className={styles.secondaryCellText}>{app.assignedStaff || 'â€”'}</span>
            </div>
          </div>

          <div className={styles.recordCardFooter}>
            <ApplicationActions
              status={app.status}
              layout="stacked"
              onUpdateStatus={(newStatus) => onUpdateStatus(app.id, newStatus)}
              onViewDetails={() => onViewDetails(app)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
