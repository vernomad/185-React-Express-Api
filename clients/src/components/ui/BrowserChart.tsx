import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend as RechartsLegend } from "recharts";
import { TrackingEvent, Meta } from "../../types/TrackingTypes";
import { useUser } from "../../useUser";
import CustomTooltip from "../page/CustomTooltip";

type ChartProps = {
  events: TrackingEvent[];
  isAnimationActive?: boolean;
};

function hasBrowser(meta: unknown): meta is { browser: string } {
  return !!meta && typeof meta === "object" && "browser" in meta && typeof (meta as Meta).browser === "string";
}

export function BrowserChart({ events, isAnimationActive = true  }: ChartProps) {
  const { state } = useUser();
  const Legend = RechartsLegend as unknown as React.FC;

 const browserCounts = events.reduce<Record<string, number>>((acc, e) => {
    if (hasBrowser(e.meta)) {
      const b = e.meta.browser; // now fully typed
      acc[b] = (acc[b] || 0) + 1;
    } else {
      acc["Unknown"] = (acc["Unknown"] || 0) + 1;
    }
    return acc;
  }, {});

  const data = Object.entries(browserCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ["#3282b8", "#00C49F", "#FFA500", "#E64C4C", "#9B59B6"];
  const STROKE = state.preferences.theme === "dark" ? "#cececeff" : "#1b1b1bff";

  if (data.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#5f7a87ff" }}>No browser data available</p>;
  }

  return (
    <div>
      <h3 style={{ textAlign: "left" }}>Browsers</h3>
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
