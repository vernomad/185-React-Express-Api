import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Legend as RechartsLegend } from "recharts";
import { TrackingEvent } from "../../types/TrackingTypes";
import { useUser } from "../../useUser";

type GeoChartProps = {
  events: TrackingEvent[];
};

export function GeoChart({ events }: GeoChartProps) {
const {state} = useUser()
  const Legend = RechartsLegend as unknown as React.FC;
  // Count events per country
  const geoCounts = events.reduce<Record<string, number>>((acc, e) => {
    const country = e.geo?.country;
    if (!country) return acc;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Convert to Recharts data format
  const data = Object.entries(geoCounts).map(([country, count]) => ({
    name: country,
    value: count,
  }));

  // Color palette
  const COLORS = ["#1c78c8ff", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const STROKE = state.preferences.theme === "dark" ? "#cececeff" : "#1b1b1bff"
 

  if (data.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#5f7a87ff" }}>No geo data available</p>;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
     
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
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
          <Tooltip />
  
          <Legend />
        </>
      </PieChart>
    </div>
  );
}
