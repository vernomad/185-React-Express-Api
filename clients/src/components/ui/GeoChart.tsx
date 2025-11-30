import React, {useState} from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Legend as RechartsLegend } from "recharts";
import { useUser } from "../../useUser";
import CustomTooltip from "../page/CustomTooltip";

export type GeoCounts = Record<string, number>;

type GeoChartProps = {
  geoCounts: GeoCounts;
  isAnimationActive?: boolean;
  topN?: number;
};

export function GeoChart({ geoCounts, topN = 5, isAnimationActive = true }: GeoChartProps) {
const {state} = useUser()
  const Legend = RechartsLegend as unknown as React.FC;
  const [n, setN] = useState(topN);

  const sortedEntries = Object.entries(geoCounts).sort((a, b) => b[1] - a[1]);

  const effectiveN = Math.min(n, sortedEntries.length);

  const top = sortedEntries.slice(0, effectiveN);
  const rest = sortedEntries.slice(effectiveN);

  const otherTotal = rest.reduce((sum, [, val]) => sum + val, 0);

  // Convert to Recharts data format
  // const data = Object.entries(geoCounts).map(([country, count]) => ({
  //   name: country,
  //   value: count,
  // }));

  const data = [
    ...top.map(([country, count]) => ({ name: country, value: count })),
    ...(otherTotal > 0 ? [{ name: "Other", value: otherTotal }] : []),
  ];


  // Color palette
  const COLORS = ["#1c78c8ff", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const STROKE = state.preferences.theme === "dark" ? "#cececeff" : "#1b1b1bff"
 

  if (data.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#5f7a87ff" }}>No geo data available</p>;
  }

  return (
    <div id="chart-geo">
      <h3 style={{ textAlign: "left" }}>Events by Country</h3>
      <PieChart style={{ width: '100%', maxWidth: '400px', maxHeight: '300px', aspectRatio: 1 }} responsive>
              
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
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke={STROKE}
            />
          ))}
        </Pie>
        {/* ✅ Recharts components are fine to render directly */}
        <>
          <Tooltip 
  content={<CustomTooltip />}  
  wrapperStyle={{ outline: "none" }}
/>
  
          <Legend />
        </>
      </PieChart>
       <div style={{ width: "100%"}}>
        <div className="pie-dynamic-topL">
          <label htmlFor="geo-range">
            <strong>Top {effectiveN}</strong>
          </label>
          <input
            id="geo-range"
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
