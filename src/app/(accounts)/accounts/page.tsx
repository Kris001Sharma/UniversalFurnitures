import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../../../lib/mockData';

export default function AccountsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">$245,800</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Balance</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ArrowUpRight size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">$45,200</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Monthly Income</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <ArrowDownRight size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">$12,400</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Monthly Expenses</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{tx.description}</td>
                  <td className={`px-6 py-4 font-bold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                      tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
