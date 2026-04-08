import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutGrid, Users, Package, ShoppingCart, Settings, LogIn } from 'lucide-react';
import { setCurrentRole } from '../../../lib/auth';

export default function SalesLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    setCurrentRole(null);
    navigate('/');
  };

  const navItems = [
    { id: 'Dashboard', path: '/sales', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'Clients', path: '/sales/clients', icon: Users, label: 'Clients' },
    { id: 'Products', path: '/sales/products', icon: Package, label: 'Products' },
    { id: 'Orders', path: '/sales/orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'Settings', path: '/sales/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-8 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Sales</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Client Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="text-sm font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all group">
            <LogIn size={20} className="text-slate-400 group-hover:text-blue-600 rotate-180" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sales Portal</h2>
          </div>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
