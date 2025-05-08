import { useContext } from "react";
import { UserContext } from "../../UserContext";
import Services from "./services";

export default function ProjectsComponet() {
  const { toggleDrawer } = useContext(UserContext)
  return (
    <div className="main-grid" >
    <section className="hero">
      <img
        className="hero__img top"
        src="./assets/cockpit3.jpg"
        alt=""
      />
      <div className="filterImage"></div>
      <h1 className="main__title hero__title">
        <span>185</span>Restorations
      </h1>
      <div className="hero__body">           
      <p className="hero__subtitle">
        Specialists in classic & custom car restorations. Located in
        Christchurch where we are strictly passionate about realizing all
        those car dreams...
      </p>
      <button
  onClick={() => {
    console.log("Button clicked!");
    toggleDrawer();
  }}
  aria-label="call to action button"
  type="button"
  title="Contact us"
  className="contact-btn"
>
  Contact our team
</button>

      </div>          
     
    </section>
    <section className="small_screen">
    <button onClick={toggleDrawer} aria-label="call to action button" type="button" title="Contact us" className="contact-btn">Contact our team</button> 
    <div className="hero__body_2">           
      <p className="hero__subtitle">
        Specialists in classic & custom car restorations. Located in
        Christchurch where we are strictly passionate about realizing all
        those car dreams...
      </p>
      </div>
    </section>
    <Services />
  </div>
  )
}
