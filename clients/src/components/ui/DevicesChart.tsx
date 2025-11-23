import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend as RechartsLegend } from "recharts";
import { TrackingEvent, Meta } from "../../types/TrackingTypes";
import { useUser } from "../../useUser";
import CustomTooltip from "../page/CustomTooltip";

type ChartProps = {
  events: TrackingEvent[];
  isAnimationActive?: boolean;
};

function hasDevice(meta: unknown): meta is { device: string } {
  return !!meta && typeof meta === "object" && "device" in meta && typeof (meta as Meta).device === "string";
}

export function DeviceChart({ events, isAnimationActive = true }: ChartProps) {
  const { state } = useUser();
  const Legend = RechartsLegend as unknown as React.FC;

   const deviceCounts = events.reduce<Record<string, number>>((acc, e) => {
    if (hasDevice(e.meta)) {
      const d = e.meta.device; // fully typed
      acc[d] = (acc[d] || 0) + 1;
    } else {
      acc["Unknown"] = (acc["Unknown"] || 0) + 1;
    }
    return acc;
  }, {});

  const data = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ["#1c78c8ff", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
  const STROKE = state.preferences.theme === "dark" ? "#cececeff" : "#1b1b1bff";

  if (data.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "#5f7a87ff" }}>No device data available</p>;
  }

  return (
    <div>
      <h3 style={{ textAlign: "left" }}>Devices</h3>
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
