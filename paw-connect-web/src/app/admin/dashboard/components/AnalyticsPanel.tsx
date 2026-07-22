'use client';

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, MapPin, ChevronDown, type LucideIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { createServiceClient } from '@/lib/api-client';
import Button from '@/components/ui/button';
import styles from './AnalyticsPanel.module.css';

const { request } = createServiceClient('/api/admin/dashboard');

type ChartType = 'vertical' | 'horizontal';

interface ChartPoint { label: string; value: number }

interface ReportTool {
  id: string; icon: LucideIcon; title: string; description: string;
  trendValue: string; trendUp: boolean; chartType: ChartType; chartUnit: string; data: ChartPoint[];
}

const YEARS = ['2026', '2025', '2024'];
const MONTHS = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AXIS_TICK_STYLE = { fontSize: 12, fill: 'var(--navy-70)' };
const VALUE_LABEL_STYLE = { fontSize: 12, fontWeight: 600, fill: 'var(--navy)', fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace" };

const DEFAULT_TOOLS: ReportTool[] = [
  { id: 'adoption', icon: TrendingUp, title: 'Adoption Trends', description: 'Monthly adoption rates, applicant demand, and approval turnaround', trendValue: '+0%', trendUp: true, chartType: 'vertical', chartUnit: 'adoptions finalized', data: [] },
  { id: 'rescue', icon: Activity, title: 'Rescue Efficiency', description: 'Dispatch response times and case resolution velocity', trendValue: '0%', trendUp: true, chartType: 'vertical', chartUnit: 'avg. hours to resolve', data: [] },
  { id: 'geo', icon: MapPin, title: 'Geographic Distribution', description: 'Case density mapped across barangays and districts', trendValue: '0 active zones', trendUp: true, chartType: 'horizontal', chartUnit: 'open cases by location', data: [] },
];

function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { value: ValueType }[]; label?: string; unit: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      <span className={styles.tooltipValue}>{payload[0].value} <span className={styles.tooltipUnit}>{unit}</span></span>
    </div>
  );
}

function CustomSelect({ options, selected, onChange, isMonth }: { options: string[]; selected: string; onChange: (v: string) => void; isMonth?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className={styles.customSelectWrapper} ref={ref}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`${styles.customSelectTrigger} ${isOpen ? styles.customSelectTriggerActive : ''}`}>
        <span>{selected}</span>
        <ChevronDown size={12} className={`${styles.chevronIcon} ${isOpen ? styles.chevronIconOpen : ''}`} />
      </button>
      {isOpen && (
        <div className={`${styles.customSelectDropdown} ${isMonth ? styles.monthDropdown : ''}`}>
          {options.map((o) => (
            <button key={o} type="button" onClick={() => { onChange(o); setIsOpen(false); }}
              className={`${styles.customSelectItem} ${o === selected ? styles.customSelectItemActive : ''}`}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPanel() {
  const [tools, setTools] = useState<ReportTool[]>(DEFAULT_TOOLS);
  const [activeId, setActiveId] = useState('adoption');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const activeTool = tools.find((t) => t.id === activeId) ?? tools[0];

  useEffect(() => {
    request<{ success: true; trends: { label: string; value: number }[] }>('/adoptions/trends')
      .then((data) => {
        if (data.trends?.length) {
          setTools((prev) => prev.map((t) =>
            t.id === 'adoption' ? { ...t, data: data.trends, trendValue: `+${data.trends.reduce((a, b) => a + b.value, 0)}` } : t
          ));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className={styles.analyticsPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.sectionTitle}>Analytical Reporting Tools</h2>
        <p className={styles.sectionSubtitle}>Generate statistics on adoption trends, rescue efficiency, and geographic distribution of cases</p>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.toolsList} role="tablist">
          {tools.map(({ id, icon: Icon, title }) => (
            <Button key={id} variant="admin-ghost" active={id === activeId} onClick={() => setActiveId(id)}>
              <Icon size={13} strokeWidth={2} /><span>{title}</span>
            </Button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <CustomSelect options={MONTHS} selected={selectedMonth} onChange={setSelectedMonth} isMonth />
          <CustomSelect options={YEARS} selected={selectedYear} onChange={setSelectedYear} />
        </div>
      </div>

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

        {activeTool.data.length > 0 ? (
          activeTool.chartType === 'vertical' ? (
            <div className={styles.chartArea}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={activeTool.data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--navy-06)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} dy={8} />
                  <YAxis hide domain={[0, (max: number) => max * 1.15]} />
                  <Tooltip cursor={{ fill: 'var(--navy-06)' }} content={<ChartTooltip unit={activeTool.chartUnit} />} />
                  <Bar dataKey="value" fill="var(--ocean)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={styles.chartArea}>
              <ResponsiveContainer width="100%" height={activeTool.data.length * 38}>
                <BarChart data={activeTool.data} layout="vertical" margin={{ top: 0, right: 32, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="label" type="category" width={110} tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} />
                  <Tooltip cursor={{ fill: 'var(--navy-06)' }} content={<ChartTooltip unit={activeTool.chartUnit} />} />
                  <Bar dataKey="value" fill="var(--ocean)" radius={999} barSize={8} background={{ fill: 'var(--navy-06)', radius: 999 }}>
                    <LabelList dataKey="value" position="right" style={VALUE_LABEL_STYLE} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        ) : (
          <div className={styles.chartArea} style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-50)' }}>
            No data available yet
          </div>
        )}

        <p className={styles.chartUnit}>{activeTool.chartUnit}</p>
      </div>
    </section>
  );
}
