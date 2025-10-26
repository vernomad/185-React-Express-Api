import { useTrackClick } from "../../hooks/useTrackclick";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

type TrackCTAProps = {
  id?: string;
  className: string;
  ariaLabel: string;
  text: string;
  slug: string;
  location: string;
  clickTarget: string;
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
  const { toggleDrawer } = useContext(UserContext);

  return (
    <button
      onClick={() => {
        trackCTA();
        toggleDrawer();
      }}
      id={id}
      aria-label={ariaLabel}
      type="button"
      className={className}
    >
      {text}
    </button>
  );
}