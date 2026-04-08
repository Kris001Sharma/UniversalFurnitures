import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutGrid, DollarSign, Users, Truck } from 'lucide-react';
import { UserRole } from '../types';
import { setCurrentRole } from '../lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (role: UserRole, path: string) => {
    setCurrentRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Select Role Zone</h1>
          <p className="text-slate-500">Choose a role to access its dedicated application zone.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Admin Role */}
          <button 
            onClick={() => handleLogin('ADMIN', '/admin')}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all text-left flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-slate-200">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Admin</h2>
            <p className="text-sm text-slate-500 flex-1">System configuration, user management, and global oversight.</p>
          </button>

          {/* Supervisor Role */}
          <button 
            onClick={() => handleLogin('SUPERVISOR', '/supervisor')}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
              <LayoutGrid size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Supervisor</h2>
            <p className="text-sm text-slate-500 flex-1">Production lines, inventory management, and active manufacturing.</p>
          </button>

          {/* Accounts Role */}
          <button 
            onClick={() => handleLogin('ACCOUNTS', '/accounts')}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all text-left flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-100">
              <DollarSign size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Accounts</h2>
            <p className="text-sm text-slate-500 flex-1">Financial tracking, transactions, and revenue reporting.</p>
          </button>

          {/* Sales Role */}
          <button 
            onClick={() => handleLogin('SALES', '/sales')}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-100">
              <Users size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sales</h2>
            <p className="text-sm text-slate-500 flex-1">Client management, product catalog, and order processing.</p>
          </button>

          {/* Delivery Role */}
          <button 
            onClick={() => handleLogin('DELIVERY', '/delivery')}
            className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all text-left flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-100">
              <Truck size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delivery</h2>
            <p className="text-sm text-slate-500 flex-1">Order handover, client delivery, and route monitoring.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
