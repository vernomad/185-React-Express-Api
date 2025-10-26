import { useState, ReactNode } from "react";

type ReadMoreProps = {
  content: ReactNode;

};

export default function ShowCreateUser({ content }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => setExpanded(!expanded);

  return (
    <div>
      <div className={`hidden-html ${expanded ? "expanded" : ""}`}>
        {content}
      </div>
      <button
        className={`readmore ${expanded ? "expanded" : ""}`}
        onClick={toggleExpansion}
        aria-label="Expand readmore"
      >
        {expanded ? "Show Less" : "Create new user"}
      </button>
    </div>
  );
}
