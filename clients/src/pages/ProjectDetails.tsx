// ProjectDetail.tsx
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();
    const navigate = useNavigate();

  return (
      <div className="projects-grid">
       <div className="img-wrapper-projects">
       <div className="projects-header-full">
      <h1 className="projects-title">Project Details</h1>
      <p className="project-id" >Project ID: {id}</p>
      </div>
      <div className="projects-wrapper-full" id="back">
        <div className="image-wrapper-full relative">
      <img
        id="full"
        className="full"
        src={`/assets/${id}.jpg`} // Example, customize this
        alt={`Project ${id}`}
        onClick={() => navigate(-1)}  
        style={{
          cursor: "pointer",
        }}
      />
      </div>
      </div>
         
      </div>
       
       </div>

  );
}
