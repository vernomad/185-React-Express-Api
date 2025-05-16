// UserProvider.tsx
import { useState, ReactNode, useReducer } from 'react';
import { UserContext } from './UserContext'; 
import { AppState, AppActionType, AppActionTypes } from './types/AppActionTypes';
import AppInitialState from './AppInitialState';

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
  };
  case AppActionType.SET_USER:
      return { ...state, user: action.payload };

  default:
    return state;
 }
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(AppReducer, AppInitialState, (initial) => {
     const storedUser = localStorage.getItem("user");
    return storedUser
      ? { ...initial, user: JSON.parse(storedUser) }
      : initial;
  });

   const [loading, setLoading] = useState<boolean>(true);

   setTimeout(() => {
    setLoading(false)
   }, 0)



  const toggleDrawer = () => {
    dispatch({
      type: AppActionType.SET_DRAWER_VISIBLE,
      payload: !state.drawerOpen
    })
  }

  //  const setUser = (user: AuthenticatedUser | null) => {
  //   dispatch({ type: AppActionType.SET_USER, payload: user });
  // };

const contextValue = { state, dispatch, toggleDrawer, };

  if (loading) {
    return <div className='container'>Loading...</div>;
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
