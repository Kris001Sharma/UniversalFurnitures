import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dataService } from '../../services/data.service';
import { AdminLogisticsMap } from './AdminLogisticsMap';
import { ActivityFeed } from '../unified/ActivityFeed';
import { 
  Users, 
  Truck, 
  TrendingUp, 
  X, 
  Activity, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const LogisticsDashboard = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveAgents = async () => {
    try {
      const liveAgents = await dataService.getLiveAgents();
      if (liveAgents) {
        setAgents(liveAgents.map((a: any) => ({
          id: a.id,
          name: a.name,
          role: a.role,
          duty_status: a.duty_status,
          latitude: a.user_tracking?.[0]?.latitude || a.last_known_latitude,
          longitude: a.user_tracking?.[0]?.longitude || a.last_known_longitude,
          status: a.status || 'Active'
        })).filter(a => a.latitude && a.longitude));
      }
    } catch (err) {
      console.error('Failed to fetch live agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAgents();
    const interval = setInterval(fetchLiveAgents, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="flex flex-col gap-6 pb-20 lg:pb-0 h-auto lg:h-[calc(100vh-200px)]">
      {/* Top Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
        {[
          { label: 'Live Agents', value: agents.length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'On Field', value: agents.filter(a => a.duty_status === 'On Duty').length, icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Avg Efficiency', value: '94%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Logistics Alerts', value: 3, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-slate-900 leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Main Map Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative min-h-[400px]">
          <AdminLogisticsMap 
            agents={agents} 
            onAgentClick={(id) => setSelectedAgentId(id)}
            selectedAgentId={selectedAgentId}
          />
        </div>

        {/* Selected Agent Live Panel */}
        <AnimatePresence>
          {selectedAgentId && selectedAgent ? (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full lg:w-96 bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col overflow-hidden max-h-[600px] lg:max-h-none"
            >
              {/* Panel Header */}
              <div className="p-6 border-b border-slate-50 relative">
                <button 
                  onClick={() => setSelectedAgentId(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg ${
                    selectedAgent.role === 'SALES' ? 'bg-emerald-600' : 'bg-orange-500'
                  }`}>
                    {(selectedAgent.name || '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedAgent.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${selectedAgent.duty_status === 'On Duty' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{selectedAgent.duty_status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Role</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      {selectedAgent.role === 'SALES' ? <Briefcase size={14} className="text-emerald-600" /> : <Truck size={14} className="text-orange-500" />}
                      {selectedAgent.role}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Session Time</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Clock size={14} className="text-indigo-600" />
                      04h 22m
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Feed in Drawer */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/30">
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Live Activity Feed
                   </h4>
                   <button className="text-[10px] font-bold text-indigo-600 hover:underline">View History</button>
                </div>
                
                <ActivityFeed userId={selectedAgent.id} />
              </div>

              {/* Panel Actions */}
              <div className="p-4 border-t border-slate-50 bg-white grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
                  Navigate To
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all">
                  Message Agent
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="w-80 bg-slate-50/50 border border-slate-100 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-sm font-bold text-slate-400">No Agent Selected</h3>
              <p className="text-xs text-slate-400 mt-2">Click on an agent marker on the map to view their real-time details and activity feed.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
