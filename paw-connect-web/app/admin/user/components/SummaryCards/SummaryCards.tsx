import React from "react";
import { Users, UserCheck, Clock, UserX } from "lucide-react";
import styles from "./SummaryCards.module.css";

export interface SummaryCardsProps {
  totalUsers: number;
  activeCount: number;
  pendingCount: number;
  suspendedCount: number;
}

export default function SummaryCards({
  totalUsers,
  activeCount,
  pendingCount,
  suspendedCount,
}: SummaryCardsProps) {
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Total Users</p>
          <Users size={16} color="#64748b" />
        </div>
        <div className={styles.summaryCardValue}>{totalUsers}</div>
        <p className={styles.summaryCardDesc}>Aggregated registered accounts</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Active Users</p>
          <UserCheck size={16} color="#10b981" />
        </div>
        <div className={styles.summaryCardValue} style={{ color: "#10b981" }}>
          {activeCount}
        </div>
        <p className={styles.summaryCardDesc}>Authenticated platform sessions</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Pending Verification</p>
          <Clock size={16} color="#f59e0b" />
        </div>
        <div className={styles.summaryCardValue} style={{ color: "#b45309" }}>
          {pendingCount}
        </div>
        <p className={styles.summaryCardDesc}>Awaiting validation response</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Suspended Users</p>
          <UserX size={16} color="#ef4444" />
        </div>
        <div className={styles.summaryCardValue} style={{ color: "#ef4444" }}>
          {suspendedCount}
        </div>
        <p className={styles.summaryCardDesc}>Locked out from interface panels</p>
      </div>
    </div>
  );
}
