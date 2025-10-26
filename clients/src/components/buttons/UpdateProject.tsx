import { ProjectEditType } from "@models/project/ProjectLog";
import { useState, useEffect } from "react";
import FetchProjectForm from "../forms/FetchProject";
import UpdateProjectForm from "../forms/UpdateProject";

interface Prop {
  earlyProjectInjection?: ProjectEditType | null;
}

export default function UpdateProjects({earlyProjectInjection}: Prop) {
  const [expanded, setExpanded] = useState(false);
  const [project, setProject] = useState<ProjectEditType| null>(null);

  
  useEffect(() => {
    if (earlyProjectInjection) {
      setProject(earlyProjectInjection);
    }
  }, [earlyProjectInjection]);
  return (
    <>
      {expanded && (
        <div className="button-wrapper">
        {!project ? (
          <FetchProjectForm  onProjectFetched={setProject}/>
        ) : (
          <UpdateProjectForm  project={project} />
        )}
        </div>
      )}
      <button className={`readmore ${expanded ? "expanded" : ""}`} type="button" onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? "Show less" : "Update project"}
      </button>
    </>
  );
}
