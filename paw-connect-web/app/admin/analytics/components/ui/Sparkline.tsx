import React, { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { sparklineData } from "../../data/mockData";

export function Sparkline({ seed, color = "var(--primary)" }: { seed: number; color?: string }) {
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
