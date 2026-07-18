"use client";

import React from "react";
import { X, User, Shield, FileText, Clock, Info } from "lucide-react";
import Button from '@/components/ui/button';
import type { LogEntry } from '@/types';
import styles from "../page.module.css";

interface LogDetailDrawerProps {
  log: LogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogDetailDrawer({ log, isOpen, onClose }: LogDetailDrawerProps) {
  return (
    <>
      <div className={`${styles.sheetOverlay} ${isOpen ? styles.sheetOverlayOpen : ""}`} onClick={onClose} />
      <div className={`${styles.sheetContent} ${isOpen ? styles.sheetContentOpen : ""}`}>
        {log && (
          <div className={styles.drawerInner}>
            <div className={styles.drawerHeader}>
              <div>
                <h2>Audit Trace Metrics</h2>
                <p>Granular structural logs for entry sequence</p>
              </div>
              <Button variant="admin-ghost" square onClick={onClose}>
                <X size={16} />
              </Button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.drawerMetaSection}>
                <span className={styles.drawerMetaLabel}>Log Identifier</span>
                <span className={styles.drawerMetaValueId}>{log.id}</span>
              </div>

              <div className={styles.separator} />

              <div className={styles.metaRowGrid}>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <User size={13} color="var(--text-secondary)" />
                    <span>Triggered By</span>
                  </div>
                  <span className={styles.metaItemValue}>{log.user}</span>
                </div>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <Shield size={13} color="var(--text-secondary)" />
                    <span>User Role</span>
                  </div>
                  <span className={styles.metaItemValue}>{log.role}</span>
                </div>
              </div>

              <div className={styles.metaRowGrid}>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <FileText size={13} color="var(--text-secondary)" />
                    <span>Target Module</span>
                  </div>
                  <span className={`${styles.moduleInlineBadge} ${styles.fitContentBadge}`}>{log.module}</span>
                </div>
                <div className={styles.metaColumn}>
                  <div className={styles.metaItemLabelFlex}>
                    <Clock size={13} color="var(--text-secondary)" />
                    <span>Execution Clock</span>
                  </div>
                  <span className={`${styles.metaItemValue} ${styles.metaItemValueSmall}`}>{log.timestamp}</span>
                </div>
              </div>

              <div className={styles.separator} />

              <div className={styles.drawerFullDescriptionBlock}>
                <div className={`${styles.metaItemLabelFlex} ${styles.metaLabelMargin}`}>
                  <Info size={13} color="var(--text-secondary)" />
                  <span>Operation Summary</span>
                </div>
                <div className={styles.activitySummaryCallout}>{log.activity}</div>
              </div>

              <div className={styles.drawerFullDescriptionBlock}>
                <span className={`${styles.drawerMetaLabel} ${styles.metaLabelMargin}`}>Payload / Event Context Description</span>
                <p className={styles.payloadParagraph}>{log.description}</p>
              </div>

              <div className={styles.separator} />

              <div className={styles.drawerFullDescriptionBlock}>
                <span className={`${styles.drawerMetaLabel} ${styles.metaLabelMargin}`}>Transaction Status Integrity</span>
                <div className={`${styles.badgeShadcn} ${styles.badgeFitContent} ${log.status === "Success" ? styles.badgeSuccess : styles.badgeFailed}`}>
                  {log.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <Button variant="admin-secondary" onClick={onClose} className={styles.btnFullWidth}>
                Close Audit Inspection Panel
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
