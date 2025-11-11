import { useEffect, useState } from "react";
import CarIcon from "../image-comp/carIcon";
import { useWindowWidth } from "../../utils/useWindowWidth";
import { Link } from "react-router-dom";
import ContactForm from "../forms/ContactForm";
import { usePageView } from "../../hooks/usePageView";
import GoogleMap from "../ui/GoogleMap";
// import { BsFillTelephoneFill} from 'react-icons/bs';
// import { SiMinutemailer } from 'react-icons/si';

export default function ContactComponent() {
  const windowWidth = useWindowWidth();
  const [activeSection, setActiveSection] = useState<string>("");
  usePageView('/contact')
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveSection(hash);
      if (windowWidth < 1100 && hash) {
        // Mobile: scroll to section
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Run on load + listen for changes
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [windowWidth]);

  const content = (
    <>
    <div className="details-panel">
              <h2>Emails \ Phone \ Address</h2>
              <div className="details-contact">
                <div className="details-grid ">
                  <ul>
                    <li>
                      <Link to="mailto:aaron@185restorations.co.nz">
                        <span>aaron@</span>185restorations.co.nz
                      </Link>
                    </li>
                    <li>
                      <Link to="mailto:phil@185restorations.co.nz">
                        <span>phil@</span>185restorations.co.nz
                      </Link>
                    </li>
                  </ul>

                  <ul>
                    <li>
                      <span>Aaron:</span>{" "}
                      <Link to="tel:0225732530">0225732530</Link>
                    </li>
                    <li>
                      <span>Phil:</span>{" "}
                      <Link to="tel:0272056868">0272056868</Link>
                    </li>
                  </ul>

                  <ul>
                    <li>
                      <p>
                        <span>185:</span> Bells Rd, West Melton, Ch-Ch
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
    </>
  )

  const form = (
    <>
    <ContactForm />
    </>
  )

  const mapfunction: (width: number, height: number, clsName?: string) => JSX.Element = (width, height, clsName) => (
    // <iframe
    //             title="Find us on google maps"
    //             className={clsName || ''}
    //             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77505.50359569631!2d172.26286885626814!3d-43.49785987195489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d31f853d8a00f27%3A0xa4abeee98371ffc8!2s185%20Bells%20Road%2C%20West%20Melton%207671!5e0!3m2!1sen!2snz!4v1665604298389!5m2!1sen!2snz"
    //             width={width}
    //             height={height}
    //             style={{ border: "0" }}
    //             allowFullScreen={true}
    //             loading="lazy"
    //             referrerPolicy="no-referrer-when-downgrade"
    //           ></iframe>
     <GoogleMap width={width} height={height} clsName={clsName} />
  )

  return (
    <div className="main-grid" id="main-grid-contact">
      <div id="3d-contact" className="container-3d">
        <div id="grid-lines-contact" className="grid-lines ceiling"></div>
        <div id="grid-lines-contact" className="grid-lines floor">
          <div className="car">
          <CarIcon />
        </div>
        </div>
        <div className="notes">
          {["form", "details", "map"].map((section, index) => (
            <div id={`box-${index + 1}`} key={section} className="wall-box">
              <img src="/pinnote.png" width={100} height={80} alt="" />
              <a href={`#${section}`} aria-label={`scroll link ${section}`}>
                <figcaption className={`figcaption fig-${index + 1}`}>
                  {section}
                </figcaption>
              </a>
            </div>
          ))}
        </div>

        <div className="car-wall">
          <CarIcon />
        </div>
        <div className="plate-container-contact">
          <img src="assets/plate.png" className="plate-18" alt="" />
        </div>
        {/* ✅ Desktop view: show selected section */}
        {windowWidth > 1090 && (
          <div className="side-container">
            {activeSection === "form" && (
              <div className="form-panel">
                <h2>Contact Form</h2>
                {form}
              </div>
            )}
            {activeSection === "details" && (
             <>
             {content}
             </>  
            )}
            {activeSection === "map" && (
              <div className="findus-wrapper">
                <h2>Find us</h2>
                {mapfunction (500, 330)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Mobile: normal scroll sections */}
      {windowWidth < 1091 && (
        <>
          <div id="form" className="container">
            <h2>Contact Form</h2>
             {form}
          </div>
          <div id="details" className="container">
            {content}
          </div>
          <div id="map" className="container">
            <div className="map-wrapper">
              <h2>Find us</h2>
              {mapfunction (900, 500, "responsive-iframe")}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
