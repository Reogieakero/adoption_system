import React, { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import { generateAnalyticsPdf } from "../lib/generate-analytics-pdf";
import type { AnalyticsOverview } from "@/services/analytics.api";
import styles from "./PdfReport.module.css";

function getPeriodLabel(mode: string, value: string): string {
  if (!value) return "All Time";
  if (mode === "day") {
    const d = new Date(value);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  if (mode === "month") {
    const [y, m] = value.split("-");
    const d = new Date(parseInt(y), parseInt(m) - 1);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }
  return value;
}

interface PdfReportProps {
  data: AnalyticsOverview | null;
}

export default function PdfReport({ data }: PdfReportProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"day" | "month" | "year">("month");
  const [value, setValue] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!dialogOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDialogOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [dialogOpen]);

  async function handleGenerate() {
    if (!data) return;
    const periodLabel = getPeriodLabel(mode, value);
    setGenerating(true);
    try {
      await generateAnalyticsPdf({ periodLabel, data });
      setDialogOpen(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setDialogOpen(false);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <Button variant="admin-primary" onClick={() => setDialogOpen(true)} disabled={!data}>
        <FileText size={15} />
        Export PDF
      </Button>

      {dialogOpen && (
        <div className={styles.overlay} onClick={() => !generating && setDialogOpen(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className={styles.title}>Generate PDF Report</h3>
            <p className={styles.subtitle}>Select a period to filter the report data.</p>

            <div className={styles.tabBar}>
              {(["day", "month", "year"] as const).map((m) => (
                <button
                  key={m}
                  className={`${styles.tab} ${mode === m ? styles.tabActive : ""}`}
                  onClick={() => {
                    setMode(m);
                    if (m === "day") {
                      const now = new Date();
                      setValue(now.toISOString().split("T")[0]);
                    } else if (m === "month") {
                      const now = new Date();
                      setValue(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
                    } else {
                      setValue(String(new Date().getFullYear()));
                    }
                  }}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {mode === "day" && (
              <input
                type="date"
                className={styles.picker}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
            {mode === "month" && (
              <input
                type="month"
                className={styles.picker}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
            {mode === "year" && (
              <input
                type="number"
                className={styles.picker}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min="2000"
                max="2100"
                placeholder="YYYY"
              />
            )}

            <p className={styles.summary}>
              Generate report for <strong>{getPeriodLabel(mode, value)}</strong>?
            </p>

            <div className={styles.actions}>
              <Button variant="admin-secondary" onClick={() => setDialogOpen(false)} disabled={generating}>
                Cancel
              </Button>
              <Button variant="admin-primary" onClick={handleGenerate} disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 size={15} className={styles.spin} />
                    Generating…
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
