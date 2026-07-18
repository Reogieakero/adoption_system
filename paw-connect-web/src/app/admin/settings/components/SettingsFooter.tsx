"use client";

import React from "react";
import { Save, RotateCcw } from "lucide-react";
import Button from '@/components/ui/button';
import styles from "../page.module.css";

interface SettingsFooterProps {
  onReset: () => void;
}

export default function SettingsFooter({ onReset }: SettingsFooterProps) {
  return (
    <div className={styles.stickyFooterShadcn}>
      <div className={styles.footerFlexContainer}>
        <span className={styles.footerStatusMessage}>Unsaved system config nodes detected</span>
        <div className={styles.footerActionButtonGroup}>
          <Button variant="admin-secondary" onClick={onReset}>
            <RotateCcw size={14} /> Reset Changes
          </Button>
          <Button variant="admin-primary" type="submit">
            <Save size={14} /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
