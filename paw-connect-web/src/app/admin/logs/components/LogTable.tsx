import React from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Button from '@/components/ui/button';
import type { LogEntry } from '@/types';
import styles from "../page.module.css";

interface LogTableProps {
  logs: LogEntry[];
  onViewDetails: (log: LogEntry) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function LogTable({ logs, onViewDetails, page, totalPages, total, onPageChange }: LogTableProps) {
  if (logs.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.emptyIconCircle}>
          <FileText size={24} color="var(--text-muted)" />
        </div>
        <h3>No activity logs found</h3>
        <p>System activities will appear here once users begin interacting with the platform.</p>
      </div>
    );
  }

  const from = (page - 1) * logs.length + 1;
  const to = Math.min(page * logs.length, total);

  return (
    <div className={styles.tableResponsiveContainer}>
      <table className={styles.tableShadcn}>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>User</th>
            <th>Module</th>
            <th>Activity</th>
            <th>Status</th>
            <th className={styles.thRight}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className={styles.tableRowAnimation}>
              <td className={styles.timestampCell}>{log.timestamp}</td>
              <td>
                <div className={styles.userProfileCell}>
                  <span className={styles.avatarMock}>{log.user.charAt(0)}</span>
                  <span>{log.user}</span>
                </div>
              </td>
              <td>
                <span className={styles.moduleInlineBadge}>{log.module}</span>
              </td>
              <td className={styles.activityText}>{log.activity}</td>
              <td>
                <span className={`${styles.badgeShadcn} ${log.status === "Success" ? styles.badgeSuccess : styles.badgeFailed}`}>
                  {log.status}
                </span>
              </td>
              <td className={styles.tdRight}>
                <Button variant="admin-ghost" onClick={() => onViewDetails(log)}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.paginationContainer}>
        <span className={styles.paginationText}>Showing {from}-{to} of {total} entries</span>
        <div className={styles.paginationButtonGroup}>
          <Button variant="admin-secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft size={14} /> Prev
          </Button>
          <Button variant="admin-secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
