import React, { createContext, useContext, useState, useEffect } from 'react';
import { appConfig } from '../config/appConfig';
import { useAuth } from './AuthContext';
import { authService } from '../services/auth.service';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const SystemContext = createContext<any>(null);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [appView, setAppView] = useState<'login' | 'dashboard'>('login');
  const [selectedDashboard, setSelectedDashboard] = useState<'sales' | 'supervisor' | 'admin' | 'accountant' | 'delivery' | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [loginRole, setLoginRole] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [adminTab, setAdminTab] = useState<'Overview' | 'Logistics' | 'Sales' | 'Clients & Orders' | 'Manufacturing' | 'Delivery' | 'Finance' | 'Users' | 'System' | 'Logs' | 'Data Sync' | 'Settings'>('Overview');
  
  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [clientsSortBy, setClientsSortBy] = useState<'newest' | 'value_high' | 'value_low'>('newest');
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />;
    }
    return <ArrowDown size={14} className="inline ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />;
  };

  const sortData = (data: any[]) => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoginError('');
      await authService.logout();
      setAppView('login');
      setSelectedDashboard(null);
      setLoginStep(1);
      setLoginRole(null);
      setLoginPassword('');
    } catch (e) {
      console.error('Signout Error', e);
    }
  };

  // dates
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const endOfNextWeek = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <SystemContext.Provider value={{
      appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, adminTab, setAdminTab, sortConfig, setSortConfig, clientsSortBy, setClientsSortBy, handleSort, sortData, renderSortIcon, isLoadingData, setIsLoadingData, handleSignOut, today, endOfNextWeek
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => useContext(SystemContext);
