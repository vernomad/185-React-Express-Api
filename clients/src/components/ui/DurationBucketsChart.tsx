import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Legend as RechartsLegend } from "recharts";
import { useUser } from "../../useUser";
import CustomTooltip from "../page/CustomTooltip";

type DurationPieProps = {
  buckets: Record<string, number>;
   isAnimationActive?: boolean;
};

export function DurationBucketChart({ buckets, isAnimationActive = true }: DurationPieProps) {
  const { state } = useUser();
  const Legend = RechartsLegend as unknown as React.FC;

  const data = Object.entries(buckets).map(([label, count]) => ({
    name: label,
    value: count,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];
  const STROKE =
    state.preferences.theme === "dark" ? "#cececeff" : "#1b1b1bff";

  if (data.every((d) => d.value === 0)) {
  return (
    <h3 style={{ textAlign: "center" }}>
      No duration data available
    </h3>
  );
}

//  console.log("data duration buckets", data)
  return (
    <div>
       <h3 style={{ textAlign: "left" }}>Time on Page</h3>

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
              key={index}
              fill={COLORS[index % COLORS.length]}
              stroke={STROKE}
            />
          ))}
        </Pie>

         <Tooltip 
  content={<CustomTooltip />}  
  wrapperStyle={{ outline: "none" }}
/>
        <Legend />
      </PieChart>
    </div>
  );
}


