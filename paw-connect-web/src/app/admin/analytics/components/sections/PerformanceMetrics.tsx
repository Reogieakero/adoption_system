import React from "react";
import styles from "./PerformanceMetrics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { ChangeBadge } from "../ui/ChangeBadge";
import { performanceMetrics } from "../../data/mockData";

export function PerformanceMetrics() {
  return (
    <section>
      <SectionHeading title="Performance Metrics" subtitle="Operational efficiency across the rescue-to-adoption pipeline" />
      <div className={styles.grid5}>
        {performanceMetrics.map((m) => (
          <Card key={m.label}>
            <div className={styles.iconCircle}>
              <m.icon size={15} color="var(--foreground)" />
            </div>
            <div className={styles.value}>{m.value}</div>
            <div className={styles.label}>{m.label}</div>
            <ChangeBadge change={m.change} />
          </Card>
        ))}
      </div>
    </section>
  );
}

