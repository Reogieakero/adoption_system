"use client";

import React from "react";
import { BookOpen, CheckCircle2, FileEdit, Users } from "lucide-react";
import styles from "./SummaryCards.module.css";

interface SummaryCardsProps {
  totalModules: number;
  publishedCount: number;
  draftCount: number;
  totalViews: number;
}

export default function SummaryCards({
  totalModules,
  publishedCount,
  draftCount,
  totalViews,
}: SummaryCardsProps) {
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Total Modules</p>
          <BookOpen size={16} className={styles.iconMuted} />
        </div>
        <div className={styles.summaryCardValue}>{totalModules}</div>
        <p className={styles.summaryCardDesc}>Active items in storage</p>
      </div>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Published</p>
          <CheckCircle2 size={16} className={styles.iconGreen} />
        </div>
        <div className={`${styles.summaryCardValue} ${styles.valueGreen}`}>{publishedCount}</div>
        <p className={styles.summaryCardDesc}>Live & visible to community</p>
      </div>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Draft Modules</p>
          <FileEdit size={16} className={styles.iconAmber} />
        </div>
        <div className={`${styles.summaryCardValue} ${styles.valueAmber}`}>{draftCount}</div>
        <p className={styles.summaryCardDesc}>Work in progress files</p>
      </div>
      <div className={styles.summaryCard}>
        <div className={styles.summaryCardHeader}>
          <p>Total Views</p>
          <Users size={16} className={styles.iconBlue} />
        </div>
        <div className={`${styles.summaryCardValue} ${styles.valueBlue}`}>{totalViews.toLocaleString()}</div>
        <p className={styles.summaryCardDesc}>Total operational reach</p>
      </div>
    </div>
  );
}