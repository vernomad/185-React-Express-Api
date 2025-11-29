import { ProjectEditType } from "@models/project/ProjectLog";
import { useState, useEffect } from "react";
import FetchProjectForm from "../forms/FetchProject";
import UpdateProjectForm from "../forms/UpdateProject";

interface Prop {
  earlyProjectInjection?: ProjectEditType | null;
}

export default function UpdateProjects({earlyProjectInjection}: Prop) {
  const [project, setProject] = useState<ProjectEditType| null>(null);

  
  useEffect(() => {
    if (earlyProjectInjection) {
      setProject(earlyProjectInjection);
    }
  }, [earlyProjectInjection]);
  return (
    <>

        {!project ? (
          <FetchProjectForm  onProjectFetched={setProject}/>
        ) : (
          <UpdateProjectForm  project={project} />
        )}

    </>
  );
}
