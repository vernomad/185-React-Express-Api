// UserContext.ts
import { createContext } from 'react';
import AppInitialState from "./AppInitialState";
import { AppState, AppDispatch } from './types/AppActionTypes';


// Define the structure of the user context data
// interface UserToken {
//   token: string | null;
//   // Add other fields as necessary based on the API response
// }

export const missingProvider = (method: string) => {
  console.error(`Missing UserProvider: ${method}`);
  throw new Error(`Missing UserProvider: ${method}`);
};

export type UserContextProps = {
  state: AppState;
  dispatch: AppDispatch;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  //userToken: UserToken | null;
  // isAuthenticated: boolean;
  // user: User | null; 
  //setUserToken: (token: UserToken | null) => void;
  // setIsAuthenticated: (status: boolean) => void;
  toggleDrawer: () => void;
}

// Create and export the context
export const UserContext = createContext<UserContextProps>({
  state: AppInitialState,
  dispatch: () => {
    console.log("Missing AppProvider");
    throw new Error("Missing AppProvider");
  },
  //userToken: null,
  // isAuthenticated: false,
  // user: null,
  //setUserToken: () => {},
  // setIsAuthenticated: () => {},
  setTheme: () => missingProvider('setTheme'),
  toggleTheme: () => missingProvider('toggleTheme'),
  toggleDrawer: () => missingProvider('toggleDrawer'),
});
