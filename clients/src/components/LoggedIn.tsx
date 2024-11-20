import { useLocation } from 'react-router-dom';
import Logout from './LogoutButton';
import { useUser } from '../useUser';

export default function LoggedIn() {
    const {user} = useUser()
    const location = useLocation();
  return (
    <>
    {location.pathname === '/' ? (
        <div className='App-logo-positioning'>
          <div className="App-logo">
            <img src='./logo192.png' alt='' />
          </div>
        </div>
      ): (
        <>
        <div className='App-logo-positioning'>
          <button  className="App-logo">
            {user ? (
              <>
              <img src={user.image} alt='' />
              <Logout />
              </>
              
            ): (
              <></>
            )}
            
          </button>
        </div>
         {/* <div role='menu' data-popover="true" className="profile-menu">
        
         </div> */}
         </>
      )}
     
      </>
  )
}
