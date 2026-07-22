"use client";

import React from "react";
import { Save, RotateCcw } from "lucide-react";
import Button from '@/components/ui/button';
import styles from "../page.module.css";

interface SettingsFooterProps {
  onReset: () => void;
  saving?: boolean;
  statusMessage?: string;
}

export default function SettingsFooter({ onReset, saving, statusMessage }: SettingsFooterProps) {
  return (
    <div className={styles.stickyFooterShadcn}>
      <div className={styles.footerFlexContainer}>
        <span className={styles.footerStatusMessage}>
          {statusMessage || 'Settings'}
        </span>
        <div className={styles.footerActionButtonGroup}>
          <Button variant="admin-secondary" onClick={onReset} type="button">
            <RotateCcw size={14} /> Reset
          </Button>
          <Button variant="admin-primary" type="submit" disabled={saving}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
