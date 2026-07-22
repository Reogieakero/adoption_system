import React from 'react';
import type { AdoptionApplication, AdoptionStatus } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ApplicationActions } from './ApplicationActions';
import styles from './ApplicationsTable.module.css';

interface ApplicationsTableProps {
  applications: AdoptionApplication[];
  onUpdateStatus: (id: number, newStatus: AdoptionStatus) => void;
  onViewDetails: (application: AdoptionApplication) => void;
}

export function ApplicationsTable({ applications, onUpdateStatus, onViewDetails }: ApplicationsTableProps) {
  return (
    <div className={styles.tableResponsiveWrapper}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Applicant details</th>
            <th>Animal target</th>
            <th>Species</th>
            <th>Application date</th>
            <th>Status</th>
            <th className={styles.textRight}>Management actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.application_id}>
                <td>
                  <div className={styles.primaryCellText}>{app.resident_name}</div>
                  <div className={styles.secondaryCellText}>{app.resident_email}</div>
                </td>
                <td>
                  <div className={styles.animalProfileCell}>
                    <img src={app.pet_photo_url ?? ''} alt={app.pet_name} className={styles.animalAvatar} />
                    <div>
                      <div className={styles.primaryCellText}>{app.pet_name}</div>
                      <div className={styles.secondaryCellText}>{app.application_id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.speciesTag}>{app.pet_species.toLowerCase()}</span>
                </td>
                <td className={`${styles.primaryCellText} ${styles.noWrap}`}>{app.submitted_at}</td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td>
                  {/* Fix: Centered flex container wrapper applied here */}
                  <div className={styles.actionsColumn}>
                    <ApplicationActions
                      status={app.status}
                      layout="row"
                      onUpdateStatus={(newStatus) => onUpdateStatus(app.application_id, newStatus)}
                      onViewDetails={() => onViewDetails(app)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.emptyStateContainer}>
                <div className={styles.emptyStateMessage}>No records available matching this criteria.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
