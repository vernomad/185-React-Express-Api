import { useState, ReactNode } from "react";
import { useTrackClick } from "../../hooks/useTrackclick";

type ReadMoreProps = {
  content: ReactNode;
  showWhat: string;
//   id?: string;
//   className: string;
//   ariaLabel: string;
//   text: string;
//   slug: string;
//   location: string;
//   clickTarget: string;
};

export default function ShowCtaButton({ content, showWhat }: ReadMoreProps) {
  const track = {
    slug: "/admin",
    location: "admin secret",
    clickTarget: "secret-btn"
  }  
  const trackCTA = useTrackClick(track.slug, track.location, track.clickTarget);
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => setExpanded(!expanded);
 

  return (
    <div>
      <div className={`hidden-html ${expanded ? "expanded" : ""}`}>
        {content}
        
      </div>
      <button
        className={`readmore ${expanded ? "expanded" : ""}`}
        onClick={() => [toggleExpansion(), trackCTA()]}
        aria-label="Expand readmore"
      >
        {expanded ? "Show Less" : `${showWhat}`}
      </button>

    </div>
  );
}
