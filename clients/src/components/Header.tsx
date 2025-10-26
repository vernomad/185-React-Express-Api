import { Link } from 'react-router-dom';
import { useEffect } from 'react';
// import Drawer from './Drawer.tsx';
import UserLogo from './Userlogo.tsx';
// import DrawerButton from './DrawerButton.tsx';
import ToolButton from './TooltipButton.tsx';
import { PiHeadlightsBold } from "react-icons/pi";
import SideBar from './Sidebar.tsx';
import { navData } from './data/navData.ts';
import { useLocation } from "react-router-dom";



export default function Header() {

  const location = useLocation();

  useEffect(() => {
    const target = document.getElementById("navU1");

    if (location.pathname === "/contact" || location.pathname === "/admin") {
      target?.classList.add("border");
    } else {
      target?.classList.remove("border");
    }
    if (location.pathname === "/events") {
      target?.classList.add("event-border");
    } else {
      target?.classList.remove("event-border");
    }
  }, [location.pathname]);
  
  return (
    <>
    <header id='header'>
      <div className="theme-selector">
      <Link to='/admin'>
      <ToolButton
          svg={<PiHeadlightsBold />}
      ariaLabel="theme selector"
      dataToolId="theme-tooltip"
      dataToolContent="Night/Day"
      dataToolPlace="right"
      dataToolOffset={10}
      id="theme-tooltip"
      offset={10}
      /> </Link> 
      {/* <Link to='/admin'><ThemeButton /> </Link>  */}
      </div>
    <div className='head'>
    <ul id='navU1' className='navUl'>
      {navData.map((item) => (
        <li key={item.id}><Link to={item.slug}>{item.name}</Link></li>
      ))}
     
      {/* <DrawerButton /> */}
    </ul>
    </div>
    <SideBar />
    <UserLogo />
    </header>
    
    </>

  )
}
