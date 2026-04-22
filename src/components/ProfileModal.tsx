import React from 'react';
import { Camera, LogIn, X } from 'lucide-react';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  onSignOut, 
  stats 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSignOut: () => void;
  stats: { label: string; value: string | number }[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="flex flex-col items-center mt-4">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src="https://picsum.photos/seed/agent/200/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-4">Agent 4029</h2>
          <p className="text-sm text-slate-500">Senior Representative</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={onSignOut}
          className="w-full py-3.5 bg-rose-50 text-rose-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
        >
          <LogIn size={18} className="rotate-180" /> Sign Out
        </button>
      </div>
    </div>
  );
}
