import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { appConfig } from '../config/appConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirect to home dashboard based on role
    const role = profile.role;
    let homePath = '/login';
    if (role === 'SALES') homePath = '/sales';
    else if (role === 'SUPERVISOR') homePath = '/supervisor';
    else if (role === 'ADMIN') homePath = '/admin';
    else if (role === 'ACCOUNTS') homePath = '/accountant';
    else if (role === 'DELIVERY') homePath = '/delivery';
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
};
