import useSessionId from "../../hooks/useSessionId";
import { usePageView } from "../../hooks/usePageView";
import TrackCTA from "../buttons/TrackCta";


export default function HomeComponet() {
   const { sessionId, loading, error } = useSessionId();


  usePageView("/home");
  

  if (loading) return <p>Loading session...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  console.log("SessionId", sessionId)
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
    
    <div className="main-grid bg" id="main-grid-front">
    <section className="hero">
      <div className="hero-image">
      <div id="top" className="img-wrapper"></div>
      {/* <div id="middle" className="img-wrapper"></div>
      <div id="bottom" className="img-wrapper"></div> */}
     </div>
      {/* <div className="filterImage"></div> */}
      <div className="main__title hero__title">
      <h1><span>185</span>Restorations</h1>  
      </div>
      <div className="hero__body">           
      <div className="hero__subtitle">
        <ul>
          <li><span>NAME<span>:</span></span> 185 Restorations</li>
          <li><span>LOCATION<span>:</span></span> Christchurch</li>
          <li><span>DESC<span>:</span></span> We are your one stop true specialists for classic & custom car restorations...</li>
        </ul>

      </div>
      </div>   
      <div className="flex-button">
        
<TrackCTA 
  ariaLabel="call to action butto"
  text="Contact our crafts workshop & materialize all🫵car dreams"
  className="contact-btn"
  slug="/home"
  location="hero-section"
  clickTarget="contact-button"
/>
        </div>       
      
    </section>
    {/* <Services /> */}
  </div>
  </>
  )
}
