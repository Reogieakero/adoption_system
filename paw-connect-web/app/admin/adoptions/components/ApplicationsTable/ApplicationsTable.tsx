import React from 'react';
import type { AdoptionApplication, StatusType } from '../../types';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { ApplicationActions } from '../ApplicationActions/ApplicationActions';
import styles from './ApplicationsTable.module.css';

interface ApplicationsTableProps {
  applications: AdoptionApplication[];
  onUpdateStatus: (id: string, newStatus: StatusType) => void;
}

export function ApplicationsTable({ applications, onUpdateStatus }: ApplicationsTableProps) {
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
            <th style={{ textAlign: 'right' }}>Management actions</th>
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
                <td className={styles.primaryCellText} style={{ whiteSpace: 'nowrap' }}>{app.applicationDate}</td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td className={styles.secondaryCellText}>{app.assignedStaff || '—'}</td>
                <td>
                  <ApplicationActions
                    status={app.status}
                    layout="row"
                    onUpdateStatus={(newStatus) => onUpdateStatus(app.id, newStatus)}
                  />
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
