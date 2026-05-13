import React, { useState, useEffect } from 'react';
import { LayoutGrid, Users, Package, Clock, Plus, Search, MapPin, Camera, ChevronRight, CheckCircle2, MoreVertical, Phone, Mail, Calendar, ArrowLeft, Filter, Truck, Factory, Hammer, Paintbrush, Box, CheckCircle, TrendingUp, Star, Hash, Settings, Edit, Trash2, ShoppingCart, ShoppingBasket, X, ShieldCheck, UserCircle, Lock, Eye, EyeOff, LogIn, Monitor, Activity, AlertCircle, Users2, ClipboardList, BarChart3, Zap, ShieldAlert, Shield, Key, UserPlus, Database, Server, Wallet, Receipt, CreditCard, FileText, PieChart, Coins, History, Bell, MessageSquare, Navigation, Maximize, Minimize, Compass, ArrowUp, ArrowDown, DollarSign, Briefcase, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { differenceInHours, differenceInMinutes, parseISO } from 'date-fns';
import { useAppState } from '../../contexts/AppStateContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileModal from '../ProfileModal';
import { DataSync } from '../admin/DataSync';
import { dataService } from '../../services/data.service';
import { Order, Transaction, Product, CartItem, ProductionLine, ProductionRecord, InventoryItem, DeliveryTask, Organization, OrderStatus } from '../../types';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Legend } from 'recharts';

