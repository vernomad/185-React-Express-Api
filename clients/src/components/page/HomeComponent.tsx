import { useContext } from "react";
import { UserContext } from "../../UserContext";
//import Services from "./services";

export default function HomeComponet() {
  const { toggleDrawer } = useContext(UserContext)
  return (
    <>
    {/* <Helmet>
        <title>My Cool Page</title>
        <meta name="description" content="A really cool page description." />

        Open Graph
        <meta property="og:title" content="My Cool Page" />
        <meta property="og:description" content="A really cool page description." />
        <meta property="og:image" content="https://example.com/images/preview.jpg" />
        <meta property="og:url" content="https://example.com/page" />
        <meta property="og:type" content="website" />

        Twitter Card
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Cool Page" />
        <meta name="twitter:description" content="A really cool page description." />
        <meta name="twitter:image" content="https://example.com/images/preview.jpg" />
    </Helmet>     */}
    
    <div className="main-grid" >
    <section className="hero">
      <div className="img-wrapper"></div>
     
      {/* <div className="filterImage"></div> */}
      <h1 className="main__title hero__title">
        <span>185</span>Restorations
      </h1>
      <div className="hero__body">           
      <div className="hero__subtitle">
        <ul>
          <li><span>NAME:</span> 185 Restorations</li>
          <li><span>LOCATION:</span> Christchurch</li>
          <li><span>DESCRIPTION:</span> Specialists in classic & custom car restorations & the crafts shop for realizing all those car dreams...</li>
        </ul>

      </div>
      {/* <p>
        Specialists in classic & custom car restorations. Located in
        Christchurch where we are strictly passionate about realizing all
        those car dreams...
      </p> */}
     

      </div>   
      <div className="flex-button">
        {/* <button
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
</button> */}
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
  Inn🫵dream
</button>
        </div>       
      
    </section>
    {/* <Services /> */}
  </div>
  </>
  )
}
