import { Navigate } from 'react-router-dom';
import React from 'react';
import { useUser } from '../useUser';

interface PrivateRouteProps {
  element: React.ReactElement; // Define the type of `element`
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { isAuthenticated } = useUser(); // Get isAuthenticated from the UserProvider context

  // Optionally, if you also need loading state, you could add it to the context and check here.
  // return loading ? <div>Loading...</div> : isAuthenticated ? element : <Navigate to="/login" />;

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;

