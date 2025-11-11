import { Link } from 'react-router-dom';
// import SidebarController from './SidebarController.tsx';
import { navData } from './data/navData.ts';

export default function SideBar() {

 //const contactDetails = <><div className="container-address">Address and extra content</div></>
  
  return (
    <>

{/* <SidebarController /> */}
 
<aside className="sidebar" id="sidebar">
  <ul className="navUi">
    {navData.map((item) => (
        <li key={item.id}><Link to={item.slug}>{item.name}</Link></li>
      ))}
    {/* <li>
      <Link to="/contact" id="menu-projects">Contact</Link></li> */}
    
    {/* <DrawerButton /> */}
  </ul>
</aside>
    </>
  )
}
