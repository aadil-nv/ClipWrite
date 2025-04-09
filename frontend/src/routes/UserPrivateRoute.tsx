import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const UserPrivateRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user.isAuthenticated ) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

