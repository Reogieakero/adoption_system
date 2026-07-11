import React from 'react';
import styles from './CaseTable.module.css';
import { RescueCase } from '../types';

interface CaseTableProps {
  items: RescueCase[];
  onView: (item: RescueCase) => void;
}

export default function CaseTable({ items, onView }: CaseTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Case ID</th>
            <th className={styles.th}>Animal</th>
            <th className={styles.th}>Condition</th>
            <th className={styles.th}>Priority</th>
            <th className={styles.th}>Location</th>
            <th className={styles.th}>Reported</th>
            <th className={styles.thAction}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={styles.row}>
              <td className={styles.td}>
                <div className={styles.avatarCell}>
                  <img src={item.imageUrl} alt="" className={styles.avatarImage} />
                  <span className={styles.caseIdText}>{item.id}</span>
                </div>
              </td>
              <td className={styles.td}>{item.animalType}</td>
              <td className={`${styles.td} ${styles.conditionCell}`}>{item.condition}</td>
              <td className={styles.td}>
                <span className={`${styles.priorityPill} ${styles[`priority${item.priority}`] || ''}`}>
                  {item.priority}
                </span>
              </td>
              <td className={styles.td}>{item.location}</td>
              <td className={styles.td}>{item.reportedDate}</td>
              <td className={styles.tdAction}>
                <button
                  type="button"
                  className={styles.viewButton}
                  onClick={() => onView(item)}
                  aria-label="Inspect comprehensive dashboard details panel"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
