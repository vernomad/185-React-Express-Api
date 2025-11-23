import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend as RechartsLegend } from "recharts";
import { TrackingEvent, ClickMeta } from "../../types/TrackingTypes";
import { useUser } from "../../useUser";
import CustomTooltip from "../page/CustomTooltip";

export type ClickCounts = Record<string, number>;

type ChartProps = {
  events: TrackingEvent[];
  isAnimationActive?: boolean;
};


export function ClickButtonChart({ events, isAnimationActive = true  }: ChartProps) {
  const { state } = useUser();
  const Legend = RechartsLegend as unknown as React.FC;

   const clickCounts: Record<string, number> = {};
  for (const evt of events) {
    if (evt.type !== "click") continue;
    const user = evt.userId ?? "anonymous";
    const target = (evt.meta as ClickMeta)?.clickTarget ?? "Unknown";
    const key = `${user} - ${target}`;
    clickCounts[key] = (clickCounts[key] || 0) + 1;
  }


  const data = Object.entries(clickCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ["#3282b8", "#00C49F", "#FFA500", "#E64C4C", "#9B59B6"];
  const STROKE = state.preferences.theme === "dark" ? "#cececeff" : "#1b1b1bff";

  if (data.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#95aebaff" }}>No browser data available</p>;
  }

  return (
    <div>
      <h3 style={{ textAlign: "left" }}>Btn-clicks total(events)</h3>
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
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke={STROKE} />
          ))}
        </Pie>
        <>

            <Tooltip 
  content={<CustomTooltip />}  
  wrapperStyle={{ outline: "none" }}
/>

          <Legend />
        </>
      </PieChart>
    </div>
  );
}
