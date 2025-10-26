import { Tooltip } from "./page/Tooltip";
import { ReactElement, cloneElement } from "react";

interface Props {
  svg: ReactElement; // ReactNode won't let us clone, so ReactElement is safer
  ariaLabel: string;
  dataToolId: string;
  dataToolContent: string;
  dataToolPlace: string;
  dataToolOffset: number;
  id: string;
  offset: number;
}

export default function ToolButton({
  svg,
  ariaLabel,
  dataToolId,
  dataToolContent,
  dataToolPlace,
  dataToolOffset,
  id,
  offset,
}: Props) {
  // Clone the SVG element to inject attributes
  const iconWithProps = cloneElement(svg, {
    "aria-label": ariaLabel,
    "data-tooltip-id": dataToolId,
    "data-tooltip-content": dataToolContent,
    "data-tooltip-place": dataToolPlace,
    "data-tooltip-offset": dataToolOffset,
  });

  return (
    <button type="button"
    className="btn-multi"
    >
      {iconWithProps}
      <Tooltip id={id} className="theme-tooltip" offset={offset} />
    </button>
  );
}
