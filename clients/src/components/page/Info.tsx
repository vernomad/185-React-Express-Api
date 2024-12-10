

export default function Info() {
  return (
    <>
    <div className="background" id="background"><img
        className="hero__about"
        src="./assets/img/background.png"
        alt=""
      /></div>

<div className="main-grid">
      <div className="about-section">
        
      <h1 className="about__title"><span>Classic</span> & Custom Car Restorations</h1>
      <div className="details">
      <span>About</span>
      <p className="p-1">With over 25 years of artisanship experience, </p>
      <p className="p-2">185 Restorations prides itself on delivering high-quality, custom car dreams to our valued clients.</p>
      </div>
      
      <div className="insetImage">
      <img        
       src="./assets/img/Cuda-8864.jpg"
       alt=""
       />
      </div>
      
      </div>
      <div className="about-section" id="about-section-2">
      <div className="details" id="details-2">
      <span>Team</span>
      <p className="p-1">Our team of skilled mechanical engineers and dedicated artisans are passionate about bringing your visions to life, </p>
      <p className="p-2">whether it's reviving an old vintage beauty from the 1920s or crafting a glinting muscle car under the streetlights.</p>
      </div>
      
      </div>
      <div className="about-section" id="about-section-3">
      <div className="details" id="details-3">
      <span>Projects</span>
      <p className="p-1">Through a highly focused and transparent communication process, </p>
      <p className="p-2">we ensure our clients are always in perfect sync with the development stages of their projects.
      From inception to the meticulously finished product on the shop floor, your imagination is at our fingertips, and we are committed to exceeding your expectations.
      </p>
      </div>
      
      </div>
      
    </div>
    </>
    
  )
}

