import { useState, useEffect } from "react";
import type { ProjectEntry } from "@models/project/ProjectLog";
import { ProjectEditType } from "@models/project/ProjectLog";
import ImageLoader from "../image-comp/CustomImageLoader";

interface ProjectsProp {
  projectData: ProjectEntry[];
  onProjectFetched: (project: ProjectEditType | null) => void;
}

export default function FetchProjects({ projectData, onProjectFetched }: ProjectsProp) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const selectedProject = projectData.find((p) => p.slug === selectedSlug);

  const simplifiedProjects = projectData.map((p) => ({
    ...p,
    images: p.images ? `[${p.images.length}]` : "[]",
  }));

  const simplifiedProject = selectedProject
    ? {
        ...selectedProject,
        images: selectedProject.images ? `[${selectedProject.images.length}]` : "[]",
      }
    : null;

  const handleSelectProject = (slug: string) => {
    if (slug === selectedSlug) {
      setIsOpen(!isOpen);
    } else {
      setSelectedSlug(slug);
      setIsOpen(true);
    }
  };

  const toggleExpansion = () => setExpanded(!expanded);

  // ✅ Call the parent's callback *after* render, not inside it
  useEffect(() => {
    if (isOpen && selectedProject) {
      onProjectFetched(selectedProject);
    } else {
      onProjectFetched(null);
    }
  }, [isOpen, selectedProject, onProjectFetched]);

  return (
    <div>
      <ul className="toggle-buttons">
        <li>
          <button onClick={toggleExpansion}>
            {expanded ? "Show Less" : "All"}
          </button>
        </li>
        {projectData.map((p) => (
          <li key={p.id}>
            <button onClick={() => handleSelectProject(p.slug)}>
              {p.name}
            </button>
          </li>
        ))}
        
      </ul>

      {selectedProject && isOpen && (
        <div className="project-details-admin">
          <h2>{selectedProject.name}</h2>
          <p>{selectedProject.description}</p>
          {selectedProject.mainImage?.full && (
            <picture style={{ 
            display: "block", 
            position: "relative", 
            height: "50px", 
            width: "75px", 
            margin: ".5rem",
            border: "2px solid gray" }}>
            <ImageLoader 
            key={selectedProject.id}
            imagUrl={selectedProject.mainImage.full || ''}
            thumbUrl={selectedProject.mainImage.thumb || ''}
            slug={selectedProject.slug}
            id={selectedProject.id}
            projectName={selectedProject.name}
            />
            {/* <img
              src={selectedProject.mainImage?.full}
              alt={selectedProject.name}
            /> */}
          </picture>
          )}
          
          <pre>{JSON.stringify(simplifiedProject, null, 2)}</pre>
        </div>
      )}

      {expanded && (
        <div className="all-projects">
          <pre>{JSON.stringify(simplifiedProjects, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
