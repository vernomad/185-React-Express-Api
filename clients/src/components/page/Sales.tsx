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
    <div className="sales-container bg">
    <div className="sales">
      <h1>Stuff for Sale</h1>
       
    </div>
    <div className="sales">
      <h2>Sale Details</h2>
       
    </div>
    <div className="sales">
      <h3>Sales Contact</h3>
       
    </div>
  
    </div>
  )
}
