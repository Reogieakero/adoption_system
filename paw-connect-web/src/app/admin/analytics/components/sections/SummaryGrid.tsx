import React from "react";
import styles from "./SummaryGrid.module.css";
import { Card } from "../ui/Card";
import { ChangeBadge } from "../ui/ChangeBadge";
import { Sparkline } from "../ui/Sparkline";
import { summaryCards } from "../../data/mockData";

export function SummaryGrid() {
  return (
    <section className={styles.grid4}>
      {summaryCards.map((c) => (
        <Card key={c.label} className={styles.statCard}>
          <div className={styles.headerRow}>
            <div className={styles.iconCircle}>
              <c.icon size={16} color="var(--primary)" />
            </div>
            <ChangeBadge change={c.change} />
          </div>
          <div className={styles.valueContainer}>
            <div className={styles.valueText}>{c.value}</div>
            <div className={styles.labelText}>{c.label}</div>
          </div>
          <div className={styles.sparklineWrapper}>
            <Sparkline seed={c.seed} color={c.change >= 0 ? "var(--success)" : "var(--danger)"} />
          </div>
        </Card>
      ))}
    </section>
  );
}

