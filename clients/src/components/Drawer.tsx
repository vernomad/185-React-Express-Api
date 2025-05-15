import React, { useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { motion, useDragControls, PanInfo } from "framer-motion";
import { BsFillTelephoneFill, BsArrow90DegRight } from 'react-icons/bs';
import { SiMinutemailer } from 'react-icons/si';
import { FaMapPin, FaSalesforce } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';

type Props = {
  contactDetails: React.ReactNode;
}

const Drawer = ({contactDetails}: Props) => {
  const { state, toggleDrawer } = useContext(UserContext)
  //const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = () => {
    if (state.drawerOpen) {
      toggleDrawer()
    } else {
      toggleDrawer()
    }
  }
  const dragControls = useDragControls();

  // Handler to close the drawer when it's dragged and released
  const handleDragEnd = (_: MouseEvent | TouchEvent, info: PanInfo) => {
    const pointerEvent = document.querySelector('.drawer-outer');
    if (info.offset.y > 50) {
      //setDrawerOpen(false);
      handleDrawer()
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


  return (
    <>
      {/* Toggle button */}
      {/* <button className="contact-button-header" onClick={toggleDrawer}>
        {state.drawerOpen ? "Contact" : "Contact"}
      </button> */}

      {/* Drawer Motion Component */}
      <motion.div
        className={`AppDrawer  ${state.drawerOpen}`}
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        initial={{ scaleY: 0, y: "100%", zIndex: 0 }}
        animate={{
          zIndex: 1000,
          scaleY: state.drawerOpen ? 1 : 0,
          y: state.drawerOpen ? "0%" : "100%",
        }}
        transition={{ type: "spring", bounce: 0.15, delay: 0.1, duration: 0.6 }}
      >
        <div className="grab-scroll"></div>
        <div className="contact-container">
          <h3 className="drawer-title ">Contact Details</h3>
          <div className="contact-grid ">
          <SiMinutemailer className="icon-email "/>
            <ul>          
              <li><Link onClick={() => toggleDrawer()} to="mailto:aaron@185restorations.co.nz"><span>aaron@</span>185restorations.co.nz</Link></li>
              <li><Link onClick={() => toggleDrawer()} to="mailto:phil@185restorations.co.nz"><span>phil@</span>185restorations.co.nz</Link></li>
            </ul>
            <BsFillTelephoneFill className="icon-phone" />
            <ul>
              <li><span>Aaron:</span> <Link onClick={() => toggleDrawer()} to="tel:0225732530">0225732530</Link></li>
              <li><span>Phil:</span> <Link onClick={() => toggleDrawer()} to="tel:0272056868">0272056868</Link></li>
            </ul>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-grid">
            <BsArrow90DegRight className="icon-email"/>
            <ul>
              <li><Link onClick={() => toggleDrawer()} to='/contact#map'><FaMapPin className="inline mr-4" />Find us on a map</Link></li>
              <li><Link onClick={() => toggleDrawer()}  to='/contact#form'><MdContactMail className="inline mr-4" />Contact form</Link></li>
            </ul>
            <BsArrow90DegRight className="icon-email"/>
            <ul>
              <li><Link onClick={() => toggleDrawer()}  to='/for-sale'><FaSalesforce className="inline mr-4" />Stuff for sale</Link></li>
            </ul>
          </div>
        </div>

        {contactDetails}
      </motion.div>
    </>
  );
};

export default Drawer;
