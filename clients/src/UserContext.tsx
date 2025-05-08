// UserContext.ts
import { createContext } from 'react';
import AppInitialState from "./AppInitialState";
import { AppState, AppDispatch } from './types/AppActionTypes';

// Define the structure of the user context data
interface UserToken {
  token: string | null;
  // Add other fields as necessary based on the API response
}
export type User = {
  id: string;
  username: string;
  image: string;
  roles: string[]; 
}

interface UserContext {
  state: AppState;
  dispatch: AppDispatch;
  userToken: UserToken | null;
  isAuthenticated: boolean;
  user: User | null; 
  setUserToken: (token: UserToken | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  toggleDrawer: () => void;
}

// Create and export the context
export const UserContext = createContext<UserContext>({
  state: AppInitialState,
  dispatch: () => {
    console.log("Missing AppProvider");
    throw new Error("Missing AppProvider");
  },
  userToken: null,
  isAuthenticated: false,
  user: null,
  setUserToken: () => {},
  setIsAuthenticated: () => {},
  toggleDrawer: () => {},
});
