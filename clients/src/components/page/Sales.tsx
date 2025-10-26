import { useEffect } from "react";

export default function SalesComponent() {

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
    <div className="contact-container bg">
    <div className="container">
      <h1>Sales Details</h1>
       
    </div>
    <div className="container" id="form">
      <h1>Sales Details</h1>
       
    </div>
    <div className="container">
      <h1>Sales Details</h1>
       
    </div>
  
    </div>
  )
}
