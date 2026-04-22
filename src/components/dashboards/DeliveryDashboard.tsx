import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import ProfileModal from '../ProfileModal';
import React, { useState, useEffect, useRef } from 'react';
import { LogIn, X, Bell, UserCircle, MessageSquare, ClipboardList, AlertCircle, LayoutGrid, Users, Package, Clock, Plus, Search, MapPin, Camera, ChevronRight, CheckCircle2, MoreVertical, Phone, Mail, Calendar, ArrowLeft, Filter, Truck, ArrowUp, ArrowDown, Crosshair, Navigation, Maximize, Minimize, Compass } from 'lucide-react';
import { DeliveryTask } from '../../types';
import { dataService } from '../../services/data.service';
const DeliveryMap = React.lazy(() => import('../../DeliveryMap'));

const DeliveryDashboard = ({ onBack, isAdminView = false }: { onBack: () => void, isAdminView?: boolean }) => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Active' | 'Route'>('Tasks');
  const [view, setView] = useState<'List' | 'Add' | 'Detail'>('List');
  const [tasks, setTasks] = useState<DeliveryTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [receivedInputs, setReceivedInputs] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'All' | 'Open' | 'In Progress' | 'Delivered'>('All');
  const [sortBy, setSortBy] = useState<'Priority' | 'Date'>('Priority');
  const [expandedRouteTask, setExpandedRouteTask] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTaskId, setNavigatingTaskId] = useState<string | null>(null);
  const [mapCenterTrigger, setMapCenterTrigger] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await dataService.getDeliveryTasks();
        if (fetchedTasks && fetchedTasks.length > 0) {
          // If not admin, only show tasks specifically assigned to this user role profile
          const assignedTasks = isAdminView ? fetchedTasks : fetchedTasks.filter((t: any) => t.assigned_to === profile?.id || !t.assigned_to);

          const mappedTasks = assignedTasks.map((t: any) => ({
             id: t.id,
             orderId: t.order_id,
             orgId: t.org_id,
             orgName: t.customer_name || 'Walk-in Customer',
             address: t.address || t.destination,
             status: t.status || 'Open',
             priority: t.priority || 'Normal',
             itemsExpected: t.items_to_deliver || 1,
             itemsReceived: t.items_received,
             contactName: t.contact_name || 'N/A',
             contactPhone: t.contact_phone || 'N/A',
             dueDate: t.due_date || t.date || new Date().toISOString().split('T')[0],
             locationTagged: t.location_tagged || false,
             latitude: t.latitude,
             longitude: t.longitude
          }));
          setTasks(mappedTasks);
        }
      } catch (err) {
        console.error("Failed to fetch delivery tasks:", err);
      }
    };
    if (profile || isAdminView) fetchTasks();
  }, [profile, isAdminView]);

  const [newTask, setNewTask] = useState<Partial<DeliveryTask>>({
    priority: 'Normal',
    status: 'Open'
  });

  const handleHandover = async (taskId: string) => {
    const received = receivedInputs[taskId];
    if (received) {
      try {
        await dataService.updateDeliveryTask(taskId, { items_received: parseInt(received, 10) });
        setTasks(tasks.map(t => t.id === taskId ? { ...t, itemsReceived: parseInt(received, 10) } : t));
      } catch (err) { console.error('Failed to update handover:', err); }
    }
  };

  const handleTagLocation = async (taskId: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setUserLocation(loc);
          localStorage.setItem('deliveryUserLocation', JSON.stringify(loc));
          try {
            await dataService.updateDeliveryTask(taskId, { 
              location_tagged: true, 
              latitude: loc.latitude, 
              longitude: loc.longitude 
            });
            setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true, taggedLatitude: loc.latitude, taggedLongitude: loc.longitude } : t));
          } catch(err) { console.error('Failed to update location:', err); }
        },
        async (error) => {
          console.error("Geolocation Error:", error.message);
          // Fallback to cached or IP location if GPS fails
          if (userLocation) {
            try {
              await dataService.updateDeliveryTask(taskId, { location_tagged: true, latitude: userLocation.latitude, longitude: userLocation.longitude });
              setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true, taggedLatitude: userLocation.latitude, taggedLongitude: userLocation.longitude } : t));
            } catch(err) {}
          } else {
            handleGetLocation(); // Try to get IP location
            try {
              await dataService.updateDeliveryTask(taskId, { location_tagged: true });
              setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true } : t));
            } catch(err) {}
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      try {
        await dataService.updateDeliveryTask(taskId, { location_tagged: true });
        setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true } : t));
      } catch(err) {}
    }
  };

  const handleUploadProof = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); // Mock upload wrapper
      setTasks(tasks.map(t => t.id === taskId ? { ...t, proofImage: imageUrl } : t));
    }
  };

  const handleMarkDelivered = async (taskId: string) => {
    try {
      await dataService.updateDeliveryTask(taskId, { status: 'Delivered' });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Delivered' } : t));
      // If no more active tasks, switch back to Tasks tab
      if (tasks.filter(t => t.status === 'In Progress' && t.id !== taskId).length === 0) {
        setActiveTab('Tasks');
      }
    } catch(err) { console.error('Failed to mark delivered:', err); }
  };

  const handleStartDelivery = async (taskId: string) => {
    try {
      await dataService.updateDeliveryTask(taskId, { status: 'In Progress' });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'In Progress' } : t));
      setActiveTab('Active');
    } catch(err) { console.error('Failed to start delivery:', err); }
  };

  const handleCancelTask = async (taskId: string) => {
    try {
      await dataService.updateDeliveryTask(taskId, { status: 'Open' });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Open' } : t));
    } catch(err) { console.error('Failed to cancel delivery:', err); }
  };

  const fetchIpLocation = async () => {
    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await response.json();
      if (data && data.latitude && data.longitude) {
        const loc = { latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) };
        setUserLocation(loc);
        localStorage.setItem('deliveryUserLocation', JSON.stringify(loc));
      } else {
        throw new Error("Invalid IP location data");
      }
    } catch (err) {
      console.error("IP Location fallback failed", err);
      // Fallback to Kathmandu
      setUserLocation({ latitude: 27.7172, longitude: 85.3240 });
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(loc);
          localStorage.setItem('deliveryUserLocation', JSON.stringify(loc));
          setMapCenterTrigger(prev => prev + 1);
        },
        (error) => {
          console.error("Geolocation Error:", error.message, "Code:", error.code);
          // Fallback to Kathmandu if geolocation fails to keep it focused on Nepal
          const fallbackLoc = { latitude: 27.7172, longitude: 85.3240 };
          setUserLocation(fallbackLoc);
          setMapCenterTrigger(prev => prev + 1);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      const fallbackLoc = { latitude: 27.7172, longitude: 85.3240 };
      setUserLocation(fallbackLoc);
      setMapCenterTrigger(prev => prev + 1);
    }
  };

  useEffect(() => {
    const cachedLoc = localStorage.getItem('deliveryUserLocation');
    if (cachedLoc) {
      try {
        const parsed = JSON.parse(cachedLoc);
        if (parsed && typeof parsed === 'object') {
          if ('lat' in parsed) {
            setUserLocation({ latitude: parsed.lat as number, longitude: parsed.lng as number });
          } else {
            setUserLocation(parsed as any);
          }
        }
      } catch (e) {
        handleGetLocation();
      }
    } else {
      handleGetLocation();
    }
  }, []);

  const handleStartNavigation = (taskId?: string) => {
    setIsNavigating(true);
    setIsMapFullscreen(true);
    setActiveTab('Route');
    if (taskId) {
      setNavigatingTaskId(taskId);
    } else {
      setNavigatingTaskId(null);
    }
    
    // Check if we have a valid cached location, if not, fetch it
    const cachedLoc = localStorage.getItem('deliveryUserLocation');
    if (!cachedLoc) {
      handleGetLocation();
    } else {
      setMapCenterTrigger(prev => prev + 1);
    }
  };

  const handleAddTask = () => {
    if (newTask.orderId && newTask.orgName) {
      const task: DeliveryTask = {
        id: `DT-${Math.floor(Math.random() * 1000)}`,
        orderId: newTask.orderId || '',
        orgId: `ORG-${Math.floor(Math.random() * 100)}`,
        orgName: newTask.orgName || '',
        address: newTask.address || 'Pending Address',
        status: 'Open',
        priority: newTask.priority as 'Normal' | 'High' || 'Normal',
        itemsExpected: newTask.itemsExpected || 1,
        contactName: newTask.contactName || 'Pending Contact',
        contactPhone: newTask.contactPhone || 'Pending Phone',
        dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      };
      setTasks([...tasks, task]);
      setView('List');
      setNewTask({ priority: 'Normal', status: 'Open' });
    }
  };

  const renderTasksList = () => {
    let filteredTasks = tasks.filter(t => 
      (filter === 'All' || t.status === filter) &&
      ((t.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
       (t.orgName || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    if (sortBy === 'Priority') {
      filteredTasks.sort((a, b) => (a.priority === 'High' ? -1 : 1) - (b.priority === 'High' ? -1 : 1));
    } else {
      filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    const todayDate = new Date();
    const nextWeekDate = new Date(todayDate);
    nextWeekDate.setDate(todayDate.getDate() + 7);
    const todayStr = todayDate.toISOString().split('T')[0];
    const nextWeekStr = nextWeekDate.toISOString().split('T')[0];

    // Priorities: High priority, sorted by nearest date first
    const priorities = filteredTasks
      .filter(t => t.priority === 'High')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
    // Due This Week: Not high priority, due within next 7 days
    const dueThisWeek = filteredTasks
      .filter(t => t.priority !== 'High' && t.dueDate >= todayStr && t.dueDate <= nextWeekStr)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
    const otherTasks = filteredTasks.filter(t => !priorities.includes(t) && !dueThisWeek.includes(t));

    return (
      <div className="space-y-6">
        <header className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Delivery</h1>
              <p className="text-sm text-slate-500">Welcome back, {profile?.full_name || 'Agent'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
              <Bell size={18} />
            </button>
            <div 
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src="https://picsum.photos/seed/agent/100/100" alt="Profile" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Tasks</h2>
          <button 
            onClick={() => setView('Add')}
            className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search order ID or client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Open', 'In Progress', 'Delivered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {priorities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-500" /> Priorities
              </h3>
              {priorities.map(task => renderTaskCard(task))}
            </div>
          )}

          {dueThisWeek.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} className="text-blue-500" /> Due This Week
              </h3>
              {dueThisWeek.map(task => renderTaskCard(task))}
            </div>
          )}

          {otherTasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Other Tasks</h3>
              {otherTasks.map(task => renderTaskCard(task))}
            </div>
          )}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
              <ClipboardList size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No tasks found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTaskCard = (task: DeliveryTask) => (
    <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm">{task.orderId}</h3>
            {task.priority === 'High' && (
              <span className="text-[8px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded uppercase tracking-wider">Priority</span>
            )}
          </div>
          <p className="text-xs text-slate-600">{task.orgName}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
          task.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
          task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
          'bg-amber-50 text-amber-600'
        }`}>
          {task.status}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-[10px] text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <Package size={12} /> {task.itemsExpected} items
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={12} /> {task.dueDate}
        </div>
      </div>

      {task.status === 'Open' && (
        <button 
          onClick={() => handleStartDelivery(task.id)}
          className="w-full py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors"
        >
          Start Delivery
        </button>
      )}
      {task.status === 'In Progress' && (
        <button 
          onClick={() => setActiveTab('Active')}
          className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          Resume Delivery
        </button>
      )}
    </div>
  );

  const renderAddTask = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setView('List')}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">New Task</h2>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Order ID</label>
          <input 
            type="text" 
            value={newTask.orderId || ''}
            onChange={e => setNewTask({...newTask, orderId: e.target.value})}
            placeholder="e.g. ORD-1234"
            className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Client Name</label>
          <input 
            type="text" 
            value={newTask.orgName || ''}
            onChange={e => setNewTask({...newTask, orgName: e.target.value})}
            placeholder="Client Organization"
            className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Delivery Address</label>
          <input 
            type="text" 
            value={newTask.address || ''}
            onChange={e => setNewTask({...newTask, address: e.target.value})}
            placeholder="Full Address"
            className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Items Expected</label>
            <input 
              type="number" 
              value={newTask.itemsExpected || ''}
              onChange={e => setNewTask({...newTask, itemsExpected: parseInt(e.target.value, 10)})}
              className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Priority</label>
            <select 
              value={newTask.priority || 'Normal'}
              onChange={e => setNewTask({...newTask, priority: e.target.value as 'Normal' | 'High'})}
              className="w-full mt-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleAddTask}
          disabled={!newTask.orderId || !newTask.orgName}
          className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Task
        </button>
      </div>
    </div>
  );

  const renderActiveTask = () => {
    const activeTasks = tasks.filter(t => t.status === 'In Progress');

    if (activeTasks.length === 0) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Active Tasks</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">No Active Tasks</h4>
            <p className="text-sm text-slate-500 mt-2">Select a task from the Tasks tab to begin delivery.</p>
            <button 
              onClick={() => setActiveTab('Tasks')}
              className="mt-6 px-6 py-3 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors"
            >
              View Tasks
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <header className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('Tasks')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Active Tasks</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
            <img src="https://picsum.photos/seed/agent/100/100" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        </header>
        
        {activeTasks.map(activeTask => (
          <div key={activeTask.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-50 bg-orange-50/30">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">{activeTask.orderId}</h4>
                  {activeTask.priority === 'High' && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded uppercase tracking-wider">Priority</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!activeTask.itemsReceived && (
                    <button 
                      onClick={() => handleCancelTask(activeTask.id)}
                      className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {activeTask.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600">{activeTask.orgName}</p>
            </div>

            <div className="p-4 space-y-4">
              {/* Step 1: Handover */}
              <div className={`p-4 rounded-2xl border ${activeTask.itemsReceived ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeTask.itemsReceived ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>1</div>
                  Warehouse Handover
                </h5>
                <div className="pl-7">
                  <p className="text-[11px] text-slate-500 mb-2">Expected Items: <strong className="text-slate-900">{activeTask.itemsExpected}</strong></p>
                  {!activeTask.itemsReceived ? (
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        placeholder="Items received..." 
                        className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        value={receivedInputs[activeTask.id] || ''}
                        onChange={(e) => setReceivedInputs({...receivedInputs, [activeTask.id]: e.target.value})}
                      />
                      <button 
                        onClick={() => handleHandover(activeTask.id)}
                        className="shrink-0 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Confirmed {activeTask.itemsReceived} items received.
                    </p>
                  )}
                </div>
              </div>

              {/* Step 2: Client Details & Navigation */}
              {activeTask.itemsReceived && (
                <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100">
                  <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[10px]">2</div>
                    Client Destination
                  </h5>
                  <div className="pl-7">
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin size={10} /> Address</p>
                        <p className="text-xs font-medium text-slate-900 mt-0.5">{activeTask.address}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><UserCircle size={10} /> Contact</p>
                        <p className="text-xs font-medium text-slate-900 mt-0.5">{activeTask.contactName}</p>
                        <p className="text-[11px] text-slate-500">{activeTask.contactPhone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStartNavigation(activeTask.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-200 transition-colors"
                        >
                          <MapPin size={14} /> Map View
                        </button>
                        <button 
                          onClick={() => {
                            if (activeTask.latitude && activeTask.longitude) {
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeTask.latitude},${activeTask.longitude}`, '_blank');
                            } else {
                              alert("Destination coordinates not available.");
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-colors"
                        >
                          <Navigation size={14} /> Navigate
                        </button>
                      </div>
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors">
                        <MessageSquare size={14} /> Admin Chat
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Delivery Confirmation */}
              {activeTask.itemsReceived && (
                <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100">
                  <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-[10px]">3</div>
                    Delivery Confirmation
                  </h5>
                  <div className="pl-7">
                    <div className="flex flex-col gap-2 mb-4">
                      <button 
                        onClick={() => handleTagLocation(activeTask.id)}
                        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          activeTask.locationTagged ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <MapPin size={14} /> {activeTask.locationTagged ? `Tagged: ${activeTask.taggedLatitude?.toFixed(4)}, ${activeTask.taggedLongitude?.toFixed(4)}` : 'Tag Geolocation'}
                      </button>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleUploadProof(activeTask.id, e)}
                        />
                        <button className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          activeTask.proofImage ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}>
                          <Camera size={14} /> {activeTask.proofImage ? 'Proof Uploaded' : 'Upload Proof'}
                        </button>
                      </div>
                      {activeTask.proofImage && (
                        <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                          <img src={activeTask.proofImage} alt="Delivery Proof" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleMarkDelivered(activeTask.id)}
                      disabled={!activeTask.locationTagged}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTask.locationTagged 
                          ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-200 active:scale-[0.98]' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Logs / Remarks */}
              {activeTask.itemsReceived && (
                <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100">
                  <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px]">4</div>
                    Logs & Remarks (Optional)
                  </h5>
                  <div className="pl-7">
                    <textarea 
                      placeholder="Add any additional notes or remarks here..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-h-[80px] resize-none"
                      value={activeTask.logs || ''}
                      onChange={(e) => setTasks(tasks.map(t => t.id === activeTask.id ? { ...t, logs: e.target.value } : t))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRouteOptimization = () => {
    const todayDate = new Date();
    const nextWeekDate = new Date(todayDate);
    nextWeekDate.setDate(todayDate.getDate() + 7);
    const todayStr = todayDate.toISOString().split('T')[0];
    const nextWeekStr = nextWeekDate.toISOString().split('T')[0];

    const openTasks = tasks.filter(t => 
      (t.status === 'Open' || t.status === 'In Progress') &&
      (t.priority === 'High' || (t.dueDate >= todayStr && t.dueDate <= nextWeekStr))
    );
    
    // Minimalistic route optimization: sort by priority then by a mock distance (just using ID for now)
    const optimizedTasks = [...openTasks].sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;
      return a.id.localeCompare(b.id);
    });

    const inProgressTasks = optimizedTasks.filter(t => t.status === 'In Progress');
    
    // If navigating to a specific task, only show route to that task
    const targetTasks = navigatingTaskId 
      ? inProgressTasks.filter(t => t.id === navigatingTaskId)
      : inProgressTasks;

    const routePoints = userLocation 
      ? [userLocation, ...targetTasks.filter(t => t.latitude && t.longitude).map(t => ({ latitude: t.latitude!, longitude: t.longitude! }))]
      : targetTasks.filter(t => t.latitude && t.longitude).map(t => ({ latitude: t.latitude!, longitude: t.longitude! }));

    return (
      <div className={`space-y-6 ${isMapFullscreen ? 'fixed inset-0 z-50 bg-slate-50 p-0 m-0' : ''}`}>
        {!isMapFullscreen && (
          <header className="flex items-center gap-4 mb-2">
            <button 
              onClick={() => setActiveTab('Tasks')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Route Optimization</h2>
          </header>
        )}
        
        <div className={`bg-white border border-slate-100 shadow-sm overflow-hidden relative z-0 ${isMapFullscreen ? 'h-full w-full rounded-none' : 'rounded-3xl'}`}>
          <div className={`w-full overflow-hidden ${isMapFullscreen ? 'h-full' : 'h-48'}`}>
            <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">Loading map...</div>}>
              {activeTab === 'Route' && (
                <DeliveryMap 
                  userLocation={userLocation}
                  isMapFullscreen={isMapFullscreen}
                  mapCenterTrigger={mapCenterTrigger}
                  routePoints={routePoints}
                  navigatingTaskId={navigatingTaskId}
                  targetTasks={targetTasks}
                  optimizedTasks={optimizedTasks}
                  handleStartDelivery={handleStartDelivery}
                />
              )}
            </React.Suspense>
          </div>
          
          {/* Turn-by-Turn Navigation Overlay */}
          {isNavigating && isMapFullscreen && (
            <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <ArrowUp size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Head North</h3>
                <p className="text-slate-300 text-sm">
                  towards {targetTasks[0]?.orgName || 'next destination'}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-emerald-400">12 min</div>
                <div className="text-xs text-slate-400">2.4 km</div>
              </div>
            </div>
          )}

          {/* Exit Navigation Button */}
          {isNavigating && isMapFullscreen && (
            <button 
              onClick={() => {
                setIsNavigating(false);
                setNavigatingTaskId(null);
                setIsMapFullscreen(false);
              }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-rose-600 transition-colors"
            >
              <X size={20} /> Exit Navigation
            </button>
          )}

          {/* Map Controls Overlay */}
          <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
            {isMapFullscreen && (
              <>
                <button 
                  onClick={handleGetLocation}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-500 transition-colors"
                >
                  <Crosshair size={18} />
                </button>
                <button 
                  onClick={() => setMapCenterTrigger(prev => prev + 1)}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-500 transition-colors"
                >
                  <Compass size={18} />
                </button>
              </>
            )}
            <button 
              onClick={() => {
                if (isMapFullscreen) {
                  setIsMapFullscreen(false);
                  setIsNavigating(false);
                  setNavigatingTaskId(null);
                } else {
                  setIsMapFullscreen(true);
                }
              }}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-500 transition-colors"
            >
              {isMapFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>

        {!isMapFullscreen && (
          <>
            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-900">Suggested Route</h3>
                    <p className="text-xs text-orange-700">Optimized for priorities & due dates</p>
                  </div>
                </div>
                {inProgressTasks.length > 0 && (
                  <button 
                    onClick={() => handleStartNavigation()}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isNavigating ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-white text-orange-600 border border-orange-200'
                    }`}
                  >
                    {isNavigating ? 'Navigating...' : 'Start Nav'}
                  </button>
                )}
              </div>
            </div>

            <div className="relative pl-4 border-l-2 border-slate-100 space-y-6 mt-6 ml-4">
              {optimizedTasks.map((task, index) => (
                <div key={task.id} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                    task.status === 'In Progress' ? 'bg-blue-500' : (index === 0 ? 'bg-orange-500' : 'bg-slate-300')
                  }`} />
                  <div 
                    className={`bg-white p-4 rounded-2xl border shadow-sm cursor-pointer transition-all ${
                      task.status === 'In Progress' ? 'border-blue-200' : 'border-slate-100 hover:border-orange-200'
                    }`}
                    onClick={() => setExpandedRouteTask(expandedRouteTask === task.id ? null : task.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900">{task.orgName}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Stop {index + 1}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{task.address}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {task.orderId}
                      </span>
                      {task.priority === 'High' && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                          Priority
                        </span>
                      )}
                      {task.status === 'In Progress' && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          In Progress
                        </span>
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedRouteTask === task.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          className="overflow-hidden border-t border-slate-100 pt-3"
                        >
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><UserCircle size={12} /> Contact</p>
                              <p className="text-xs font-medium text-slate-900 mt-1">{task.contactName}</p>
                              <p className="text-xs text-slate-500">{task.contactPhone}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartDelivery(task.id);
                                }}
                                className="flex-1 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors"
                              >
                                {task.status === 'In Progress' ? 'Resume' : 'Start'} Delivery
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
              {optimizedTasks.length === 0 && (
                <p className="text-sm text-slate-500">No pending deliveries to route.</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  if (isAdminView) {
    return (
      <div className="space-y-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Tasks', 'Active', 'Route'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setView('List'); }}
              className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Tasks' && (view === 'List' ? renderTasksList() : renderAddTask())}
            {activeTab === 'Active' && renderActiveTask()}
            {activeTab === 'Route' && renderRouteOptimization()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <main className="max-w-md mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Tasks' && (view === 'List' ? renderTasksList() : renderAddTask())}
            {activeTab === 'Active' && renderActiveTask()}
            {activeTab === 'Route' && renderRouteOptimization()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {[
          { id: 'Tasks', icon: ClipboardList, label: 'Tasks', action: () => { setActiveTab('Tasks'); setView('List'); } },
          { id: 'Active', icon: Truck, label: 'Active', action: () => { setActiveTab('Active'); setView('List'); }, badge: tasks.filter(t => t.status === 'In Progress').length },
          { id: 'Route', icon: MapPin, label: 'Route', action: () => { setActiveTab('Route'); setView('List'); } },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button 
              key={tab.id}
              onClick={tab.action}
              className="relative flex flex-col items-center justify-center py-1 px-4 transition-all duration-300 outline-none group"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabDelivery"
                  className="absolute inset-0 bg-orange-50 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative">
                <Icon 
                  size={isActive ? 22 : 20} 
                  className={`transition-all duration-300 ${isActive ? 'text-orange-600 scale-110' : 'text-slate-400 group-hover:text-slate-500'}`} 
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-[6px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white transition-colors ${isActive ? 'bg-orange-600' : 'bg-orange-500'}`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-bold uppercase mt-1 tracking-wider transition-all duration-300 ${isActive ? 'text-orange-700' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        onSignOut={onBack}
        stats={[
          { label: 'Deliveries This Month', value: 142 },
          { label: 'Success Rate', value: '98%' }
        ]}
      />
    </div>
  );
};

export default DeliveryDashboard;
