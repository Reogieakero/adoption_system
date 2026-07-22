import React from "react";
import { PawPrint, HeartHandshake, ClipboardCheck, Percent, ShieldAlert, MessageSquareWarning, Stethoscope, Timer } from "lucide-react";
import styles from "./SummaryGrid.module.css";
import { Card } from "../ui/Card";
import { ChangeBadge } from "../ui/ChangeBadge";
import { Sparkline } from "../ui/Sparkline";

const ICONS = [PawPrint, HeartHandshake, ClipboardCheck, Percent, ShieldAlert, MessageSquareWarning, Stethoscope, Timer];

interface SummaryGridProps {
  cards: { label: string; value: string; change: number | null; seed?: number }[];
}

export function SummaryGrid({ cards }: SummaryGridProps) {
  return (
    <section className={styles.grid4}>
      {cards.map((c, i) => {
        const Icon = ICONS[i] ?? ICONS[0];
        return (
          <Card key={c.label} className={styles.statCard}>
            <div className={styles.headerRow}>
              <div className={styles.iconCircle}>
                <Icon size={16} color="var(--primary)" />
              </div>
              {c.change != null && <ChangeBadge change={c.change} />}
            </div>
            <div className={styles.valueContainer}>
              <div className={styles.valueText}>{c.value}</div>
              <div className={styles.labelText}>{c.label}</div>
            </div>
            <div className={styles.sparklineWrapper}>
              <Sparkline seed={c.seed ?? i} color={c.change != null && c.change >= 0 ? "var(--success)" : "var(--muted)"} />
            </div>
          </Card>
        );
      })}
    </section>
  );
}
