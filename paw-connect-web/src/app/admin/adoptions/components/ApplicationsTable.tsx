import React from 'react';
import type { AdoptionApplication, AdoptionStatus } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ApplicationActions } from './ApplicationActions';
import styles from './ApplicationsTable.module.css';

interface ApplicationsTableProps {
  applications: AdoptionApplication[];
  onUpdateStatus: (id: string, newStatus: AdoptionStatus) => void;
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
            <th>Assigned handler</th>
            <th className={styles.textRight}>Management actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.id}>
                <td>
                  <div className={styles.primaryCellText}>{app.applicantName}</div>
                  <div className={styles.secondaryCellText}>{app.applicantEmail}</div>
                </td>
                <td>
                  <div className={styles.animalProfileCell}>
                    <img src={app.animalPhoto} alt={app.animalName} className={styles.animalAvatar} />
                    <div>
                      <div className={styles.primaryCellText}>{app.animalName}</div>
                      <div className={styles.secondaryCellText}>{app.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.speciesTag}>{app.species.toLowerCase()}</span>
                </td>
                <td className={`${styles.primaryCellText} ${styles.noWrap}`}>{app.applicationDate}</td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td className={styles.secondaryCellText}>{app.assignedStaff || 'â€”'}</td>
                <td>
                  {/* Fix: Centered flex container wrapper applied here */}
                  <div className={styles.actionsColumn}>
                    <ApplicationActions
                      status={app.status}
                      layout="row"
                      onUpdateStatus={(newStatus) => onUpdateStatus(app.id, newStatus)}
                      onViewDetails={() => onViewDetails(app)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.emptyStateContainer}>
                <div className={styles.emptyStateMessage}>No records available matching this criteria.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
