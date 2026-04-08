import React from 'react';
import { Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { MOCK_ORGS, MOCK_ORDERS } from '../../../lib/mockData';

export default function SalesPage() {
  const activeClients = MOCK_ORGS.filter(o => o.status === 'Active' || o.status === 'Priority').length;
  const pendingOrders = MOCK_ORDERS.filter(o => o.category === 'Active').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{activeClients}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Clients</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <ShoppingCart size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{pendingOrders}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Pending Orders</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">$45,200</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Monthly Sales</div>
        </div>
      </div>
    </div>
  );
}
