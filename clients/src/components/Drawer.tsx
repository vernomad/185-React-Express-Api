import React, { useEffect, useState } from "react";
import { motion, useDragControls, PanInfo } from "framer-motion";
import { BsFillTelephoneFill, BsArrow90DegRight } from 'react-icons/bs';
import { SiMinutemailer } from 'react-icons/si';
import { FaMapPin, FaSalesforce } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';

const Drawer = ({ contactDetails }: { contactDetails: React.ReactNode }) => {

  const [drawerOpen, setDrawerOpen] = useState(false);


  const dragControls = useDragControls();

  // Handler to close the drawer when it's dragged and released
  const handleDragEnd = (_: MouseEvent | TouchEvent, info: PanInfo) => {
    const pointerEvent = document.querySelector('.drawer-outer');
    if (info.offset.y > 50) {
      setDrawerOpen(false);
      if (pointerEvent) {
        pointerEvent.classList.remove('active');
      }
    }
  };
 // Adding global passive touch event listeners
 useEffect(() => {
  const handleTouchStart = (event: TouchEvent) => {
    // Your touch start handling logic here
    console.log('Touch Start:', event);
  };

  const handleTouchMove = (event: TouchEvent) => {

      console.log('Touch moved:', event);
      // Logic for touch move event
      // For example, tracking the position of the touch point
      const touch = event.touches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      console.log(`Touch position: (${touchX}, ${touchY})`);
    };
  

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });

  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
  };
}, []);
  // Toggle function for drawer open/close
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <li>
      {/* Toggle button */}
      <button className="contact-button-header" onClick={toggleDrawer}>
        {drawerOpen ? "Contact" : "Contact"}
      </button>

      {/* Drawer Motion Component */}
      <motion.div
        className={`AppDrawer  ${drawerOpen ? 'navbar-open' : ''}`}
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        initial={{ scaleY: 0, y: "100%", zIndex: 0 }}
        animate={{
          zIndex: 1000,
          scaleY: drawerOpen ? 1 : 0,
          y: drawerOpen ? "0%" : "100%",
        }}
        transition={{ type: "spring", bounce: 0.15, delay: 0.1, duration: 0.6 }}
      >
        <div className="grab-scroll"></div>
        {/* <div className="navigation-container">
          <a href="/" className="nav_link ">Home</a>
          <a href="/about" className="nav_link ">About</a>
          <a href="/gallery" className="nav_link ">Gallery</a>
        </div> */}

        <div className="contact-container">
          <h3 className="drawer-title ">Contact Details</h3>
          <div className="contact-grid ">
          <SiMinutemailer className="icon-email "/>
            <ul>          
              <li><a href="mailto:aaron@185restorations.co.nz">aaron@185restorations.co.nz</a></li>
              <li><a href="mailto:phil@185restorations.co.nz">phil@185restorations.co.nz</a></li>
            </ul>
            <BsFillTelephoneFill className="icon-phone" />
            <ul>
              <li>Aaron: <a href="tel:0225732530">0225732530</a></li>
              <li>Phil: <a href="tel:0272056868">0272056868</a></li>
            </ul>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-grid">
            <BsArrow90DegRight className="icon-email"/>
            <ul>
              <li><a href='/find-us'><FaMapPin className="inline mr-4" />Find us on a map</a></li>
              <li><a href='/contact-form'><MdContactMail className="inline mr-4" />Contact form</a></li>
            </ul>
            <BsArrow90DegRight className="icon-email"/>
            <ul>
              <li><a href='/for-sale'><FaSalesforce className="inline mr-4" />Stuff for sale</a></li>
            </ul>
          </div>
        </div>

        {contactDetails}
      </motion.div>
    </li>
  );
};

export default Drawer;
