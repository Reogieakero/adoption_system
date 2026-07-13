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
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--muted)", display: "grid", placeItems: "center", marginBottom: 12 }}>
              <m.icon size={15} color="var(--foreground)" />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 10px", fontWeight: 500 }}>{m.label}</div>
            <ChangeBadge change={m.change} />
          </Card>
        ))}
      </div>
    </section>
  );
}
