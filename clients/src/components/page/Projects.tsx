// import { useContext } from "react";
// import { UserContext } from "../../UserContext";
import Services from "./services";

export default function ProjectsComponet() {
  // const { toggleDrawer } = useContext(UserContext)
  return (
    <div className="main-grid" >
    <section className="hero-projects">
      <div className="img-wrapper-projects">
 <img
        className="hero__img top"
        src="./assets/cockpit3.jpg"
        alt=""
      />
      </div>
     <h1>Projects</h1>

    </section>
    <Services />
  </div>
  )
}
