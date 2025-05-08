import ThemeButton from './ThemeButton.tsx';
import { Link } from 'react-router-dom';
// import Drawer from './Drawer.tsx';
import SidebarController from './SidebarController.tsx';
import UserLogo from './Userlogo.tsx';
import DrawerButton from './DrawerButton.tsx';



export default function Header() {

 //const contactDetails = <><div className="container-address">Address and extra content</div></>
  
  return (
    <header id='header'>
      <div className="theme-selector" title='admin-link'>
      <Link to='/admin' ><ThemeButton /> </Link> 
      </div>
      
    <ul className='navUl'>
     <li><Link to="/" id='menu-home'>Home</Link></li>
     <li> <Link to="/about" id='menu-home'>Info</Link></li>
     <li> <Link to="/projects" id='menu-home'>Pro's</Link></li>
     
      {/* <Drawer contactDetails={contactDetails} /> */}
      <DrawerButton />
    </ul>
<SidebarController />
  <label className="hamburger" htmlFor='menu-toggle'>
  <input type="checkbox" name="checkbox" id="menu-toggle"></input>
</label>
<aside className="sidebar" id="sidebar">
  <ul className="navUi">
    <li><Link to="/" id="menu-home">Home</Link></li>
    <li><Link to="/about" id="menu-about">Info</Link></li>
    <li><Link to="/projects" id="menu-projects">Pro's</Link></li>
    
    <DrawerButton />
  </ul>
</aside>

<UserLogo />
    </header>
  )
}
