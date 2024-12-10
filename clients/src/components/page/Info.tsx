import { useContext } from "react";
import { UserContext } from "../../UserContext";

export default function Info() {
  const { toggleDrawer } = useContext(UserContext);
  return (
    <>
      <div className="background" id="background">
        <img className="hero__about" src="./assets/img/background.png" alt="" />
      </div>

      <div className="main-grid">
        <div className="about-section">
          <h1 className="about__title">
            <span>Classic</span> & Custom Car Restorations
          </h1>
          <div className="details">
            <span>About</span>
            <p className="p-1">
              With over 25 years of artisanship experience,{" "}
            </p>
            <p className="p-2">
              185 Restorations prides itself on delivering high-quality, custom
              car dreams to our valued clients.
            </p>
          </div>

          <div className="insetImage" id="insetImage-1">
            <img src="./assets/img/car.jpg" alt="" />
          </div>
        </div>
        <div className="about-section" id="about-section-2">
          <div className="details" id="details-2">
            <span>Team</span>
            <p className="p-1">
              Our team of skilled mechanical engineers and dedicated artisans
              are passionate about bringing your visions to life,{" "}
            </p>
            <p className="p-2">
              whether it's reviving an old vintage beauty from the 1920s or
              crafting a glinting muscle car under the streetlights.
            </p>
          </div>
          <div className="insetImage" id="insetImage-2">
            <img src="./assets/img/Plymouth-Cuda2.jpg" alt="" />
          </div>
        </div>
        <div className="about-section" id="about-section-3">
          <div className="details" id="details-3">
            <span>Projects</span>
            <p className="p-1">
              Through a highly focused and transparent communication process,{" "}
            </p>
            <p className="p-2">
              we ensure our clients are always in perfect sync with the
              development stages of their projects. From inception to the
              meticulously finished product on the shop floor, your imagination
              is at our fingertips, and we are committed to exceeding your
              expectations.
            </p>
          </div>
          <div className="insetImage" id="insetImage-3">
            <img src="./assets/img/Cuda-8864.jpg" alt="" />
          </div>
        </div>
        <div className="about-section" id="about-section-4">
          <div className="details" id="details-2">
            <span>Classic & Custom</span>
            <p className="p-1">
              At 185 Restorations, we understand what it truly takes to build.{" "}
            </p>
            <p className="p-2">
              We have an impressive portfolio of successful classic and custom
              car restorations that showcase our expertise and attention to
              detail. Ready to see your dream car come to life?{" "}
              <button
                onClick={toggleDrawer}
                id="info-button-about"
                type="button"
                aria-label="call to action"
              >
                Contact our team
              </button>{" "}
              to discuss your project and let our passion drive your automotive
              aspirations.
            </p>
          </div>
          <div className="insetImage" id="insetImage-2">
            <img src="./assets/img/toyota5-full.jpg" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
