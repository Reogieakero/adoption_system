import React from "react";
import { ClipboardCheck, ShieldAlert, Timer, CheckCircle2, Stethoscope } from "lucide-react";
import styles from "./PerformanceMetrics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { ChangeBadge } from "../ui/ChangeBadge";

const ICONS = [ClipboardCheck, ShieldAlert, Timer, Stethoscope, CheckCircle2];

interface PerformanceMetricsProps {
  metrics: { label: string; value: string; change: number | null }[];
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <section>
      <SectionHeading title="Performance Metrics" subtitle="Operational efficiency across the rescue-to-adoption pipeline" />
      <div className={styles.grid5}>
        {metrics.map((m, i) => {
          const Icon = ICONS[i] ?? ICONS[0];
          return (
            <Card key={m.label}>
              <div className={styles.iconCircle}>
                <Icon size={15} color="var(--text-primary)" />
              </div>
              <div className={styles.value}>{m.value}</div>
              <div className={styles.label}>{m.label}</div>
              {m.change != null && <ChangeBadge change={m.change} />}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
