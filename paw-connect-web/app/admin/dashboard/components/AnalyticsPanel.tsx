"use client";

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import styles from './AnalyticsPanel.module.css';

type ChartType = 'vertical' | 'horizontal';

interface ChartPoint {
  label: string;
  value: number;
}

interface ReportTool {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  trendValue: string;
  trendUp: boolean;
  chartType: ChartType;
  chartUnit: string;
  data: ChartPoint[];
}

const REPORT_TOOLS: ReportTool[] = [
  {
    id: 'adoption',
    icon: TrendingUp,
    title: 'Adoption Trends',
    description: 'Monthly adoption rates, applicant demand, and approval turnaround',
    trendValue: '+12.4%',
    trendUp: true,
    chartType: 'vertical',
    chartUnit: 'adoptions finalized',
    data: [
      { label: 'Jan', value: 22 },
      { label: 'Feb', value: 31 },
      { label: 'Mar', value: 27 },
      { label: 'Apr', value: 40 },
      { label: 'May', value: 35 },
    ],
  },
  {
    id: 'rescue',
    icon: Activity,
    title: 'Rescue Efficiency',
    description: 'Dispatch response times and case resolution velocity',
    trendValue: '18% faster',
    trendUp: true,
    chartType: 'vertical',
    chartUnit: 'avg. hours to resolve',
    data: [
      { label: 'Jan', value: 6.2 },
      { label: 'Feb', value: 5.4 },
      { label: 'Mar', value: 5.8 },
      { label: 'Apr', value: 4.3 },
      { label: 'May', value: 3.9 },
    ],
  },
  {
    id: 'geo',
    icon: MapPin,
    title: 'Geographic Distribution',
    description: 'Case density mapped across barangays and districts',
    trendValue: '5 active zones',
    trendUp: true,
    chartType: 'horizontal',
    chartUnit: 'open cases by location',
    data: [
      { label: 'Central Market', value: 14 },
      { label: 'Riverside', value: 11 },
      { label: 'North Terminal', value: 8 },
      { label: 'Uptown', value: 6 },
      { label: 'Eastside', value: 4 },
    ],
  },
];

export default function AnalyticsPanel() {
  const [activeId, setActiveId] = useState(REPORT_TOOLS[0].id);
  const activeTool = REPORT_TOOLS.find((tool) => tool.id === activeId) ?? REPORT_TOOLS[0];
  const maxValue = Math.max(...activeTool.data.map((point) => point.value));

  return (
    <section className={styles.analyticsPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.sectionTitle}>Analytical Reporting Tools</h2>
        <p className={styles.sectionSubtitle}>
          Generate statistics on adoption trends, rescue efficiency, and geographic distribution of cases
        </p>
      </div>

      <div className={styles.toolsList} role="tablist">
        {REPORT_TOOLS.map(({ id, icon: Icon, title }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={id === activeId}
            onClick={() => setActiveId(id)}
            className={`${styles.toolTab} ${id === activeId ? styles.toolTabActive : ''}`}
          >
            <Icon size={16} strokeWidth={2} />
            <span>{title}</span>
          </button>
        ))}
      </div>

      {/* key={activeTool.id} forces a remount on switch so the fade/grow animations replay */}
      <div key={activeTool.id} className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>{activeTool.title}</h3>
            <p className={styles.chartDescription}>{activeTool.description}</p>
          </div>
          <div className={`${styles.trendBadge} ${activeTool.trendUp ? styles.trendUp : styles.trendDown}`}>
            {activeTool.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{activeTool.trendValue}</span>
          </div>
        </div>

        {activeTool.chartType === 'vertical' ? (
          <div className={styles.verticalChart}>
            {activeTool.data.map((point) => (
              <div key={point.label} className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{ height: `${(point.value / maxValue) * 100}%` }}
                />
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.horizontalChart}>
            {activeTool.data.map((point) => (
              <div key={point.label} className={styles.hBarRow}>
                <span className={styles.hBarLabel}>{point.label}</span>
                <div className={styles.hBarTrack}>
                  <div
                    className={styles.hBarFill}
                    style={{ width: `${(point.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className={styles.hBarValue}>{point.value}</span>
              </div>
            ))}
          </div>
        )}

        <p className={styles.chartUnit}>{activeTool.chartUnit}</p>
      </div>
    </section>
  );
}