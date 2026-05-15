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
import { OrderProvider } from './contexts/OrderContext';

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
    // Redirect if authenticated and on auth pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/selection';
    
    if (user && profile && isAuthPage) {
      const role = profile.role;
      let inferred: 'sales' | 'supervisor' | 'admin' | 'accountant' | 'delivery' | null = null;
      if (role === 'SALES') inferred = 'sales';
      else if (role === 'SUPERVISOR') inferred = 'supervisor';
      else if (role === 'ADMIN') inferred = 'admin';
      else if (role === 'ACCOUNTS') inferred = 'accountant';
      else if (role === 'DELIVERY') inferred = 'delivery';

      if (inferred) {
         // Sync system state
         setAppView('dashboard');
         setSelectedDashboard(inferred);
         setLoginError('');
         
         // Trigger navigation
         navigate(`/${inferred}`, { replace: true });
      }
    }
  }, [user, profile, navigate, location.pathname, setSelectedDashboard, setAppView, setLoginError]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
        </div>
      </div>
    </div>
  );

  return (
    <OrderProvider>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/selection" element={<Navigate to="/login" replace />} />
          
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

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </OrderProvider>
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
