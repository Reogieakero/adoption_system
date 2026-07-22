import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./GeographicAnalytics.module.css";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";
import { useHeatmapData } from "@/hooks/admin/use-heatmap-data";
import type { HeatmapView, HeatmapMode } from "@/app/admin/heatmap/components/HeatMapCanvas";

const HeatMapCanvas = dynamic(
  () => import("@/app/admin/heatmap/components/HeatMapCanvas"),
  { ssr: false }
);

export function GeographicAnalytics() {
  const { data, isLoading } = useHeatmapData();
  const [view, setView] = useState<HeatmapView>("pins");
  const [mode, setMode] = useState<HeatmapMode>("all");

  const pointsCount = (data?.rescuePoints.length ?? 0) + (data?.adoptionPoints.length ?? 0);

  return (
    <section>
      <SectionHeading
        title="Geographic Analytics"
        subtitle="Rescue and adoption locations across the area"
        action={
          <div className={styles.actionGroup}>
            <div className={styles.toggleBtns}>
              {(["heatmap", "pins"] as const).map((v) => (
                <button
                  key={v}
                  className={`${styles.toggleBtn} ${view === v ? styles.toggleBtnActive : ""}`}
                  onClick={() => setView(v)}
                >
                  {v === "heatmap" ? "Heat" : "Pins"}
                </button>
              ))}
            </div>
            <div className={styles.toggleBtns}>
              {(["all", "rescue", "adoption"] as const).map((m) => (
                <button
                  key={m}
                  className={`${styles.toggleBtn} ${mode === m ? styles.toggleBtnActive : ""}`}
                  onClick={() => setMode(m)}
                >
                  {m === "all" ? "All" : m === "rescue" ? "Rescue" : "Adoption"}
                </button>
              ))}
            </div>
          </div>
        }
      />
      <Card className={styles.mapCard}>
        {isLoading ? (
          <div className={styles.emptyChart}>Loading map data…</div>
        ) : data && pointsCount > 0 ? (
          <div className={styles.mapCanvasHeight}>
            <HeatMapCanvas rescuePoints={data.rescuePoints} adoptionPoints={data.adoptionPoints} mode={mode} view={view} />
          </div>
        ) : (
          <div className={styles.emptyChart}>Map data will appear once coordinates are recorded in the system.</div>
        )}
      </Card>
    </section>
  );
}
