import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { dataService } from '../../services/data.service';
import MapComponent from '../MapComponent';
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
  AlertCircle,
  Filter,
  Search,
  CheckCircle2,
  UserPlus,
  Star,
  Store
} from 'lucide-react';

export const LogisticsDashboard = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'agents' | 'customers'>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState({ latitude: 27.6687, longitude: 84.4264 });
  const [mapZoom, setMapZoom] = useState(13);
  const [isMapConfigOpen, setIsMapConfigOpen] = useState(true);
  
  // Map Visibility Filters
  const [filters, setFilters] = useState({
    salesActive: true,
    salesInactive: true,
    deliveryActive: true,
    deliveryInactive: true,
    clientsActive: true,
    clientsPriority: true,
    leadsNew: true
  });

  const fetchData = async () => {
    try {
      const [allAgents, allClients, allTasks, allOrders] = await Promise.all([
        supabase.from('user_profiles').select('*, user_tracking(*)').in('role', ['SALES', 'DELIVERY']),
        dataService.getClients(),
        supabase.from('delivery_tasks').select('*'),
        supabase.from('orders').select('*')
      ]);

      if (allTasks.data) {
        setTasks(allTasks.data);
      }

      if (allAgents.data) {
        setAgents(allAgents.data.map((a: any) => {
          const agentTasks = allTasks.data?.filter((t: any) => t.agent_id === a.id) || [];
          // Robust coordinate extraction
          const trackingLocation = Array.isArray(a.user_tracking) 
            ? [...a.user_tracking].sort((x: any, y: any) => 
                new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime()
              )[0]
            : null;

          return {
            ...a,
            latitude: trackingLocation?.latitude || a.last_known_latitude || a.latitude,
            longitude: trackingLocation?.longitude || a.last_known_longitude || a.longitude,
            isActive: a.duty_status === 'On Duty',
            taskCount: agentTasks.length
          };
        }));
      }

      if (allClients) {
        setClients(allClients.map((c: any) => ({
          ...c,
          orderCount: allOrders.data?.filter((o: any) => o.client_id === c.id).length || 0,
          isActive: c.interactions?.some((i: any) => {
            const lastDate = new Date(i.created_at);
            const now = new Date();
            return (now.getTime() - lastDate.getTime()) < (7 * 24 * 60 * 60 * 1000); // Active in last 7 days
          })
        })));
      }
    } catch (err) {
      console.error('Failed to fetch logistics data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredMarkers = useMemo(() => {
    const markers: any[] = [];

    // Add Agents
    agents.forEach(agent => {
      if (!agent.latitude || !agent.longitude) return;

      const isSales = agent.role === 'SALES';
      const isDelivery = agent.role === 'DELIVERY';
      const isActive = agent.duty_status === 'On Duty';
      
      const agentTasks = tasks.filter(t => t.agent_id === agent.id && t.status !== 'Completed');
      const upcomingTask = agentTasks.length > 0 ? agentTasks[0].task_name || 'In Progress' : (isActive ? 'On Duty (Free)' : 'Offline');

      if (isSales) {
        if ((isActive && filters.salesActive) || (!isActive && filters.salesInactive)) {
          markers.push({
            id: agent.id,
            latitude: agent.latitude,
            longitude: agent.longitude,
            color: isActive ? '#10b981' : '#94a3b8',
            type: 'SALES',
            isActive,
            label: agent.name,
            statusInfo: upcomingTask
          });
        }
      } else if (isDelivery) {
        if ((isActive && filters.deliveryActive) || (!isActive && filters.deliveryInactive)) {
          markers.push({
            id: agent.id,
            latitude: agent.latitude,
            longitude: agent.longitude,
            color: isActive ? '#6366f1' : '#94a3b8',
            type: 'DELIVERY',
            isActive,
            label: agent.name,
            statusInfo: upcomingTask
          });
        }
      }
    });

    // Add Clients/Leads
    clients.forEach(client => {
      const isPriority = client.status === 'Priority';
      const isNormalClient = (client.is_client === true || client.status === 'Active') && !isPriority;
      const isNew = client.status === 'New' || client.status === 'Lead';

      let show = false;
      if (isNormalClient && filters.clientsActive) show = true;
      if (isPriority && filters.clientsPriority) show = true;
      if (isNew && filters.leadsNew) show = true;

      if (show && client.latitude && client.longitude) {
        let color = '#f59e0b'; // Lead = Amber
        if (isNormalClient) color = '#0ea5e9'; // Active Client = Sky Blue
        if (isPriority) color = '#ef4444'; // Priority = Red

        const lastInteraction = client.interactions?.length > 0 
          ? `Last: ${client.interactions[client.interactions.length - 1].type}`
          : client.client_type || client.industry || client.type || 'Potential Cluster';

        markers.push({
          id: client.id,
          latitude: client.latitude,
          longitude: client.longitude,
          color,
          type: (isNormalClient || isPriority) ? 'CLIENT' : 'LEAD',
          category: client.client_type || client.industry || client.type || '', 
          label: client.name || client.company_name,
          statusInfo: lastInteraction
        });
      }
    });

    // Add Admin center
    markers.push({
      id: 'admin_center',
      latitude: 27.6687,
      longitude: 84.4264,
      color: '#000000',
      type: 'ADMIN',
      isActive: true,
      label: 'Admin Hub'
    });

    return markers;
  }, [agents, clients, filters]);

  const selectedItem = useMemo(() => {
    return agents.find(a => a.id === selectedId) || clients.find(c => c.id === selectedId);
  }, [selectedId, agents, clients]);

  const filteredSidebarList = useMemo(() => {
    if (activeSidebarTab === 'agents') {
      return agents.filter(a => (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return clients.filter(c => (c.name || c.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()));
    }
  }, [activeSidebarTab, agents, clients, searchQuery]);

  return (
    <div className="flex flex-col gap-4 pb-20 lg:pb-0 h-auto lg:h-[calc(100vh-180px)]">
      {/* Top Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-shrink-0">
        {[
          { label: 'Active Agents', value: agents.filter(a => a.isActive).length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Clients', value: clients.filter(c => c.isActive).length, icon: Star, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Avg Efficiency', value: '94%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'System Alerts', value: 3, icon: AlertCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-2">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon size={18} />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
              <div className="text-lg font-bold text-slate-900 leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
        {/* Main Map Area */}
        <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden relative min-h-[400px]">
          {/* Map Filters Overlay */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg border border-slate-100 shadow-lg w-56 transition-all">
              <button 
                onClick={() => setIsMapConfigOpen(!isMapConfigOpen)}
                className="w-full flex items-center justify-between mb-1 px-1 focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Map Configuration</span>
                </div>
                <ChevronRight size={14} className={`text-slate-400 transition-transform ${isMapConfigOpen ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isMapConfigOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden pt-2"
                  >
                    {/* Sales Section */}
                    <div className="space-y-2">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Sales Agents
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setFilters(f => ({ ...f, salesActive: !f.salesActive }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.salesActive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setFilters(f => ({ ...f, salesInactive: !f.salesInactive }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.salesInactive ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      Offline
                    </button>
                  </div>
                </div>

                {/* Delivery Section */}
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Delivery Agents
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setFilters(f => ({ ...f, deliveryActive: !f.deliveryActive }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.deliveryActive ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      On Task
                    </button>
                    <button 
                      onClick={() => setFilters(f => ({ ...f, deliveryInactive: !f.deliveryInactive }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.deliveryInactive ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      Standby
                    </button>
                  </div>
                </div>

                {/* Customers Section */}
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Customers & Leads
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setFilters(f => ({ ...f, clientsActive: !f.clientsActive }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.clientsActive ? 'bg-sky-50 border-sky-100 text-sky-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      Clients
                    </button>
                    <button 
                      onClick={() => setFilters(f => ({ ...f, clientsPriority: !f.clientsPriority }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.clientsPriority ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      Priority
                    </button>
                    <button 
                      onClick={() => setFilters(f => ({ ...f, leadsNew: !f.leadsNew }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.leadsNew ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      Leads
                    </button>
                  </div>
                </div>
                </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <MapComponent 
            center={mapCenter}
            zoom={mapZoom}
            markers={filteredMarkers}
            selectedId={selectedId}
            onMarkerClick={(m) => {
              setSelectedId(m.id);
              setMapCenter({ latitude: m.latitude, longitude: m.longitude });
              setMapZoom(16);
            }}
          />
        </div>

        {/* Sidebar Panel */}
        <div className="w-full lg:w-[320px] bg-white border border-slate-100 rounded-lg shadow-sm flex flex-col overflow-hidden h-[500px] lg:h-full">
          {/* Tabs */}
          <div className="flex border-b border-slate-50">
            <button 
              onClick={() => setActiveSidebarTab('agents')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeSidebarTab === 'agents' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/30' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              AGENTS
            </button>
            <button 
              onClick={() => setActiveSidebarTab('customers')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeSidebarTab === 'customers' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/30' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              CUSTOMERS
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-slate-50">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder={`Search ${activeSidebarTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSidebarTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-1"
              >
                {filteredSidebarList.length > 0 ? (
                  filteredSidebarList.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          onClick={() => {
                            if (isSelected) {
                              setSelectedId(null);
                              setMapZoom(13);
                            } else {
                              setSelectedId(item.id);
                              if (item.latitude && item.longitude) {
                                setMapCenter({ latitude: item.latitude, longitude: item.longitude });
                                setMapZoom(16);
                              }
                            }
                          }}
                          className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                            isSelected 
                              ? 'bg-rose-50 border-rose-100 shadow-sm' 
                              : 'border-transparent hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                            item.role === 'SALES' ? 'bg-emerald-500' : 
                            item.role === 'DELIVERY' ? 'bg-indigo-500' :
                            item.status === 'Priority' ? 'bg-rose-500' : 
                            (item.is_client === true || item.status === 'Active') ? 'bg-sky-500' : 'bg-amber-500'
                          }`}>
                            {(item.name || item.company_name || '?').charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">{item.name || item.company_name}</div>
                            <div className="text-[9px] text-slate-400 truncate flex items-center gap-1">
                              {item.role || item.status}
                              {item.isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                            </div>
                          </div>
                          <ChevronRight size={14} className={`transition-transform ${isSelected ? 'text-rose-500 rotate-90' : 'text-slate-300'}`} />
                        </button>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden px-3 pb-3"
                            >
                              <div className="bg-slate-50 rounded-2xl p-4 space-y-4 border border-slate-100">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Focus</div>
                                    <div className="text-[10px] font-bold text-slate-700 truncate">{item.role || item.status}</div>
                                  </div>
                                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Load</div>
                                    <div className="text-[10px] font-bold text-slate-700 truncate">
                                      {item.taskCount !== undefined ? `${item.taskCount} Tasks` : `${item.orderCount || 0} Orders`}
                                    </div>
                                  </div>
                                </div>

                                {activeSidebarTab === 'agents' ? (
                                  <div className="space-y-2">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                      <Activity size={12} /> Recent Movement
                                    </div>
                                    <ActivityFeed userId={item.id} />
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                      <Clock size={12} /> History
                                    </div>
                                    <div className="space-y-1.5">
                                      {item.interactions?.slice(0, 3).map((interaction: any) => (
                                        <div key={interaction.id} className="bg-white p-2 rounded-lg border border-slate-100 text-[10px]">
                                          <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                                            <span>{interaction.type}</span>
                                            <span className="text-[8px] text-slate-400">{new Date(interaction.created_at).toLocaleDateString()}</span>
                                          </div>
                                          <p className="text-slate-500 line-clamp-1">{interaction.notes}</p>
                                        </div>
                                      ))}
                                      {(!item.interactions || item.interactions.length === 0) && (
                                        <div className="text-[10px] text-slate-400 italic text-center py-2">No recent interactions</div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setMapCenter({ latitude: item.latitude, longitude: item.longitude });
                                      setMapZoom(18);
                                    }}
                                    className="flex-1 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold hover:bg-slate-800 transition-all"
                                  >
                                    Precision Zoom
                                  </button>
                                  <a 
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[9px] font-bold hover:bg-slate-50 transition-all"
                                  >
                                    Route
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                    <Search size={32} className="mb-2 text-slate-300" />
                    <p className="text-xs font-bold text-slate-400">No {activeSidebarTab} found</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          </div>
      </div>
    </div>
  );
};
