import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { dataService } from '../../services/data.service';
import { useAuth } from '../../contexts/AuthContext';
import { Play, Pause, LogOut, Clock, MapPin } from 'lucide-react';

export const DutyStatusBar = () => {
  const { profile } = useAuth();
  const [dutyStatus, setDutyStatus] = useState<string>('Off Duty');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Current user's duty status should ideally come from the profile context
    if (profile?.duty_status) {
      setDutyStatus(profile.duty_status);
    }
  }, [profile]);

  const toggleDuty = async () => {
    if (!profile?.id || isUpdating) return;
    
    setIsUpdating(true);
    const newStatus = dutyStatus === 'On Duty' ? 'Off Duty' : 'On Duty';
    
    try {
      await dataService.setDutyStatus(profile.id, newStatus as any);
      setDutyStatus(newStatus);
      
      // Log simple activity
      await dataService.logActivity({
        user_id: profile.id,
        action: newStatus === 'On Duty' ? 'Clocked In' : 'Clocked Out',
        entity_type: 'System',
        status: 'Completed',
        metadata: { timestamp: new Date().toISOString() }
      });

    } catch (err) {
      console.error('Failed to update duty status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${dutyStatus === 'On Duty' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
          {dutyStatus}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {dutyStatus === 'On Duty' && (
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full border border-slate-200">
            <Clock size={12} className="text-slate-400" />
            <span className="text-[10px] font-mono text-slate-600">08:45:12</span>
          </div>
        )}
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleDuty}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            dutyStatus === 'On Duty' 
            ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200 shadow-lg'
          }`}
        >
          {dutyStatus === 'On Duty' ? (
            <><Pause size={14} fill="currentColor" /> End Day</>
          ) : (
            <><Play size={14} fill="currentColor" /> Start Day</>
          )}
        </motion.button>
      </div>
    </div>
  );
};
