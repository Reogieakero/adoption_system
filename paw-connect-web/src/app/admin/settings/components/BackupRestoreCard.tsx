"use client";

import React from "react";
import { Database, Download, Upload } from "lucide-react";
import Button from '@/components/ui/button';
import styles from "../page.module.css";

interface BackupRestoreCardProps {
  onBackup: () => void;
  onRestore: () => void;
  onExport: () => void;
}

export default function BackupRestoreCard({ onBackup, onRestore, onExport }: BackupRestoreCardProps) {
  return (
    <div className={styles.cardShadcn}>
      <div className={styles.cardHeaderShadcn}>
        <div className={styles.cardHeaderFlex}>
          <Database size={18} color="var(--text-secondary)" />
          <h2>Backup & Restore</h2>
        </div>
        <p>System cluster snapshot states and archival pipelines.</p>
      </div>
      <div className={styles.cardContentShadcn}>
        <div className={styles.badgeInfoRow}>
          <span className={styles.badgeLabel}>Last Backup State</span>
          <span className={styles.badgeShadcn}>July 12, 2026 - 04:12 UTC</span>
        </div>

        <div className={styles.backupActionsGrid}>
          <Button variant="admin-secondary" onClick={onBackup} className={styles.btnActionUtility}>
            <Download size={14} /> Backup Database
          </Button>
          <Button variant="admin-secondary" onClick={onRestore} className={styles.btnActionUtility}>
            <Upload size={14} /> Restore Database
          </Button>
          <Button variant="admin-secondary" onClick={onExport} className={`${styles.btnActionUtility} ${styles.btnActionFull}`}>
            Export System Configuration Data
          </Button>
        </div>
      </div>
    </div>
  );
}
