import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutGrid, DollarSign, FileText, Settings, LogIn } from 'lucide-react';
import { setCurrentRole } from '../../../lib/auth';

export default function AccountsLayout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    setCurrentRole(null);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-8 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Accounts</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Financial Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link to="/accounts" className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 bg-emerald-600 text-white shadow-lg shadow-emerald-100">
            <LayoutGrid size={20} />
            <span className="text-sm font-bold">Dashboard</span>
          </Link>
          <div className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-slate-500 hover:bg-slate-50">
            <DollarSign size={20} />
            <span className="text-sm font-bold">Transactions</span>
          </div>
          <div className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-slate-500 hover:bg-slate-50">
            <FileText size={20} />
            <span className="text-sm font-bold">Reports</span>
          </div>
          <div className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-slate-500 hover:bg-slate-50">
            <Settings size={20} />
            <span className="text-sm font-bold">Settings</span>
          </div>
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all group">
            <LogIn size={20} className="text-slate-400 group-hover:text-emerald-600 rotate-180" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Accounts Portal</h2>
          </div>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
