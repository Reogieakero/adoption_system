import React from "react";
import { Activity, Clock } from "lucide-react";
import styles from "../page.module.css";

interface LogSummaryCardsProps {
  total: number;
  today: number;
}

export default function LogSummaryCards({ total, today }: LogSummaryCardsProps) {
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Total Logs</p>
          <Activity size={16} color="var(--text-secondary)" />
        </div>
        <div className={styles.summaryCardValue}>{total.toLocaleString()}</div>
        <p className={styles.summaryCardDesc}>Aggregated lifetime logs across storage modules</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Today's Activities</p>
          <Clock size={16} color="var(--text-primary)" />
        </div>
        <div className={styles.summaryCardValue}>{today.toLocaleString()}</div>
        <p className={styles.summaryCardDesc}>Actions compiled within current runtime</p>
      </div>
    </div>
  );
}
