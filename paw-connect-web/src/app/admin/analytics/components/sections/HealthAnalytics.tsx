import React from "react";
import { Syringe, Activity } from "lucide-react";
import styles from "./HealthAnalytics.module.css";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartCard } from "../ui/ChartCard";
import { DonutChart } from "../ui/DonutChart";

interface HealthAnalyticsProps {
  healthStatus: { name: string; value: number }[];
  vaccinationCoverage: number;
}

export function HealthAnalytics({ healthStatus, vaccinationCoverage }: HealthAnalyticsProps) {
  const totalHealth = healthStatus.reduce((s, r) => s + r.value, 0);
  const criticalCount = healthStatus.find((s) => s.name === 'Critical')?.value ?? 0;
  const treatmentCount = healthStatus.find((s) => s.name === 'Under Treatment')?.value ?? 0;

  return (
    <section>
      <SectionHeading title="Health Analytics" subtitle="Medical status, vaccination coverage, and clinical trends" />
      <div className={styles.grid3}>
        <ChartCard title="Healthy vs Sick Animals">
          <DonutChart data={healthStatus} height={190} />
        </ChartCard>

        <ChartCard title="Vaccination Coverage">
          <div className={styles.vaccinationContainer}>
            <div className={styles.vaccinationHeader}>
              <Syringe size={18} color="var(--primary)" />
              <span className={styles.vaccinationPercent}>{vaccinationCoverage}%</span>
            </div>
            <div className={`${styles.progressTrack} ${styles.progressTrackTall}`}>
              <div className={styles.progressFill} style={{ width: `${vaccinationCoverage}%` }} />
            </div>
            <p className={styles.vaccinationDesc}>
              {vaccinationCoverage}% of animals fully vaccinated
            </p>
          </div>
        </ChartCard>

        <ChartCard title="Animals Under Treatment">
          <div className={styles.treatmentContainer}>
            <div className={styles.treatmentHeader}>
              <div className={styles.treatmentIcon}>
                <Activity size={18} color="var(--warning)" />
              </div>
              <div>
                <div className={styles.treatmentCount}>{treatmentCount}</div>
                <div className={styles.treatmentLabel}>currently under active care</div>
              </div>
            </div>
            <span className={styles.badgeWarning}>
              {criticalCount} critical · {treatmentCount - criticalCount} stable
            </span>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
