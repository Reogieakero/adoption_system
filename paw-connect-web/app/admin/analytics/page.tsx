"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  PawPrint,
  HeartHandshake,
  ClipboardCheck,
  Percent,
  ShieldAlert,
  MessageSquareWarning,
  Stethoscope,
  Timer,
  Download,
  RefreshCw,
  Calendar,
  ChevronDown,
  Printer,
  RotateCcw,
  Search,
  MapPin,
  Dog,
  Cat,
  Syringe,
  HeartPulse,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  FileText,
  Building2,
  Activity,
  CheckCircle2,
} from "lucide-react";
import styles from "./Analytics.module.css";

/* ============================================================================
   MOCK DATA
   ============================================================================ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const adoptionTrend = MONTHS.map((m, i) => ({
  month: m,
  adoptions: Math.round(28 + i * 3.4 + Math.sin(i) * 6),
  applications: Math.round(40 + i * 4.1 + Math.cos(i) * 5),
}));

const adoptionStatus = [
  { name: "Approved", value: 412, color: "var(--chart-1)" },
  { name: "Pending", value: 96, color: "var(--chart-3)" },
  { name: "In Review", value: 58, color: "var(--chart-2)" },
  { name: "Rejected", value: 24, color: "var(--chart-4)" },
];

const dogVsCat = MONTHS.slice(0, 8).map((m, i) => ({
  month: m,
  Dogs: Math.round(18 + i * 2.2 + Math.sin(i) * 4),
  Cats: Math.round(14 + i * 1.8 + Math.cos(i) * 3),
}));

const topBreeds = [
  { name: "Aspin (Mixed)", value: 186 },
  { name: "Puspin (Mixed)", value: 164 },
  { name: "Shih Tzu", value: 71 },
  { name: "Labrador Retriever", value: 58 },
  { name: "Persian", value: 44 },
  { name: "Beagle", value: 33 },
];

const rescueByMonth = MONTHS.map((m, i) => ({
  month: m,
  cases: Math.round(14 + Math.sin(i / 1.5) * 6 + i * 0.6),
}));

const rescueStatus = [
  { name: "Completed", value: 268, color: "var(--chart-6)" },
  { name: "Ongoing", value: 41, color: "var(--chart-3)" },
  { name: "Pending", value: 19, color: "var(--chart-4)" },
];

const rescueCategories = [
  { name: "Stray", value: 154, color: "var(--chart-1)" },
  { name: "Injured", value: 98, color: "var(--chart-4)" },
  { name: "Abandoned", value: 76, color: "var(--chart-3)" },
];

const rescueResponseTrend = MONTHS.slice(0, 8).map((m, i) => ({
  month: m,
  minutes: Math.round(38 - i * 1.6 + Math.sin(i) * 3),
}));

const reportsByMonth = MONTHS.map((m, i) => ({
  month: m,
  reports: Math.round(20 + Math.cos(i / 1.3) * 7 + i * 0.4),
}));

const reportsByStatus = [
  { name: "Resolved", value: 301, color: "var(--chart-6)" },
  { name: "In Progress", value: 64, color: "var(--chart-2)" },
  { name: "Pending", value: 27, color: "var(--chart-4)" },
];

const reportsByCategory = [
  { name: "Stray Animal", value: 148 },
  { name: "Animal Abuse", value: 52 },
  { name: "Injured Animal", value: 97 },
  { name: "Noise Complaint", value: 38 },
  { name: "Abandonment", value: 61 },
];

const activeBarangays = [
  { name: "Barangay Poblacion", reports: 84, resolved: 92 },
  { name: "Barangay Bucana", reports: 67, resolved: 88 },
  { name: "Barangay Matina", reports: 59, resolved: 95 },
  { name: "Barangay Talomo", reports: 51, resolved: 81 },
  { name: "Barangay Buhangin", reports: 44, resolved: 90 },
];

const mapPins = [
  { id: 1, type: "rescue", x: 22, y: 28, label: "Rescue — Bucana", count: 12 },
  { id: 2, type: "rescue", x: 61, y: 18, label: "Rescue — Buhangin", count: 8 },
  { id: 3, type: "adoption", x: 38, y: 52, label: "Adoption — Matina", count: 15 },
  { id: 4, type: "adoption", x: 74, y: 46, label: "Adoption — Talomo", count: 9 },
  { id: 5, type: "report", x: 50, y: 70, label: "Reports — Poblacion", count: 21 },
  { id: 6, type: "report", x: 16, y: 66, label: "Reports — Agdao", count: 11 },
  { id: 7, type: "rescue", x: 84, y: 74, label: "Rescue — Toril", count: 6 },
];

const dogsVsCats = [
  { name: "Dogs", value: 612, color: "var(--chart-1)" },
  { name: "Cats", value: 438, color: "var(--chart-2)" },
];

const breedDistribution = [
  { name: "Aspin", value: 320 },
  { name: "Puspin", value: 268 },
  { name: "Shih Tzu", value: 84 },
  { name: "Labrador", value: 61 },
  { name: "Persian", value: 47 },
  { name: "Others", value: 270 },
];

const ageDistribution = [
  { name: "Puppy/Kitten", value: 214 },
  { name: "Young", value: 356 },
  { name: "Adult", value: 388 },
  { name: "Senior", value: 92 },
];

const sexDistribution = [
  { name: "Male", value: 548, color: "var(--chart-1)" },
  { name: "Female", value: 502, color: "var(--chart-5)" },
];

const availableVsAdopted = [
  { name: "Available", value: 264, color: "var(--chart-3)" },
  { name: "Adopted", value: 590, color: "var(--chart-6)" },
  { name: "Under Treatment", value: 76, color: "var(--chart-4)" },
];

const shelterCapacity = [
  { name: "Main Shelter — Bucana", used: 82, total: 100 },
  { name: "Satellite Shelter — Talomo", used: 41, total: 60 },
  { name: "Quarantine Wing", used: 14, total: 25 },
];

const healthStatus = [
  { name: "Healthy", value: 872, color: "var(--chart-6)" },
  { name: "Under Treatment", value: 76, color: "var(--chart-3)" },
  { name: "Critical", value: 12, color: "var(--chart-4)" },
];

const vaccinationCoverage = 78;

const heartRateSummary = MONTHS.slice(0, 8).map((m, i) => ({
  month: m,
  avgBpm: Math.round(96 + Math.sin(i) * 6),
}));

const commonConditions = [
  { name: "Skin Disease", value: 64 },
  { name: "Parvovirus", value: 38 },
  { name: "Malnutrition", value: 51 },
  { name: "Fracture", value: 22 },
  { name: "Ear Infection", value: 45 },
];

const vetVisitsPerMonth = MONTHS.map((m, i) => ({
  month: m,
  visits: Math.round(30 + Math.cos(i / 1.4) * 8 + i * 0.5),
}));

const performanceMetrics = [
  { label: "Adoption Approval Rate", value: "84.2%", change: 3.1, icon: ClipboardCheck },
  { label: "Rescue Completion Rate", value: "91.6%", change: 1.4, icon: ShieldAlert },
  { label: "Avg. Rescue Response Time", value: "27 min", change: -8.2, icon: Timer },
  { label: "Avg. Adoption Processing Time", value: "4.3 days", change: -5.6, icon: Timer },
  { label: "Report Resolution Rate", value: "88.9%", change: 2.7, icon: CheckCircle2 },
];

const recentAnalytics = [
  { metric: "Total Adoptions", current: "590", previous: "541", change: 9.1, trend: "up" },
  { metric: "Active Rescue Cases", current: "41", previous: "53", change: -22.6, trend: "down" },
  { metric: "Community Reports", current: "392", previous: "358", change: 9.5, trend: "up" },
  { metric: "Animals Under Treatment", current: "76", previous: "84", change: -9.5, trend: "down" },
  { metric: "Avg. Adoption Processing Time", current: "4.3 days", previous: "4.6 days", change: -6.5, trend: "down" },
  { metric: "Vaccination Coverage", current: "78%", previous: "73%", change: 6.8, trend: "up" },
];

const sparklineData = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    i,
    v: Math.round(40 + Math.sin(i / 1.6 + seed) * 18 + i * 1.4),
  }));

const summaryCards = [
  { label: "Total Animals", value: "1,050", change: 4.8, icon: PawPrint, seed: 1 },
  { label: "Available for Adoption", value: "264", change: -3.2, icon: HeartHandshake, seed: 2 },
  { label: "Total Adoptions", value: "590", change: 9.1, icon: ClipboardCheck, seed: 3 },
  { label: "Adoption Success Rate", value: "84.2%", change: 3.1, icon: Percent, seed: 4 },
  { label: "Active Rescue Cases", value: "41", change: -22.6, icon: ShieldAlert, seed: 5 },
  { label: "Community Reports", value: "392", change: 9.5, icon: MessageSquareWarning, seed: 6 },
  { label: "Animals Under Treatment", value: "76", change: -9.5, icon: Stethoscope, seed: 7 },
  { label: "Avg. Adoption Processing Time", value: "4.3 days", change: -5.6, icon: Timer, seed: 8 },
];

/* ============================================================================
   UI PRIMITIVES
   ============================================================================ */

