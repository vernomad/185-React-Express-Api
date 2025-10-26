import { useLocation } from 'react-router-dom';
import Logout from './LogoutButton';
import { useUser } from '../useUser';

export default function UserLogo() {
    const {user} = useUser()
    const location = useLocation();
  return (
    <>
    {location.pathname === '/' ? (
        <div className='App-logo-positioning'>
          <div className="App-logo">
            {/* <img src='./logo192.png' alt='' /> */}
          </div>
        </div>
      ): (
        <>
        <div className='App-logo-positioning'>
          <div  className="App-logo">
            {user && (
           <>
              {user.id === "hack" ? (
                   <p>dsfid</p>
              ): (
                <>
              <img src={user.image} alt='' />
              <Logout />
                </>
              )}
            </>
            )}
           
          </div>
        </div>
         {/* <div role='menu' data-popover="true" className="profile-menu">
        
         </div> */}
         </>
      )}
    
      </>
  )
}
