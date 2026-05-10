import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { dataService } from '../../services/data.service';
import { UnifiedActivityLog } from '../../types/database';
import { MapPin, Clock, CheckCircle2, AlertCircle, Phone, Package, Navigation } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  userId?: string;
  limit?: number;
  compact?: boolean;
}

export const ActivityFeed = ({ userId, limit = 10, compact = false }: ActivityFeedProps) => {
  const [activities, setActivities] = useState<UnifiedActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const logs = await dataService.getActivityLogs(userId, limit);
        setActivities(logs || []);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
    
    // Subscribe to changes
    const interval = setInterval(fetchActivities, 30000); // Poll every 30s as fallback
    return () => clearInterval(interval);
  }, [userId, limit]);

  const getIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('visit') || a.includes('meet')) return <MapPin size={14} className="text-emerald-500" />;
    if (a.includes('call')) return <Phone size={14} className="text-blue-500" />;
    if (a.includes('deliver') || a.includes('handover')) return <Package size={14} className="text-amber-500" />;
    if (a.includes('route') || a.includes('start')) return <Navigation size={14} className="text-indigo-500" />;
    return <Clock size={14} className="text-slate-400" />;
  };

  if (isLoading && activities.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-3/4" />
              <div className="h-2 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm italic">
        No recent activity recorded.
      </div>
    );
  }

  return (
    <div className={`space-y-6 relative ${!compact ? 'before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100' : ''}`}>
      {activities.map((activity, idx) => (
        <motion.div 
          key={activity.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex gap-4 relative"
        >
          <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center z-10 shadow-sm">
            {getIcon(activity.action)}
          </div>
          <div className={`flex-1 ${idx !== activities.length - 1 ? 'pb-4 border-b border-slate-50' : ''}`}>
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-800 leading-tight">
                {activity.action}
                {activity.metadata?.entity_name && (
                  <span className="text-slate-400 font-normal"> at </span>
                )}
                {activity.metadata?.entity_name && (
                  <span className="font-bold text-slate-900">{activity.metadata.entity_name}</span>
                )}
              </p>
              {activity.status === 'Completed' ? (
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-1" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0 mt-1.5" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-mono uppercase mt-1 flex items-center gap-1">
              <Clock size={10} />
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
