"use client";

import React from "react";
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import styles from "../page.module.css";

export default function LogSummaryCards() {
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Total Logs</p>
          <Activity size={16} color="var(--text-secondary)" />
        </div>
        <div className={styles.summaryCardValue}>1,482</div>
        <p className={styles.summaryCardDesc}>Aggregated lifetime logs across storage modules</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Today's Activities</p>
          <Clock size={16} color="var(--text-primary)" />
        </div>
        <div className={styles.summaryCardValue}>42</div>
        <p className={styles.summaryCardDesc}>Actions compiled within current runtime</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Successful Actions</p>
          <CheckCircle2 size={16} color="var(--success)" />
        </div>
        <div className={`${styles.summaryCardValue} ${styles.valueSuccess}`}>1,475</div>
        <p className={styles.summaryCardDesc}>Transactional commits successfully resolved</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Failed Actions</p>
          <XCircle size={16} color="var(--error)" />
        </div>
        <div className={`${styles.summaryCardValue} ${styles.valueFailed}`}>7</div>
        <p className={styles.summaryCardDesc}>Operations triggering security or system blocks</p>
      </div>
    </div>
  );
}
