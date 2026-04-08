import React from 'react';
import { TrendingUp, ShoppingBasket, Users, Activity } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">$124,500</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Revenue</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ShoppingBasket size={24} />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+8%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">1,240</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Orders</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">24 Active</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">45</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Sales Agents</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <Activity size={24} />
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">99.9% Uptime</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">System</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Health Status</div>
        </div>
      </div>
    </div>
  );
}
