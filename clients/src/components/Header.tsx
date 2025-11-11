import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import UserLogo from './Userlogo.tsx';
import ToolButton from './TooltipButton.tsx';
import { PiHeadlightsBold } from "react-icons/pi";
import { navData } from './data/navData.ts';
import { useLocation } from "react-router-dom";
import SidebarController from './SidebarController.tsx';
import SideBar from './Sidebar.tsx';
import { useUser } from '../useUser.ts';



export default function Header() {
  const {toggleTheme, state} = useUser()
  const location = useLocation();

  const handleTheme = () => {
    toggleTheme()
  }

  useEffect(() => {
    const target = document.getElementById("navU1");

    if (location.pathname === "/contact" || location.pathname === "/projects") {
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
    <section className='section-header'>
    <header id='header'>
      <span className="theme-selector" onClick={handleTheme}>
      <ToolButton
      svg={<PiHeadlightsBold />}
      ariaLabel="theme selector"
      dataToolId="theme-tooltip"
      dataToolContent={state.preferences.theme === "dark" ? "Lights on" : "Lights off"}
      dataToolPlace="right"
      dataToolOffset={10}
      id="theme-tooltip"
      offset={10}
      />
      </span>
    <div className='head'>
    <ul id='navU1' className='navUl'>
      {navData.map((item) => (
        <li key={item.id}><Link to={item.slug}>{item.name}</Link></li>
      ))}
     
      {/* <DrawerButton /> */}
    </ul>
    </div>
   <SidebarController />
    <label className="hamburger" htmlFor='menu-toggle'>
    <input type="checkbox" name="checkbox" id="menu-toggle"></input>
  </label>
  <SideBar />
    <UserLogo />
    </header>
    </section>

  )
}
