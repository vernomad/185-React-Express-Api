import type { TooltipProps } from "recharts";

type FixedTooltipProps = TooltipProps<number, string> & {
  label?: string | number;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      formatted?: string;
    };
  }>;
};

const CustomTooltip = (props: FixedTooltipProps) => {
  const { active, payload, label } = props;

  if (!active || !payload || payload.length === 0) return null;

   // Use the formatted value if present
  const value = payload[0].payload.formatted ?? payload[0].value;
  const name = payload[0].name;

  return (
    <div className="tooltip-charts">
      <p className="tooltip-label">{label}</p>
      <p>{name}</p>
      <p>{value}</p>
    </div>
  );
};

export default CustomTooltip;