const CASH_FLOW_DATA = [{ name: 'Jan', income: 4000, expense: 2400 }, { name: 'Feb', income: 3000, expense: 1398 }, { name: 'Mar', income: 2000, expense: 9800 }, { name: 'Apr', income: 2780, expense: 3908 }, { name: 'May', income: 1890, expense: 4800 }, { name: 'Jun', income: 2390, expense: 3800 }];
const REVENUE_DATA = [{ name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 2000 }, { name: 'Apr', revenue: 2780 }, { name: 'May', revenue: 1890 }, { name: 'Jun', revenue: 2390 }];
const PRODUCTION_DATA = [{ name: 'Week 1', target: 400, actual: 240 }, { name: 'Week 2', target: 300, actual: 139 }, { name: 'Week 3', target: 200, actual: 980 }, { name: 'Week 4', target: 278, actual: 390 }];
const AGENT_PERFORMANCE = [{ name: 'Agent A', sales: 400, target: 240 }, { name: 'Agent B', sales: 300, target: 139 }, { name: 'Agent C', sales: 200, target: 980 }];


  const SupervisorDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {
  const { profile } = useAuth();
  const { appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, deliveryAgents, setDeliveryAgents, accountants, setAccountants, flipText, setFlipText, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData } = useAppState();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedForDispatch, setSelectedForDispatch] = useState<string[]>([]);
    const [isDispatching, setIsDispatching] = useState(false);
    const [movingOrder, setMovingOrder] = useState<{ order: any; targetStatus: OrderStatus } | null>(null);
    const [moveNote, setMoveNote] = useState('');

    const getSLATime = (order: Order) => {
      if (!order.createdAt) return { time: '0h 0m', isDelayed: false };
      try {
        const start = typeof order.createdAt === 'string' ? parseISO(order.createdAt) : order.createdAt;
        const now = new Date();
        const hours = differenceInHours(now, start);
        const minutes = differenceInMinutes(now, start) % 60;
        const isDelayed = hours >= 48; // Threshold for delay
        return { time: `${hours}h ${minutes}m`, isDelayed };
      } catch (e) {
        return { time: '0h 0m', isDelayed: false };
      }
    };

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      try {
        await dataService.updateOrder(orderId, { 
          status: newStatus,
          updatedAt: new Date().toISOString()
        });

        // Log Activity
        await dataService.logActivity({
          userId: profile?.id || 'system',
          userName: profile?.name || 'In-Charge',
          userRole: profile?.role || 'supervisor',
          action: 'status_update',
          targetType: 'order',
          targetId: orderId,
          details: `Order status moved to ${newStatus}. ${note ? `Note: ${note}` : ''}`,
          timestamp: new Date().toISOString()
        });

        // if there's a real backend sync needed beyond optimistic
        // await refreshData(); 
      } catch (err) {
        console.error('Error updating status:', err);
      }
    };

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      
      const orderId = result.draggableId;
      const targetStatus = result.destination.droppableId as OrderStatus;
      
      const order = orders.find(o => o.id === orderId);
      if (order && order.status !== targetStatus) {
        setMovingOrder({ order, targetStatus });
      }
    };

    const confirmMove = async () => {
      if (!movingOrder) return;
      await updateOrderStatus(movingOrder.order.id, movingOrder.targetStatus, moveNote);
      setMovingOrder(null);
      setMoveNote('');
    };

  const renderAdminManufacturingView = () => {
    // Factory Pulse data (mock)
    const throughput = 45;
    const wipItems = orders.filter(o => ['Queued', 'Received', 'In Production', 'Packaging'].includes(o.status)).length;
    const avgCycleTime = '1.2 Days';

    // Funnel data
    const funnelStages = [
      { name: 'Queued', count: orders.filter(o => ['Queued', 'Received'].includes(o.status)).length, color: 'bg-slate-100', bar: 'bg-slate-400' },
      { name: 'In Production', count: orders.filter(o => o.status === 'In Production').length, color: 'bg-indigo-100', bar: 'bg-indigo-500' },
      { name: 'Packaging', count: orders.filter(o => o.status === 'Packaging').length, color: 'bg-amber-100', bar: 'bg-amber-500' },
      { name: 'Ready for Dispatch', count: orders.filter(o => ['Ready for Dispatch', 'Ready for Delivery'].includes(o.status)).length, color: 'bg-emerald-100', bar: 'bg-emerald-500' }
    ];
    const maxFunnel = Math.max(...funnelStages.map(s => s.count), 1);

    return (
      <div className="space-y-4">
        {/* Factory Pulse */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Throughput Yield</div>
              <div className="text-xl font-bold text-slate-900">{throughput} <span className="text-xs font-medium text-slate-500">units/day</span></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current WIP</div>
              <div className="text-xl font-bold text-slate-900">{wipItems} <span className="text-xs font-medium text-slate-500">orders</span></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Avg Cycle Time</div>
              <div className="text-xl font-bold text-slate-900 flex items-end gap-2">
                {avgCycleTime} 
                <span className="text-xs font-bold text-emerald-500 flex items-center mb-1"><TrendingUp size={12} className="mr-0.5" /> 5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Production Pipeline & SLA Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-base">Production Pipeline</h3>
              <button 
                onClick={() => setSupervisorTab('Production Board' as any)}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:underline transition-all"
              >
                View Details <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {funnelStages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-28 text-xs font-bold text-slate-500">{stage.name}</div>
                  <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden flex items-center">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / maxFunnel) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full ${stage.bar} flex items-center px-3`}
                    >
                      {stage.count > 0 && <span className="text-white text-[10px] font-bold">{stage.count}</span>}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <ShieldAlert size={18} className="text-rose-500" />
              <h3 className="font-bold text-slate-900 text-base">SLA Alerts</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-rose-900 mb-0.5">Bottleneck Detected</div>
                  <div className="text-[10px] text-rose-700 leading-snug">5 High-Priority orders are stuck in 'In Production' for &gt; 48 hours.</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-amber-900 mb-0.5">Packaging Delay</div>
                  <div className="text-[10px] text-amber-700 leading-snug">Station 2 is operating at 40% capacity.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductionBoard = () => {
    const getOrdersByStatus = (status: string) => orders.filter(o => {
      if (status === 'Queued') return o.status === 'Queued' || o.status === 'Received' || o.status === 'Active';
      if (status === 'In Production') return o.status === 'In Production';
      if (status === 'Packaging') return o.status === 'Packaging';
      if (status === 'Ready for Dispatch') return o.status === 'Ready for Dispatch' || o.status === 'Ready for Delivery';
      return false;
    });

    const handleBulkDispatch = async (agentId: string) => {
      setIsDispatching(true);
      // Optimistic update
      setOrders(prev => prev.map(o => selectedForDispatch.includes(o.id) ? { ...o, status: 'Out for Delivery' } : o));
      
      try {
        await Promise.all(selectedForDispatch.map(id => 
          dataService.updateOrder(id, { status: 'Out for Delivery' })
        ));
        
        // Log bulk activity
        await dataService.logActivity({
          userId: profile?.id || 'system',
          userName: profile?.name || 'Supervisor',
          userRole: profile?.role || 'supervisor',
          action: 'bulk_dispatch',
          targetType: 'order',
          targetId: selectedForDispatch.join(','),
          details: `Bulk dispatched ${selectedForDispatch.length} orders to agent ${agentId}.`,
          timestamp: new Date().toISOString()
        });

        setSelectedForDispatch([]);
      } catch (err) {
        console.error("Failed to bulk dispatch status:", err);
      } finally {
        setIsDispatching(false);
      }
    };

    const toggleSelectForDispatch = (orderId: string) => {
      setSelectedForDispatch(prev => 
        prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
      );
    };

    const columns = [
      { id: 'Queued', label: 'Queued' },
      { id: 'In Production', label: 'In Production' },
      { id: 'Packaging', label: 'Packaging/QA' },
      { id: 'Ready for Dispatch', label: 'Outbound Dock' }
    ];

    const todayTarget = 80;
    const completed = orders.filter(o => ['Out for Delivery', 'Delivered', 'Closed'].includes(o.status)).length + 45; 
    const remaining = Math.max(0, todayTarget - completed);

    return (
      <div className="flex flex-col h-full space-y-4">
        {/* Mission Progress */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <Factory size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Shift Mission</div>
              <div className="text-sm font-bold text-slate-900">{todayTarget} Units Today</div>
            </div>
          </div>
          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tighter">
              <span className="text-emerald-600">{completed} Done</span>
              <span className="text-slate-400">{remaining} to go</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${Math.min((completed / todayTarget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* DragDrop Context */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar h-full min-h-[600px] items-start">
            {columns.map(col => {
              const colOrders = getOrdersByStatus(col.id);
              return (
                <div key={col.id} className="w-[300px] shrink-0 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col max-h-full">
                  <div className="p-3 flex justify-between items-center border-b border-slate-100 bg-white/50 rounded-t-xl">
                    <h3 className="text-sm font-bold text-slate-900">{col.label}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                      {colOrders.length}
                    </span>
                  </div>

                  {col.id === 'Ready for Dispatch' && (
                    <div className="p-3 bg-emerald-50/50 border-b border-emerald-100">
                      <select 
                        className="w-full text-[11px] font-bold border border-emerald-200 rounded-lg p-2 bg-white outline-none disabled:opacity-50"
                        onChange={(e) => {
                          if (e.target.value && selectedForDispatch.length > 0) {
                            handleBulkDispatch(e.target.value);
                            e.target.value = "";
                          }
                        }}
                        defaultValue=""
                        disabled={selectedForDispatch.length === 0 || isDispatching}
                      >
                         <option value="" disabled>{isDispatching ? 'Dispatching...' : `Dispatch ${selectedForDispatch.length} selected`}</option>
                        {deliveryAgents.map(ag => (
                          <option key={ag.id} value={ag.id}>{ag.name || ag.id}</option>
                        ))}
                      </select>
                      {selectedForDispatch.length > 0 && (
                        <button 
                          onClick={() => setSelectedForDispatch([])}
                          className="w-full text-[9px] font-bold text-slate-400 mt-2 hover:text-slate-600 text-center uppercase tracking-widest"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>
                  )}

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/30' : ''}`}
                      >
                        {colOrders.map((order, index) => {
                          const { time, isDelayed } = getSLATime(order);
                          const isSelected = selectedForDispatch.includes(order.id);
                          
                          return (
                            <Draggable key={order.id} draggableId={order.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white p-3 rounded-lg border shadow-sm group transition-all ${
                                    snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl border-indigo-400 z-50' : 
                                    isDelayed ? 'border-rose-200 border-l-4 border-l-rose-500' : 'border-slate-100'
                                  } ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}`}
                                >
                                  {/* Order Header */}
                                  <div className="flex justify-between items-start mb-2">
                                    <button 
                                      onClick={() => setSelectedAdminOrderDetails(order)}
                                      className="text-[11px] font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left"
                                    >
                                      #{order.id.slice(-6).toUpperCase()}
                                    </button>
                                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                      order.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                                    }`}>
                                      {order.priority || 'Normal'}
                                    </div>
                                  </div>

                                  {/* Client Info */}
                                  <div className="mb-3">
                                    <button 
                                      onClick={() => setSelectedClientDetails(clients.find(c => c.id === order.clientId) || null)}
                                      className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 group/btn text-left w-full"
                                    >
                                      <UserCircle size={12} className="text-slate-400 group-hover/btn:text-indigo-600 shrink-0" />
                                      <span className="truncate">{order.customerName || 'Unknown Client'}</span>
                                    </button>
                                  </div>

                                  {/* SLA Info */}
                                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                                    <div className={`flex items-center gap-1 text-[10px] font-bold ${isDelayed ? 'text-rose-500' : 'text-slate-500'}`}>
                                      <Clock size={10} />
                                      {time}
                                    </div>
                                    {col.id === 'Ready for Dispatch' && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSelectForDispatch(order.id);
                                        }}
                                        className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}
                                      >
                                        {isSelected && <CheckCircle2 size={10} className="text-white" />}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    );
  };

    const renderOverview = () => (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Production Efficiency</h3>
                <p className="text-xs text-slate-500">Completed vs Pending units by line</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Pending</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PRODUCTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="completed" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={30} />
                  <Bar dataKey="pending" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Active Alerts</h3>
                  <p className="text-xs text-slate-500">3 critical issues</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Line 3: Maintenance', time: '10m ago', type: 'critical' },
                  { title: 'Low Stock: Wood Planks', time: '25m ago', type: 'warning' },
                  { title: 'Shift Change Delay', time: '1h ago', type: 'info' },
                ].map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      alert.type === 'critical' ? 'bg-rose-500' :
                      alert.type === 'warning' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{alert.title}</div>
                      <div className="text-[10px] text-slate-400">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                View All Alerts
              </button>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Production Lines</h2>
              <p className="text-sm text-slate-500">Real-time status of all lines</p>
            </div>
            <button className="text-sm font-bold text-indigo-600">View All Lines</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productionLines.map(line => (
              <div key={line.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  line.status === 'Running' ? 'bg-emerald-50 text-emerald-600' :
                  line.status === 'Maintenance' ? 'bg-rose-50 text-rose-600' :
                  'bg-slate-50 text-slate-400'
                }`}>
                  <Factory size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 text-lg">{line.name}</h4>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      line.status === 'Running' ? 'bg-emerald-100 text-emerald-700' :
                      line.status === 'Maintenance' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{line.status}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          line.efficiency > 90 ? 'bg-emerald-500' :
                          line.efficiency > 70 ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${line.efficiency}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{line.efficiency}%</span>
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-xs text-slate-400 font-medium">Operator: {line.operator}</span>
                    <span className="text-xs text-slate-400 font-medium">{line.output}/{line.target} units</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );

    if (isAdminView) {
      // Ensure we have a valid tab selected when in Admin View
      const currentTab = (['Overview', 'Production Board'].includes(supervisorTab)) ? supervisorTab : 'Overview';
      
      return (
        <div className="space-y-6 h-full flex flex-col min-h-[600px] animate-in fade-in duration-500">
          {/* Sub-tabs for Manufacturing Admin - Polished Segmented Control */}
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner shadow-slate-200">
              {[
                { id: 'Overview', label: 'Operational Overview' },
                { id: 'Production Board', label: 'Manufacturing Kanban' }
              ].map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSupervisorTab(tab.id as any)}
                    className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 relative ${
                      isActive 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeAdminManufacturingTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm -z-[1]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Live</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1"
            >
              {currentTab === 'Overview' && renderAdminManufacturingView()}
              {currentTab === 'Production Board' && renderProductionBoard()}
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Mobile Menu Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 flex flex-col w-72 bg-white border-r border-slate-100 p-4 sm:p-8 h-full z-[70] transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">Supervisor</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operations Control</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            {[
              { id: 'Overview', icon: LayoutGrid, label: 'Dashboard' },
              { id: 'Production Board', icon: Factory, label: 'Production Board' },
              { id: 'Team', icon: Users2, label: 'Team Management' },
              { id: 'Alerts', icon: ShieldAlert, label: 'System Alerts' },
              { id: 'Settings', icon: Settings, label: 'Settings' },
            ].map((item) => {
              const isActive = supervisorTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => {
                    setSupervisorTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="text-sm font-bold">{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-50">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
            >
              <LogIn size={20} className="text-slate-400 group-hover:text-indigo-600 rotate-180" />
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-72">
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                <LayoutGrid size={24} />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{supervisorTab}</h2>
                <p className="text-[10px] sm:text-xs text-slate-500">Welcome, {profile?.name?.split(' ')[0] || 'Agent'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="relative w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <AlertCircle size={18} />
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-100">
                  <div className="text-right hidden xs:block sm:block">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-[60px] sm:max-w-none">{profile?.name?.split(' ')[0] || 'Agent'}</div>
                    <div className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">{profile?.role || 'Supervisor'}</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100">
                    {(profile?.name || 'SM').charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={supervisorTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {supervisorTab === 'Overview' && renderOverview()}
                {supervisorTab === 'Production Board' && renderProductionBoard()}
                {['Inventory', 'Production Log', 'Active Manufacturing'].includes(supervisorTab) && renderProductionBoard()}
                {['Team', 'Alerts', 'Settings'].includes(supervisorTab) && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                      {supervisorTab === 'Team' && <Users2 size={48} />}
                      {supervisorTab === 'Alerts' && <ShieldAlert size={48} />}
                      {supervisorTab === 'Settings' && <Settings size={48} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{supervisorTab} Module</h3>
                      <p className="text-slate-500 mt-2">Detailed analytics for this section are being prepared.</p>
                    </div>
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
                      Refresh Data
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] overflow-x-auto no-scrollbar">
          {[
            { id: 'Overview', icon: LayoutGrid, label: 'Home' },
            { id: 'Production Board', icon: Factory, label: 'Prod. Board' },
            { id: 'Team', icon: Users2, label: 'Team' },
          ].map((tab) => {
            const isActive = supervisorTab === tab.id;
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setSupervisorTab(tab.id as any)} className="relative flex flex-col items-center justify-center py-1 px-4 transition-all duration-300 outline-none group">
                {isActive && <motion.div layoutId="activeSupervisorTabMobile" className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10" />}
                <Icon size={isActive ? 22 : 20} className={`transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'}`} />
                <span className={`text-[9px] font-bold uppercase mt-1 tracking-wider ${isActive ? 'text-indigo-700' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Moving Order Confirmation Modal */}
        <AnimatePresence>
          {movingOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMovingOrder(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                      <Activity size={24} />
                    </div>
                    <button onClick={() => setMovingOrder(null)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Stage Transition</h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Moving Order <span className="font-bold text-slate-900">#{movingOrder.order.id.slice(-6).toUpperCase()}</span> to <span className="font-bold text-indigo-600 underline">{movingOrder.targetStatus}</span>. This action will be recorded in the audit trail.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Optional Remark</label>
                      <textarea 
                        value={moveNote}
                        onChange={(e) => setMoveNote(e.target.value)}
                        placeholder="Add a reason or instruction for this transition..."
                        className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button 
                      onClick={() => setMovingOrder(null)}
                      className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmMove}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest"
                    >
                      Confirm Move
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

export default SupervisorDashboard;
