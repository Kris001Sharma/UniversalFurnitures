import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
          <ShieldAlert size={40} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mt-2">You do not have permission to view this page.</p>
        </div>
        <Link to="/" className="block w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">
          Return to Login
        </Link>
      </div>
    </div>
  );
}
