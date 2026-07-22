import React from 'react';
import { Eye, Check, Send, Heart, X } from 'lucide-react';
import Button from '@/components/ui/button';
import { formatStatus } from '@/lib/format-status';
import styles from './CaseTable.module.css';
import type { AnimalReport } from '@/types';

interface CaseTableProps {
  items: AnimalReport[];
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

export default function CaseTable({ items, onView, onAction }: CaseTableProps) {
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
            <th className={styles.thAction}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.report_id} className={styles.row}>
              <td className={styles.td}>
                <div className={styles.avatarCell}>
                  <img src={item.photo_url} alt="" className={styles.avatarImage} />
                  <span className={styles.caseIdText}>{item.report_id}</span>
                </div>
              </td>
              <td className={styles.td}>{item.species}</td>
              <td className={`${styles.td} ${styles.conditionCell}`}>{item.condition_description}</td>
              <td className={styles.td}>
                <span className={`${styles.priorityPill} ${styles[`priority${item.status}`] || ''}`}>
{formatStatus(item.status)}
                </span>
              </td>
              <td className={styles.td}>{item.location_area}</td>
              <td className={styles.td}>{item.submitted_at}</td>
              <td className={styles.tdAction}>
                <div className={styles.actionCell}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

