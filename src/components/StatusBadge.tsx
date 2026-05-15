import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'Draft': 'bg-slate-100 text-slate-600',
    'Received': 'bg-sky-100 text-sky-700',
    'In Production': 'bg-amber-100 text-amber-700',
    'Packaging': 'bg-purple-100 text-purple-700',
    'Ready for Delivery': 'bg-emerald-100 text-emerald-700',
    'Out for Delivery': 'bg-blue-100 text-blue-700',
    'Delivered': 'bg-emerald-600/10 text-emerald-600',
    'Closed': 'bg-slate-200 text-slate-500',
    'Priority': 'bg-rose-100 text-rose-700',
    'New': 'bg-blue-50 text-blue-600',
    'Active': 'bg-emerald-50 text-emerald-600',
    'Pending': 'bg-slate-50 text-slate-400',
    'Paid': 'bg-emerald-50 text-emerald-600',
    'InProgress': 'bg-amber-50 text-amber-600'
  };
  return (
    <span className={`status-tag ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};
