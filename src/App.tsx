import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Package, 
  Settings,
  ShieldCheck,
  UserCircle,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Monitor,
  Activity,
  AlertCircle,
  Shield,
  Wallet,
  FileText,
  Truck,
  TrendingUp,
  LayoutGrid,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

import { useAuth } from './contexts/AuthContext';
import { appConfig } from './config/appConfig';
import { useTracking } from './hooks/useTracking';
import { ProtectedRoute } from './components/ProtectedRoute';
import { authService } from './services/auth.service';

import { SystemProvider, useSystem } from './contexts/SystemContext';
import { SalesProvider } from './contexts/SalesContext';
import { InventoryProvider } from './contexts/InventoryContext';

const SalesDashboard = React.lazy(() => import('./components/dashboards/SalesDashboard'));
const AccountantDashboard = React.lazy(() => import('./components/dashboards/AccountantDashboard'));
const AdminDashboard = React.lazy(() => import('./components/dashboards/AdminDashboard'));
const SupervisorDashboard = React.lazy(() => import('./components/dashboards/SupervisorDashboard'));
const DeliveryDashboard = React.lazy(() => import('./components/dashboards/DeliveryDashboard'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isLoading } = useAuth();
  useTracking();

  const { appView, setAppView, selectedDashboard, setSelectedDashboard, loginStep, setLoginStep, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showPassword, setShowPassword } = useSystem();

  React.useEffect(() => {
    if (!appConfig.devMode && user && appView === 'login') {
      if (isLoading || isLoggingIn) return;
      if (profile) {
        const role = profile.role;
        let inferred: 'sales' | 'supervisor' | 'admin' | 'accountant' | 'delivery' | null = null;
        if (role === 'SALES') inferred = 'sales';
        else if (role === 'SUPERVISOR') inferred = 'supervisor';
        else if (role === 'ADMIN') inferred = 'admin';
        else if (role === 'ACCOUNTS') inferred = 'accountant';
        else if (role === 'DELIVERY') inferred = 'delivery';

        if (inferred) {
           setSelectedDashboard(inferred);
           setAppView('dashboard');
           setLoginError('');
           navigate(`/${inferred}`);
           return;
        }
      } else {
        if (location.pathname === '/login') {
            setLoginError('User profile not found. Please contact administrator.');
        }
      }
    }
  }, [user, profile, isLoading, appView, isLoggingIn, navigate, location.pathname, setSelectedDashboard, setAppView, setLoginError]);

  const handleEmailCheck = async () => {
    if (!loginEmail.trim()) {
      setLoginError('Please enter an email address');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);
    
    try {
      const role = await authService.checkEmailRole(loginEmail);
      if (role) {
        setLoginRole(role);
        if (role === 'SALES') setSelectedDashboard('sales');
        else if (role === 'SUPERVISOR') setSelectedDashboard('supervisor');
        else if (role === 'ADMIN') setSelectedDashboard('admin');
        else if (role === 'ACCOUNTS') setSelectedDashboard('accountant');
        else if (role === 'DELIVERY') setSelectedDashboard('delivery');
        setLoginStep(2);
      } else {
        setLoginError('Email not found in our system.');
      }
    } catch (err: any) {
      console.error('Email check error:', err);
      setLoginError('Unable to verify email at this time.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await authService.login(loginEmail, loginPassword);
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const renderSelection = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center space-y-8"
      >
        <div className="space-y-2">
          <div className="w-20 h-20 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-100 mb-6">
            <Monitor className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Developer Mode</h1>
          <p className="text-slate-500">Bypass auth and select a dashboard directly</p>
        </div>

        <div className="grid gap-4">
          {appConfig.dashboards.sales.enabled && (
            <button 
              onClick={() => { setSelectedDashboard('sales'); setAppView('dashboard'); navigate('/sales'); }}
              className="group relative bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Sales Dashboard</h3>
                <p className="text-xs text-slate-500">Manage leads, catalog, and orders</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
            </button>
          )}

          {appConfig.dashboards.supervisor.enabled && (
            <button 
              onClick={() => { setSelectedDashboard('supervisor'); setAppView('dashboard'); navigate('/supervisor'); }}
              className="group relative bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Supervisor Dashboard</h3>
                <p className="text-xs text-slate-500">Monitor production and team performance</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
            </button>
          )}

          {appConfig.dashboards.admin.enabled && (
            <button 
              onClick={() => { setSelectedDashboard('admin'); setAppView('dashboard'); navigate('/admin'); }}
              className="group relative bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Admin Dashboard</h3>
                <p className="text-xs text-slate-500">System settings and user management</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-rose-500 transition-colors" size={20} />
            </button>
          )}

          {appConfig.dashboards.accountant.enabled && (
            <button 
              onClick={() => { setSelectedDashboard('accountant'); setAppView('dashboard'); navigate('/accountant'); }}
              className="group relative bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Accountant Dashboard</h3>
                <p className="text-xs text-slate-500">Financial reports and transactions</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-amber-500 transition-colors" size={20} />
            </button>
          )}

          {appConfig.dashboards.delivery.enabled && (
            <button 
              onClick={() => { setSelectedDashboard('delivery'); setAppView('dashboard'); navigate('/delivery'); }}
              className="group relative bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Delivery Dashboard</h3>
                <p className="text-xs text-slate-500">Order handover and client delivery</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-orange-500 transition-colors" size={20} />
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Enterprise Resource Planning v2.4</p>
      </motion.div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
            <LayoutGrid size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">
            {loginStep === 1 ? 'Enter your email to sign in to your workspace' : 'Enter your password to continue'}
          </p>

          {loginError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm flex items-start gap-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{loginError}</p>
            </div>
          )}

          {loginStep === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <div className="relative">
                  <UserCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@company.com"
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailCheck()}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <button 
                onClick={handleEmailCheck}
                disabled={isLoggingIn}
                className="w-full bg-slate-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
              >
                {isLoggingIn ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Continue <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                  <UserCircle size={20} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{loginEmail}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{loginRole?.replace('_', ' ')}</p>
                </div>
                <button onClick={() => { setLoginStep(1); setLoginError(''); setLoginPassword(''); }} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowLeft size={16} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
                    className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button 
                onClick={handlePasswordLogin}
                disabled={isLoggingIn}
                className="w-full text-white font-medium py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 group"
              >
                {isLoggingIn ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">Secure enterprise access. Protected by standard encryption.</p>
          {appConfig.devMode && (
            <button onClick={() => setAppView('selection')} className="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700">
              Return to Selection Menu (Dev Mode)
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/selection" element={
          appConfig.devMode ? (
            <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderSelection()}
            </motion.div>
          ) : <Navigate to="/login" replace />
        } />
        
        <Route path="/login" element={
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderLogin()}
          </motion.div>
        } />
        
        <Route path="/sales/*" element={
          <ProtectedRoute allowedRoles={['SALES', 'ADMIN']}>
            <SalesProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SalesDashboard />
                </motion.div>
              </Suspense>
            </SalesProvider>
          </ProtectedRoute>
        } />
        
        <Route path="/supervisor/*" element={
          <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
            <SalesProvider>
            <InventoryProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <motion.div key="supervisor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SupervisorDashboard />
                </motion.div>
              </Suspense>
            </InventoryProvider>
            </SalesProvider>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <SalesProvider>
            <InventoryProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AdminDashboard />
                </motion.div>
              </Suspense>
            </InventoryProvider>
            </SalesProvider>
          </ProtectedRoute>
        } />
        
        <Route path="/accountant/*" element={
          <ProtectedRoute allowedRoles={['ACCOUNTS', 'ADMIN']}>
            <InventoryProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <motion.div key="accountant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AccountantDashboard />
                </motion.div>
              </Suspense>
            </InventoryProvider>
          </ProtectedRoute>
        } />
        
        <Route path="/delivery/*" element={
          <ProtectedRoute allowedRoles={['DELIVERY', 'ADMIN']}>
            <SalesProvider>
            <InventoryProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <motion.div key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <DeliveryDashboard />
                </motion.div>
              </Suspense>
            </InventoryProvider>
            </SalesProvider>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to={appConfig.devMode ? "/selection" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={appConfig.devMode ? "/selection" : "/login"} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SystemProvider>
        <AppContent />
      </SystemProvider>
    </BrowserRouter>
  );
}
