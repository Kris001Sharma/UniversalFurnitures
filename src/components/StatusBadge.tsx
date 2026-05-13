import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-700',
    'Active': 'bg-emerald-100 text-emerald-700',
    'Draft': 'bg-slate-100 text-slate-600',
    'Queued': 'bg-slate-100 text-slate-600',
    'Received': 'bg-sky-100 text-sky-700',
    'In Production': 'bg-indigo-100 text-indigo-700',
    'Packaging': 'bg-amber-100 text-amber-700',
    'Ready for Delivery': 'bg-emerald-100 text-emerald-700',
    'Ready for Dispatch': 'bg-emerald-100 text-emerald-700',
    'Out for Delivery': 'bg-indigo-100 text-indigo-700',
    'Delivered': 'bg-emerald-100 text-emerald-700',
    'Closed': 'bg-slate-100 text-slate-600',
    'Manufacturing': 'bg-blue-100 text-blue-700',
    'Pending': 'bg-amber-100 text-amber-700',
    'High': 'bg-rose-100 text-rose-700',
    'Priority': 'bg-rose-100 text-rose-700',
  };
  return (
    <span className={`status-tag ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};
