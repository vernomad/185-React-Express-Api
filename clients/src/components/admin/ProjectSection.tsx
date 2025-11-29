import { useState } from "react";

import ShowButton from "../buttons/ShowButton";
import CreateProject from "../forms/CreateProject";
import UpdateProjects from "../buttons/UpdateProject";
import FetchProjects from "../data/FetchProjectsJson";
import DeleteForm from "../forms/DeleteForm";
import useProjectData from "../../hooks/useProjectData";

import { ProjectEditType } from "@models/project/ProjectLog";


export default function ProjectSection() {
 const [project, setProject] = useState<ProjectEditType | null>(null);
const {projects, loading, error} = useProjectData()

if (loading) return <p>Loading...</p>;
// if (error) return <p>Failed: {error.message}</p>;

  return (
    <div className="admin-container">
      <h2>Projects</h2>
       {!loading && error ? (
      <p>Failed: <span className="errors">{error.message}</span></p>
     ): (
      <>
      <ShowButton
      showWhat="Show project"
      content={
        <div className="button-wrapper">
              <FetchProjects onProjectFetched={setProject} projectData={projects} />
        </div>
      }
      />
      <ShowButton
      showWhat="Update project"
      content={
        <div className="button-wrapper">
             <UpdateProjects earlyProjectInjection={project} />
        </div>
      }
      />

          <ShowButton
            showWhat="Create new project"
            content={
              <div className="button-wrapper">
                <CreateProject />
              </div>
            }
          />
              
          <ShowButton
            showWhat="Delete project"
            content={
              <div className="button-wrapper">
                <DeleteForm dir="project" />
              </div>
            }
          />
    </>
     )}
    </div>
  );
}
