import useSessionId from "../../hooks/useSessionId";
import { usePageView } from "../../hooks/usePageView";
import TrackCTA from "../buttons/TrackCta";
import { useState } from "react";
import RefreshButton from "../buttons/RefreshButton";


export default function HomeComponet() {
   const { sessionId, loading, error } = useSessionId();

 const [crash, setCrash] = useState(false);

  if (crash) {
    throw new Error("Manually triggered crash!");
  }
  usePageView("/home");
  

  // if (loading) return <p className="loading-error">Loading session...</p>;
  //  if (error) return <p className="loading-error">Error: {error.message}</p>;
  //  if (!error) throw new Error("error in component");
  
  console.log("SessionId", sessionId)
  return (
    <>
    {/* <Helmet>
        <title>185 Restorations</title>
        <meta name="description" content="Custom & classic car refurbishment" />

        Open Graph
        <meta property="og:title" content="185 Restorations" />
        <meta property="og:description" content="Custom & classic car refurbishment" />
        <meta property="og:image" content="https://example.com/images/preview.jpg" />
        <meta property="og:url" content="https://example.com/page" />
        <meta property="og:type" content="website" />

        Twitter Card
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="185 Restorations" />
        <meta name="twitter:description" content="Custom & classic car refurbishment" />
        <meta name="twitter:image" content="https://example.com/images/preview.jpg" />
    </Helmet>     */}
    <section className="hero">
       {loading ? (<p>Loading session...</p>
      ): (
        <>
      <div className="hero-image">
      <div id="top" className="img-wrapper"></div>
     </div>
      <div className="main__title hero__title">
      <h1><span>185</span>Restorations</h1>  
      </div>
      <div className="hero__body">           
      <div className="hero__subtitle">
        <ul>
          <li><span>NAME<span>:</span></span> 185 Restorations</li>
          <li><span>LOCATION<span>:</span></span> Christchurch</li>
          <li><span>DESC<span>:</span></span> We are your one stop true specialists for classic & custom car restorations...</li>
           <button onClick={() => setCrash(true)}>💥 Crash Component</button>
        </ul>

      </div>
      </div>   
      <div className="call-to-action-wrapper">
        
<TrackCTA 
  ariaLabel="call to action button"
  text="Contact our crafts workshop & materialize all🫵car dreams"
  className="contact-btn"
  slug="/home"
  location="hero-section"
  clickTarget="contact-button"
/>
        </div>       
      {error && (<p id="home-error" className="loading-error errors">Error:{error.message}
        <RefreshButton />
      </p>)}
      </>
      )}
    </section>
     
    {/* <Services /> */}
  
  </>
  )
}
