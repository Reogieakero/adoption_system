import React, { useState } from "react";
import styles from "./GeographicAnalytics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { mapPins } from "../../data/mockData";

export function GeographicAnalytics() {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const pinColor = (type: string) =>
    type === "rescue" ? "var(--chart-4)" : type === "adoption" ? "var(--chart-6)" : "var(--chart-3)";

  return (
    <section>
      <SectionHeading
        title="Geographic Analytics"
        subtitle="Rescue locations, adoption locations, and reported-animal hotspots"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            {["rescue", "adoption", "report"].map((t) => (
              <span
                key={t}
                className={styles.badgeNeutral}
                style={{ cursor: "pointer", borderColor: hoveredType === t ? pinColor(t) : undefined }}
                onMouseEnter={() => setHoveredType(t)}
                onMouseLeave={() => setHoveredType(null)}
              >
                <span style={{ width: 7, height: 7, borderRadius: 999, background: pinColor(t), display: "inline-block" }} />
                {t === "rescue" ? "Rescues" : t === "adoption" ? "Adoptions" : "Reports"}
              </span>
            ))}
          </div>
        }
      />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div className={styles.mapCanvas} style={{ height: 420 }}>
          <div className={styles.mapGrid} />
          {mapPins.map((p) => (
            <div
              key={p.id}
              className={styles.mapPin}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: hoveredType && hoveredType !== p.type ? 0.25 : 1,
                transition: "opacity 160ms ease",
              }}
            >
              <span className={styles.mapPinPulse} style={{ background: pinColor(p.type) }} />
              <span className={styles.mapPinDot} style={{ background: pinColor(p.type) }} />
              <div className={styles.mapPopover}>
                {p.label} — {p.count} cases
              </div>
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: "var(--muted-foreground)",
              backdropFilter: "blur(4px)",
            }}
          >
            Davao Region · {mapPins.length} active hotspots · hover pins for details
          </div>
        </div>
      </Card>
    </section>
  );
}
