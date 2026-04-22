import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'Manufacturing': 'bg-blue-100 text-blue-700',
    'Delivered': 'bg-emerald-100 text-emerald-700',
    'Pending': 'bg-amber-100 text-amber-700',
    'High': 'bg-rose-100 text-rose-700',
    'Priority': 'bg-rose-100 text-rose-700',
    'New': 'bg-blue-100 text-blue-700',
    'Active': 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};
