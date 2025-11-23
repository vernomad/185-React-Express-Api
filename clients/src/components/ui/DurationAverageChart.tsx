import React, {useState} from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Legend as RechartsLegend } from "recharts";
import { useUser } from "../../useUser";
import CustomTooltip from "../page/CustomTooltip";

export type TotalCounts = Record<string, number>;

type DurationPieChartProps = {
  totals: TotalCounts;
  topN?: number;
  isAnimationActive?: boolean;
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function DurationAverageChart({ totals, topN = 5, isAnimationActive = true }: DurationPieChartProps) {
  const { state } = useUser();
  const Legend = RechartsLegend as unknown as React.FC;
 const [n, setN] = useState(topN);

   const sortedEntries = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  // Take top N, rest into "Other"
  
  // const top = sortedEntries.slice(0, topN);
  // const rest = sortedEntries.slice(topN);
     const effectiveN = Math.min(n, sortedEntries.length);

  const top = sortedEntries.slice(0, effectiveN);
  const rest = sortedEntries.slice(effectiveN);

  const otherTotal = rest.reduce((sum, [, val]) => sum + val, 0);

  const data = [
    ...top.map(([slug, total]) => ({ name: slug, value: total, formatted: formatDuration(total) })),
    ...(otherTotal > 0 ? [{ name: "Other", value: otherTotal, formatted: formatDuration(otherTotal) }] : []),
  ];

  // Color palette
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#33AA88"];
  const STROKE = state.preferences.theme === "dark" ? "#cececeff" : "#1b1b1bff";

  if (data.length === 0) {
    return (
      <h3 style={{ textAlign: "center" }}>
        No duration data available
      </h3>
    );
  }

  return (
    <div>
      <div>
    <h3 style={{ textAlign: "left"}}>Page Averages (seconds)</h3>
    </div>
       <PieChart style={{ width: '100%', maxWidth: '400px', maxHeight: '350px', aspectRatio: 1 }} responsive>
              0
              <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={100} 
              label
              isAnimationActive={isAnimationActive}
              >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={STROKE} />
          ))}
        </Pie>
         <Tooltip 
         formatter={(value: number) => formatDuration(value)}
  content={<CustomTooltip />}  
  wrapperStyle={{ outline: "none" }}
/>

        <Legend />
      </PieChart>
      <div style={{ width: "100%"}}>
          <div style={{ marginTop: "1rem", textAlign: "center", maxWidth: "450px", marginRight: "auto"}}>
        <label htmlFor="range-right">
          <strong>Top {effectiveN}</strong>
        </label>
        <input
        id="range-right"
          type="range"
          min={1}
          max={sortedEntries.length}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </div>
      </div>
    </div>
  );
}






