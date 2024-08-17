import React from 'react';
import { Navigate, useOutlet } from 'react-router-dom';

import { HOME_PAGE } from '../../config/page-routes';
import { useAuthContext } from '../../store/contexts/auth';

const NotAuthenticated = ({ children }: { children?: React.ReactNode }) => {
  const outlet = useOutlet();
  const { auth: isAuthenticated, loading: isLoading } = useAuthContext();

  if (isLoading === false && isAuthenticated === false) return outlet || children;

  if (isLoading === false && isAuthenticated) return <Navigate to={HOME_PAGE} />;

  throw {
    title: 'Internal Server Error.',
    status: 500,
    message: 'An error occurred. Please try again later.',
  };
};

export default NotAuthenticated;
