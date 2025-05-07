import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RoleBasedRouteGroup = ({ children, allowedRoles, requiresAuth = true }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (requiresAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.primaryRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRouteGroup;