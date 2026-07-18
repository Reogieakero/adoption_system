import React, { useState } from "react";
import styles from "./GeographicAnalytics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { mapPins } from "@/lib/mock-data/analytics";

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
          <div className={styles.actionGroup}>
            {["rescue", "adoption", "report"].map((t) => (
              <span
                key={t}
                className={styles.badgeNeutral}
                style={{ borderColor: hoveredType === t ? pinColor(t) : undefined }}
                onMouseEnter={() => setHoveredType(t)}
                onMouseLeave={() => setHoveredType(null)}
              >
                <span className={styles.mapDot} style={{ background: pinColor(t) }} />
                {t === "rescue" ? "Rescues" : t === "adoption" ? "Adoptions" : "Reports"}
              </span>
            ))}
          </div>
        }
      />
      <Card className={styles.mapCard}>
        <div className={`${styles.mapCanvas} ${styles.mapCanvasHeight}`}>
          <div className={styles.mapGrid} />
          {mapPins.map((p) => (
            <div
              key={p.id}
              className={`${styles.mapPin} ${hoveredType && hoveredType !== p.type ? styles.mapPinDimmed : ""}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
            >
              <span className={styles.mapPinPulse} style={{ background: pinColor(p.type) }} />
              <span className={styles.mapPinDot} style={{ background: pinColor(p.type) }} />
              <div className={styles.mapPopover}>
                {p.label} — {p.count} cases
              </div>
            </div>
          ))}
          <div className={styles.mapInfo}>
            Davao Region � {mapPins.length} active hotspots � hover pins for details
          </div>
        </div>
      </Card>
    </section>
  );
}

