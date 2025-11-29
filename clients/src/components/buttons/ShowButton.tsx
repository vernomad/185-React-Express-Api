import { useState, ReactNode, useRef } from "react";

type ReadMoreProps = {
  content: ReactNode;
  showWhat: string;
  token?: string;
};

export default function ShowButton({ content, showWhat }: ReadMoreProps) {
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
       
        onClick={toggleExpand}
        aria-label="Expand readmore"
      >
        {expanded ? "Show Less" : `${showWhat}`}
      </button>
    </div>
  );
}