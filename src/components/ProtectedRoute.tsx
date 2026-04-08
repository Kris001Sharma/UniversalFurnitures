import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { authorize, getCurrentRole } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const role = getCurrentRole();
  const location = useLocation();

  if (!role) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authorize(role, allowedRoles)) {
    // Redirect to unauthorized if authenticated but not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
