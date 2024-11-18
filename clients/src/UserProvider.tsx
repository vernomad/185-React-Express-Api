// UserProvider.tsx
import { useState, useEffect, ReactNode } from 'react';
import { UserContext } from './UserContext'; // Import the context

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

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          setUserToken(result.userToken);
          setIsAuthenticated(true);
          setUser(result.user)
        } else {
          setUserToken(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setUserToken(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, userToken, isAuthenticated, setUserToken, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
