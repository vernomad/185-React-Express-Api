import { useContext } from 'react';
import { UserContext } from './UserContext';

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  const { state, dispatch, ...rest } = context;

  const isAuthenticated = !!state.user;
  const user = state.user

  return {
    state,
    dispatch,
    isAuthenticated,
    user,
    ...rest,
  };
};