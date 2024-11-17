// UserContext.ts
import { createContext } from 'react';

// Define the structure of the user context data
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

interface UserContextProps {
  userToken: UserToken | null;
  isAuthenticated: boolean;
  user: User | null; 
  setUserToken: (token: UserToken | null) => void;
  setIsAuthenticated: (status: boolean) => void;
}

// Create and export the context
export const UserContext = createContext<UserContextProps | undefined>(undefined);
