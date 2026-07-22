import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import styles from "./DonutChart.module.css";

const DEFAULT_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

interface DonutChartItem {
  name: string;
  value: number;
  color?: string;
}

export function DonutChart({
  data,
  height = 220,
}: {
  data: DonutChartItem[];
  height?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper} style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
              {data.map((d, i) => (
                <Cell key={i} fill={d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centerOverlay}>
          <span className={styles.totalValue}>{total.toLocaleString()}</span>
          <span className={styles.totalLabel}>Total</span>
        </div>
      </div>
      <div className={styles.legend}>
        {data.map((d, i) => (
          <div key={d.name} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }} />
            <span className={styles.legendName}>{d.name}</span>
            <span className={styles.legendValue}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