function IconButton({
  icon: Icon,
  label,
  onClick,
  spinning = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  spinning?: boolean;
}) {
  return (
    <span className={styles.tooltipWrap}>
      <button className={styles.btnIcon} onClick={onClick} aria-label={label}>
        <Icon size={16} className={spinning ? "animate-spin" : ""} />
      </button>
      <span className={styles.tooltipBubble}>{label}</span>
    </span>
  );
}

function Select({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  searchable = false,
}: {
  label: string;
  icon?: React.ElementType;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className={open ? `${styles.selectTrigger} ${styles.selectTriggerOpen}` : styles.selectTrigger}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted-foreground)" }}>
          {Icon && <Icon size={14} />}
          <span style={{ color: "var(--foreground)" }}>{value || label}</span>
        </span>
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms ease" }} />
      </button>
      {open && (
        <div className={styles.selectContent}>
          {searchable && (
            <div style={{ position: "relative", marginBottom: 6 }}>
              <Search size={13} style={{ position: "absolute", left: 9, top: 10, color: "var(--muted-foreground)" }} />
              <input
                autoFocus
                className={styles.searchInput}
                style={{ height: 32, fontSize: 12 }}
                placeholder={`Search ${label.toLowerCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.map((opt) => (
              <div
                key={opt}
                className={opt === value ? styles.selectItemActive : styles.selectItem}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span>{opt}</span>
                {opt === value && <CheckCircle2 size={14} />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "10px 8px", fontSize: 12, color: "var(--muted-foreground)" }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ExportMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className={styles.btnPrimary} onClick={() => setOpen((o) => !o)}>
        <Download size={15} />
        Export
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className={styles.selectContent} style={{ right: 0, minWidth: 170 }}>
          <div className={styles.selectItem} onClick={() => setOpen(false)}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={14} /> Export PDF
            </span>
          </div>
          <div className={styles.selectItem} onClick={() => setOpen(false)}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileSpreadsheet size={14} /> Export Excel
            </span>
          </div>
          <div className={styles.selectItem} onClick={() => setOpen(false)}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Printer size={14} /> Print Report
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangeBadge({ change }: { change: number }) {
  const positive = change >= 0;
  return (
    <span className={positive ? styles.badgeSuccess : styles.badgeDanger}>
      {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      {Math.abs(change)}%
    </span>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: p.color || p.fill, display: "inline-block" }} />
          <span style={{ opacity: 0.85 }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ seed, color = "var(--primary)" }: { seed: number; color?: string }) {
  const data = useMemo(() => sparklineData(seed), [seed]);
  const gid = `spark-${seed}`;
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gid})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`${styles.card} ${className}`} style={{ padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  span = 1,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <Card style={{ gridColumn: `span ${span}` }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

function DonutChart({ data, height = 220 }: { data: { name: string; value: number; color: string }[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ position: "relative", width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>{total.toLocaleString()}</span>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Total</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: d.color }} />
            <span style={{ color: "var(--muted-foreground)" }}>{d.name}</span>
            <span style={{ fontWeight: 600, marginLeft: "auto" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressRow({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{label}</span>
        <span style={{ color: "var(--muted-foreground)" }}>
          {used}/{total} · {pct}%
        </span>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%`, background: pct > 85 ? "var(--danger)" : "var(--primary)" }} />
      </div>
    </div>
  );
}

/* ============================================================================
   PAGE SECTIONS
   ============================================================================ */

function Header({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [species, setSpecies] = useState("All Species");
  const [barangay, setBarangay] = useState("All Barangays");

  return (
    <div className={styles.header}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "18px 24px", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Analytics</h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0", maxWidth: 520 }}>
            Monitor adoption performance, rescue operations, community reports, animal health, and overall system performance.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Select label="Date Range" icon={Calendar} value={dateRange} onChange={setDateRange} options={["Today", "Last 7 days", "Last 30 days", "Last 90 days", "This Year", "Custom Range"]} />
          <Select label="Species" value={species} onChange={setSpecies} options={["All Species", "Dogs", "Cats", "Others"]} />
          <Select label="Barangay" icon={MapPin} value={barangay} onChange={setBarangay} options={activeBarangays.map((b) => b.name).concat(["All Barangays"])} searchable />
          <ExportMenu />
          <IconButton icon={RefreshCw} label="Refresh analytics" onClick={onRefresh} spinning={refreshing} />
        </div>
      </div>
    </div>
  );
}

function SummaryGrid() {
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

function AdoptionAnalytics() {
  return (
    <section>
      <SectionHeading title="Adoption Analytics" subtitle="Trends across applications, approvals, and top breeds" />
      <div className={styles.grid2}>
        <ChartCard title="Monthly Adoption Trend" subtitle="Adoptions vs. applications received">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={adoptionTrend} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="adoptions" name="Adoptions" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="applications" name="Applications" stroke="var(--chart-2)" strokeWidth={2.5} strokeDasharray="4 3" dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Adoption Status Distribution" subtitle="Current pipeline breakdown">
          <DonutChart data={adoptionStatus} />
        </ChartCard>

        <ChartCard title="Dog vs Cat Adoptions" subtitle="Monthly comparison">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dogVsCat} margin={{ left: -20, right: 8 }} barGap={4}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Dogs" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Cats" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Adopted Breeds" subtitle="Top 6 breeds by adoption count">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topBreeds} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11.5, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Adoptions" fill="var(--chart-1)" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function RescueAnalytics() {
  return (
    <section>
      <SectionHeading title="Rescue Analytics" subtitle="Case volume, status, and response performance" />
      <div className={styles.grid3}>
        <ChartCard title="Rescue Cases by Month" span={2}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={rescueByMonth} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="rescueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cases" name="Cases" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rescueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rescue Success Rate">
          <div style={{ display: "grid", placeItems: "center", height: 230 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[{ value: 91.6 }, { value: 8.4 }]}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="70%"
                  outerRadius="95%"
                  stroke="none"
                >
                  <Cell fill="var(--success)" />
                  <Cell fill="var(--muted)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: -128, fontSize: 26, fontWeight: 700 }}>91.6%</div>
            <div style={{ marginTop: 62, fontSize: 12, color: "var(--muted-foreground)" }}>Cases resolved successfully</div>
          </div>
        </ChartCard>

        <ChartCard title="Rescue Status Distribution">
          <DonutChart data={rescueStatus} height={180} />
        </ChartCard>

        <ChartCard title="Rescue Response Time" subtitle="Average minutes to arrival">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rescueResponseTrend} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="minutes" name="Minutes" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rescue Categories" subtitle="Stray, injured & abandoned">
          <DonutChart data={rescueCategories} height={220} />
        </ChartCard>
      </div>
    </section>
  );
}

function CommunityReports() {
  return (
    <section>
      <SectionHeading title="Community Reports" subtitle="Volume, resolution status, and most active barangays" />
      <div className={styles.grid2}>
        <ChartCard title="Reports by Month">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={reportsByMonth} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="reports" name="Reports" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reports by Status">
          <DonutChart data={reportsByStatus} />
        </ChartCard>

        <ChartCard title="Reports by Category">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={reportsByCategory} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11.5, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Reports" fill="var(--chart-3)" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Active Barangays" subtitle="By report volume and resolution rate">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {activeBarangays.map((b) => (
              <div key={b.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                    <Building2 size={13} color="var(--muted-foreground)" /> {b.name}
                  </span>
                  <span style={{ color: "var(--muted-foreground)" }}>{b.reports} reports · {b.resolved}% resolved</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${b.resolved}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

function GeographicAnalytics() {
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

function AnimalPopulation() {
  return (
    <section>
      <SectionHeading title="Animal Population" subtitle="Composition, demographics, and shelter capacity" />
      <div className={styles.grid3}>
        <ChartCard title="Dogs vs Cats">
          <DonutChart data={dogsVsCats} height={190} />
        </ChartCard>
        <ChartCard title="Sex Distribution">
          <DonutChart data={sexDistribution} height={190} />
        </ChartCard>
        <ChartCard title="Available vs Adopted">
          <DonutChart data={availableVsAdopted} height={190} />
        </ChartCard>

        <ChartCard title="Breed Distribution" span={2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breedDistribution} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Animals" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Age Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageDistribution} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Animals" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Shelter Capacity" span={3}>
          <div className={styles.grid3} style={{ gap: 24 }}>
            {shelterCapacity.map((s) => (
              <ProgressRow key={s.name} label={s.name} used={s.used} total={s.total} />
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

function HealthAnalytics() {
  return (
    <section>
      <SectionHeading title="Health Analytics" subtitle="Medical status, vaccination coverage, and clinical trends" />
      <div className={styles.grid3}>
        <ChartCard title="Healthy vs Sick Animals">
          <DonutChart data={healthStatus} height={190} />
        </ChartCard>

        <ChartCard title="Vaccination Coverage">
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: 190, gap: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <Syringe size={18} color="var(--primary)" />
              <span style={{ fontSize: 30, fontWeight: 700 }}>{vaccinationCoverage}%</span>
            </div>
            <div className={styles.progressTrack} style={{ height: 10 }}>
              <div className={styles.progressFill} style={{ width: `${vaccinationCoverage}%` }} />
            </div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0 }}>
              818 of 1,050 animals fully vaccinated this period
            </p>
          </div>
        </ChartCard>

        <ChartCard title="Animals Under Treatment">
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: 190, gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--warning-soft)", display: "grid", placeItems: "center" }}>
                <Activity size={18} color="var(--warning)" />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>76</div>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>currently under active care</div>
              </div>
            </div>
            <span className={styles.badgeWarning} style={{ width: "fit-content" }}>
              12 critical · 64 stable
            </span>
          </div>
        </ChartCard>

        <ChartCard title="Heart Rate Monitoring Summary" subtitle="Average BPM, monitored animals" span={2}>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={heartRateSummary} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis domain={[70, 120]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgBpm" name="Avg BPM" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12, color: "var(--muted-foreground)" }}>
            <HeartPulse size={13} color="var(--chart-4)" /> Normal range 70–120 bpm across monitored patients
          </div>
        </ChartCard>

        <ChartCard title="Common Medical Conditions">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={commonConditions} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Cases" fill="var(--chart-3)" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Veterinary Visits per Month" span={3}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vetVisitsPerMonth} margin={{ left: -20, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="visits" name="Vet Visits" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function PerformanceMetrics() {
  return (
    <section>
      <SectionHeading title="Performance Metrics" subtitle="Operational efficiency across the rescue-to-adoption pipeline" />
      <div className={styles.grid5}>
        {performanceMetrics.map((m) => (
          <Card key={m.label}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--muted)", display: "grid", placeItems: "center", marginBottom: 12 }}>
              <m.icon size={15} color="var(--foreground)" />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 10px", fontWeight: 500 }}>{m.label}</div>
            <ChangeBadge change={m.change} />
          </Card>
        ))}
      </div>
    </section>
  );
}

function RecentAnalyticsTable() {
  return (
    <section>
      <SectionHeading
        title="Recent Analytics"
        subtitle="Period-over-period comparison across key metrics"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className={styles.btnSecondary}>
              <RotateCcw size={14} /> Reset Filters
            </button>
            <button className={styles.btnSecondary}>
              <Printer size={14} /> Print Report
            </button>
          </div>
        }
      />
      <Card style={{ padding: 0 }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current Value</th>
              <th>Previous Value</th>
              <th>% Change</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {recentAnalytics.map((r) => (
              <tr key={r.metric}>
                <td style={{ fontWeight: 500 }}>{r.metric}</td>
                <td>{r.current}</td>
                <td style={{ color: "var(--muted-foreground)" }}>{r.previous}</td>
                <td>
                  <ChangeBadge change={r.change} />
                </td>
                <td>
                  {r.trend === "up" ? (
                    <span className={styles.badgeSuccess}>
                      <ArrowUpRight size={11} /> Improving
                    </span>
                  ) : (
                    <span className={styles.badgeDanger}>
                      <ArrowDownRight size={11} /> Declining
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Showing 6 of 6 metrics</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button className={styles.btnGhost} style={{ height: 30, padding: "0 10px" }}>Previous</button>
            <button className={styles.btnSecondary} style={{ height: 30, padding: "0 10px" }}>1</button>
            <button className={styles.btnGhost} style={{ height: 30, padding: "0 10px" }}>Next</button>
          </div>
        </div>
      </Card>
    </section>
  );
}

/* ============================================================================
   PAGE
   ============================================================================ */

export default function AnalyticsDashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <div className={styles.root}>
      <Header onRefresh={handleRefresh} refreshing={refreshing} />

      <main
        className={styles.fadeIn}
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <SummaryGrid />
        <AdoptionAnalytics />
        <RescueAnalytics />
        <CommunityReports />
        <GeographicAnalytics />
        <AnimalPopulation />
        <HealthAnalytics />
        <PerformanceMetrics />
        <RecentAnalyticsTable />
      </main>
    </div>
  );
}