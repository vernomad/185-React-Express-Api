import { useState, ReactNode, useRef } from "react";
import { useTrackClick } from "../../hooks/useTrackclick";

type ReadMoreProps = {
  content: ReactNode;
  showWhat: string;
};

export default function ShowCtaButton({ content, showWhat }: ReadMoreProps) {
  const track = {
    slug: "/admin",
    location: "admin secret",
    clickTarget: "secret-btn"
  }  
  const trackCTA = useTrackClick(track.slug, track.location, track.clickTarget);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    if (!expanded) {
      // Expand
      const contentHeight = contentRef.current!.scrollHeight;
      contentRef.current!.style.height = contentHeight + 'px';
    } else {
      // Collapse - set to current height first for smooth transition
      const contentHeight = contentRef.current!.scrollHeight;
      contentRef.current!.style.height = contentHeight + 'px';
      
      // Force reflow
      void contentRef.current!.offsetHeight;
      
      // Then collapse
      contentRef.current!.style.height = '0px';
    }
    setExpanded(!expanded);
  };

  // Handle transition end to set height to auto when fully expanded
  const handleTransitionEnd = () => {
    if (expanded && contentRef.current) {
      contentRef.current.style.height = 'auto';
    }
  };
 

  return (
    <div>
      <div 
        ref={contentRef}
        className={`hidden-html ${expanded ? "expanded" : ""}`}
        onTransitionEnd={handleTransitionEnd}
      >
        {content}
      </div>
      <button
        className={`readmore ${expanded ? "expanded" : ""}`}
        onClick={() => [toggleExpand(), trackCTA()]}
        aria-label="Expand readmore"
      >
        {expanded ? "Show Less" : `${showWhat}`}
      </button>

    </div>
  );
}
