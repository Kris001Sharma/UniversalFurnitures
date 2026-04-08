import React from 'react';
import { Factory, AlertCircle, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { MOCK_ORDERS, MOCK_ACTIVE_ORDERS } from '../../../lib/mockData';

export default function SupervisorPage() {
  const activeOrders = MOCK_ORDERS.filter(o => o.category === 'Active').length;
  const newOrders = MOCK_ORDERS.filter(o => o.category === 'Open').length;
  const priorityOrders = MOCK_ORDERS.filter(o => o.status === 'Metal Forging' || o.status === 'Wood Cutting').length; // Just an example logic for priority

  return (
    <div className="space-y-8">
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Factory size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{activeOrders}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Orders</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Clock size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{newOrders}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">New Orders</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <AlertCircle size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{priorityOrders}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Priority Orders</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Calendar size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">3</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Due Next Week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Manufacturing Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Manufacturing</h2>
              <p className="text-sm text-slate-500">Timeline tracking for current orders</p>
            </div>
          </div>

          <div className="space-y-6">
            {MOCK_ACTIVE_ORDERS.map((order) => (
              <div key={order.orderId} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-lg">{order.orderId}</h3>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">In Manufacturing</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Customer: {order.customer}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{order.completedUnits} / {order.totalUnits} Units Completed</div>
                    <div className="w-48 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${(order.completedUnits / order.totalUnits) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Unit Level Progress</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {order.items.map((unit) => (
                      <div key={unit.unitId} className={`p-4 rounded-2xl border transition-all ${
                        unit.status === 'Completed' ? 'bg-emerald-50 border-emerald-100' :
                        unit.status === 'In Progress' ? 'bg-indigo-50 border-indigo-100' :
                        'bg-slate-50 border-slate-100'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-slate-400">Unit {unit.unitId}</span>
                          {unit.status === 'Completed' ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : unit.status === 'In Progress' ? (
                            <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Clock size={14} className="text-slate-300" />
                          )}
                        </div>
                        <div className={`text-xs font-bold ${
                          unit.status === 'Completed' ? 'text-emerald-700' :
                          unit.status === 'In Progress' ? 'text-indigo-700' :
                          'text-slate-500'
                        }`}>{unit.stage}</div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">{unit.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-indigo-600">{order.totalUnits - order.completedUnits} units remaining</span> to finish this order.
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">View Detailed Timeline</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priorities & Due Soon */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Priorities</h3>
            <div className="space-y-4">
              {MOCK_ORDERS.filter(o => o.category === 'Active').slice(0, 3).map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{order.id}</h4>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded uppercase">{order.status}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{order.orgName}</p>
                  <p className="text-[10px] font-bold text-rose-600 uppercase">Due: {order.expectedDelivery}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Due Until Next Week</h3>
            <div className="space-y-4">
              {MOCK_ORDERS.filter(o => o.category === 'Open' || o.category === 'Active').slice(0, 4).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{order.id}</h4>
                    <p className="text-xs text-slate-500">{order.orgName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">{order.expectedDelivery}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
