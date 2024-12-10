// UserProvider.tsx
import { useState, useEffect, ReactNode, useReducer } from 'react';
import { UserContext } from './UserContext'; // Import the context
import { AppState, AppActionType, AppActionTypes } from './types/AppActionTypes';
import AppInitialState from './AppInitialState';
// Define the structure of user data for typing
interface UserToken {
 token: string | null;
  // Add other fields as necessary based on the API response
}
interface User {
  id: string;
  username: string;
  image: string;
  roles: string[]; 
}

interface UserProviderProps {
  children: ReactNode;
}

function AppReducer(
  state: AppState,
  action: AppActionTypes,
): AppState {
  switch (action.type) {
    case AppActionType.SET_DRAWER_VISIBLE: 
    return {
      ...state,
      drawerOpen: action.payload as boolean,
    };
    case AppActionType.SET_PREFERENCES: {
    const {theme } = action.payload;
    localStorage.setItem("185Theme", theme);

      // Update classes based on preferences
      document.documentElement.classList.toggle("dark", theme === 'dark');
      document.documentElement.classList.toggle("light", theme === 'light');
     return {
       ...state,
       preferences: action.payload,
     };
  }
  default:
    return state;
 }
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(AppReducer, AppInitialState);

  const [user, setUser] = useState<User | null>(null)
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  let baseUrl = ''

  if (import.meta.env.MODE === 'development') {
    baseUrl = import.meta.env.VITE_DEV_URL
  } else {
    baseUrl = import.meta.env.VITE_BASE_URL
  }

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${baseUrl}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized state
            console.log('User is not authenticated.');
          }
          setUserToken(null);
          setIsAuthenticated(false);
          setUser(null);
          
        } else {
          const result = await response.json();
          setUserToken(result.userToken);
          setIsAuthenticated(true);
          setUser(result.user)
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setUserToken(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyAuth();
  }, [baseUrl]);

  const toggleDrawer = () => {
    dispatch({
      type: AppActionType.SET_DRAWER_VISIBLE,
      payload: !state.drawerOpen
    })
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, state, dispatch, toggleDrawer, userToken, isAuthenticated, setUserToken, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
