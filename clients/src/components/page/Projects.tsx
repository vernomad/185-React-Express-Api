//  import { useState } from "react";
// import { UserContext } from "../../UserContext";
//import Services from "./services";
import { useNavigate } from "react-router-dom";
//import ViewTransitionLayout from "../ViewTransitionsWrapper";

export default function ProjectsComponet() {

   const navigate = useNavigate();


  const handleClick = (id: string) => {
   
    if (id) {

        navigate(`/projects/${id}`);

    } else {
      navigate(`/projects/${id}`);
    }
  };

  return (
    <div className="projects-grid">
        
      <div className="img-wrapper-projects">
        <div className="projects-header">
        <h1 className="projects-title">185 Projects</h1>
        </div>
        <div className="projects-wrapper" id="forwards">
          <div className="image-wrapper">
      <img
        id="thumbnail"
        className="thumbnail"
        width={200}
        height={250}
        src="./assets/1.jpg"
        onClick={() => handleClick("1")}
        alt="Project 1"
          style={{
          cursor: "pointer",
          width: "200px",
        }}
      />
      </div>
      </div>
      </div>
  </div>
  )
}
