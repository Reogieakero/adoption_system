import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./GeographicAnalytics.module.css";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";
import { Tabs } from "../ui/Tabs";
import { useHeatmapData } from "@/hooks/admin/use-heatmap-data";
import type { HeatmapView, HeatmapMode } from "@/app/admin/heatmap/components/HeatMapCanvas";

const HeatMapCanvas = dynamic(
  () => import("@/app/admin/heatmap/components/HeatMapCanvas"),
  { ssr: false }
);

const VIEW_TABS = [
  { value: "pins", label: "Pins" },
  { value: "heatmap", label: "Heat" },
];

const MODE_TABS = [
  { value: "all", label: "All" },
  { value: "rescue", label: "Rescue" },
  { value: "adoption", label: "Adoption" },
];

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
            <Tabs tabs={VIEW_TABS} active={view} onChange={(v) => setView(v as HeatmapView)} />
            <Tabs tabs={MODE_TABS} active={mode} onChange={(m) => setMode(m as HeatmapMode)} />
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
