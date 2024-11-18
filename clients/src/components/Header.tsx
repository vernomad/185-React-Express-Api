import ThemeButton from './ThemeButton.tsx';
import { useLocation } from 'react-router-dom';
import Drawer from './Drawer.tsx';
import { useUser } from '../useUser';
import Logout from "../components/LogoutButton";

interface ContactProp {
  contactDetails: React.ReactNode;
}


export default function Header({contactDetails}: ContactProp) {
   const {user} = useUser()
   const location = useLocation();

  return (
    <header>
      <div className="theme-selector" title='admin-link'>
      <a href='/admin' ><ThemeButton /> </a> 
      </div>
      
    <ul className='navUl'>
      <li><a href="/" id="menu-home">Home</a></li>
      <li><a href="/about" id="menu-about">About</a></li>
      <li><a href="/projects" id="menu-projects">Projects</a></li>
      <Drawer contactDetails={contactDetails} />
    </ul>
    <label className='hamburger'>
      <input type='checkbox' name='checkbox'></input>
      </label>
    <aside className='sidebar'>
    <ul className='navUi'>
      <li><a href="/" id="menu-home">Home</a></li>
      <li><a href="/about" id="menu-about">About</a></li>
      <li><a href="/projects" id="menu-projects">Projects</a></li>
      <Drawer contactDetails={contactDetails} />
    </ul>
    </aside>
    
    {location.pathname === '/' ? (
        <div className='App-logo-positioning'>
          <div className="App-logo">
            <img src='./logo192.png' alt='' />
          </div>
        </div>
      ): (
        <div className='App-logo-positioning'>
          <div className="App-logo">
            {user ? (
              <>
              <img src={user.image} alt='' />
              <Logout />
              </>
              
            ): (
              <></>
            )}
            
          </div>
        </div>
      )}
    </header>
  )
}
