"use client";

import React from "react";
import Button from '@/components/ui/button';
import styles from "../page.module.css";

interface BackupDialogProps {
  isOpen: boolean;
  action: "backup" | "restore" | "export" | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BackupDialog({ isOpen, action, onClose, onConfirm }: BackupDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Confirm Action</h2>
          <p>Are you sure you want to execute the global operational instruction string: <strong>{action?.toUpperCase()}</strong>?</p>
        </div>
        <p className={styles.dialogNoticeText}>
          Executing transactional parameters on live relational databases changes telemetry logging tracks instantly. Check target indices before proceeding.
        </p>
        <div className={styles.modalFooter}>
          <Button variant="admin-secondary" onClick={onClose}>Abort</Button>
          <Button variant="admin-primary" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
