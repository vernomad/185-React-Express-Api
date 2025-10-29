import { useTrackClick } from "../../hooks/useTrackclick";
import { useState, ReactNode } from "react";

type TrackCTAProps = {
  id?: string;
  className: string;
  ariaLabel: string;
  text: string;
  slug: string;
  location: string;
  clickTarget: string;
  content: ReactNode;
};

export default function TrackCTA({
  id,
  className,
  ariaLabel,
  text,
  slug,
  location,
  clickTarget,
}: TrackCTAProps) {
  const trackCTA = useTrackClick(slug, location, clickTarget);
const [expanded, setExpanded] = useState(false);

const toggleExpansion = () => setExpanded(!expanded);

  return (
    <>
    <button
      onClick={() => {
        trackCTA();
        toggleExpansion()
      }}
      id={id}
      aria-label={ariaLabel}
      type="button"
      className={className}
    >
      {text}
    </button>
    </>
  );
}