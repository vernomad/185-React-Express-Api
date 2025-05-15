import { useEffect } from "react";


export default function ContactComponent() {
   useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);
  return (
    <div className="contact-container">
    <div className="container">
      <h1>Contact Details</h1>
       
    </div>
    <div className="container" id="form">
      <h1>Contact Details</h1>
       
    </div>
    <div className="container">
      <h1>Contact Details</h1>
       
    </div>
    <div className="container-map" id="map">
      <div className="map-wrapper">
        <iframe title="Find us on google maps" className="responsive-iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77505.50359569631!2d172.26286885626814!3d-43.49785987195489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d31f853d8a00f27%3A0xa4abeee98371ffc8!2s185%20Bells%20Road%2C%20West%20Melton%207671!5e0!3m2!1sen!2snz!4v1665604298389!5m2!1sen!2snz"
            width="900" height="500" style={{border:'0'}} allowFullScreen={true} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
       
    </div>
    </div>
  )
}
