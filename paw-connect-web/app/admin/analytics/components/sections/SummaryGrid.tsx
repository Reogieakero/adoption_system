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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--primary-soft)", display: "grid", placeItems: "center" }}>
              <c.icon size={16} color="var(--primary)" />
            </div>
            <ChangeBadge change={c.change} />
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>{c.value}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", fontWeight: 500, marginTop: 2 }}>{c.label}</div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Sparkline seed={c.seed} color={c.change >= 0 ? "var(--success)" : "var(--danger)"} />
          </div>
        </Card>
      ))}
    </section>
  );
}
