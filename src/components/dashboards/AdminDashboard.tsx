import React, { useState, useEffect } from 'react';
import SupervisorDashboard from './SupervisorDashboard';
import { LayoutGrid, Users, Package, Clock, Plus, Search, MapPin, Camera, ChevronRight, CheckCircle2, MoreVertical, Phone, Mail, Calendar, ArrowLeft, Filter, Truck, Factory, Hammer, Paintbrush, Box, CheckCircle, TrendingUp, Star, Hash, Settings, Edit, Trash2, ShoppingCart, ShoppingBasket, X, ShieldCheck, Crosshair, UserCircle, Lock, Eye, EyeOff, LogIn, Monitor, Activity, AlertCircle, Users2, ClipboardList, BarChart3, Zap, ShieldAlert, Shield, Key, UserPlus, Database, Server, Wallet, Receipt, CreditCard, FileText, PieChart, Coins, History, Bell, MessageSquare, Navigation, Maximize, Minimize, Compass, ArrowUp, ArrowDown, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppState } from '../../contexts/AppStateContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileModal from '../ProfileModal';
import { DataSync } from '../admin/DataSync';
import { dataService } from '../../services/data.service';
import { LogisticsDashboard } from '../admin/LogisticsDashboard';
import { Order, Transaction, Product, CartItem, ProductionLine, ProductionRecord, InventoryItem, DeliveryTask, Organization, OrderStatus } from '../../types';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Legend } from 'recharts';

const CASH_FLOW_DATA = [{ name: 'Jan', income: 4000, expense: 2400 }, { name: 'Feb', income: 3000, expense: 1398 }, { name: 'Mar', income: 2000, expense: 9800 }, { name: 'Apr', income: 2780, expense: 3908 }, { name: 'May', income: 1890, expense: 4800 }, { name: 'Jun', income: 2390, expense: 3800 }];
const REVENUE_DATA = [{ name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 2000 }, { name: 'Apr', revenue: 2780 }, { name: 'May', revenue: 1890 }, { name: 'Jun', revenue: 2390 }];
const PRODUCTION_DATA = [{ name: 'Week 1', target: 400, actual: 240 }, { name: 'Week 2', target: 300, actual: 139 }, { name: 'Week 3', target: 200, actual: 980 }, { name: 'Week 4', target: 278, actual: 390 }];
const AGENT_PERFORMANCE = [{ name: 'Agent A', sales: 400, target: 240, leads: 40, conversions: 12, revenue: 120000 }, { name: 'Agent B', sales: 300, target: 139, leads: 30, conversions: 8, revenue: 95000 }, { name: 'Agent C', sales: 200, target: 980, leads: 20, conversions: 5, revenue: 50000 }];


  const AdminDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {
  const { profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [metricInterval, setMetricInterval] = useState<'7d' | '30d'>('7d');

  const { appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, clientCategoryFilter, setClientCategoryFilter, activeOrdersStatusFilter, setActiveOrdersStatusFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, salesViewMode, setSalesViewMode, deliveryAgents, setDeliveryAgents, deliveryViewMode, setDeliveryViewMode, accountants, setAccountants, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData, renderSortIcon } = useAppState();
    const renderAdminSales = () => {
      if (selectedAdminSalesAgent && salesAgents.length > 0) {
        const agent = salesAgents.find(a => a.id === selectedAdminSalesAgent);
        
        const renderAgentDetailContent = () => {
          if (selectedAgentTile === 'clients') {
            return (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
                <div className="segmented-control mb-4">
                  <button 
                    onClick={() => setAgentDetailTab('active')} 
                    className={`segmented-item ${agentDetailTab === 'active' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {agentDetailTab === 'active' && <motion.div layoutId="agentClientsTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Active Clients
                  </button>
                  <button 
                    onClick={() => setAgentDetailTab('past')} 
                    className={`segmented-item ${agentDetailTab === 'past' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {agentDetailTab === 'past' && <motion.div layoutId="agentClientsTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Past Clients
                  </button>
                </div>
                <div className="space-y-4">
                  {agentDetailTab === 'active' ? (
                    <div className="text-sm text-slate-600">Showing {agent?.activeClients} active clients with ongoing orders...</div>
                  ) : (
                    <div className="text-sm text-slate-600">Showing {agent?.pastClients} past clients...</div>
                  )}
                  {/* Mock List */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Client Company {i}</div>
                        <div className="text-xs text-slate-500">Last interaction: 2 days ago</div>
                      </div>
                      <button className="text-indigo-600 text-sm font-bold hover:underline">View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (selectedAgentTile === 'leads') {
            return (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
                <div className="segmented-control mb-4">
                  <button 
                    onClick={() => setAgentDetailTab('active')} 
                    className={`segmented-item ${agentDetailTab === 'active' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {agentDetailTab === 'active' && <motion.div layoutId="agentLeadsTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Active Leads
                  </button>
                  <button 
                    onClick={() => setAgentDetailTab('new')} 
                    className={`segmented-item ${agentDetailTab === 'new' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {agentDetailTab === 'new' && <motion.div layoutId="agentLeadsTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    New Leads
                  </button>
                </div>
                <div className="space-y-4">
                  {agentDetailTab === 'active' ? (
                    <div className="text-sm text-slate-600">Showing {agent?.leads} active leads...</div>
                  ) : (
                    <div className="text-sm text-slate-600">Showing new leads assigned by admin...</div>
                  )}
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Potential Lead {i}</div>
                        <div className="text-xs text-slate-500">Status: In Discussion</div>
                      </div>
                      <button className="text-indigo-600 text-sm font-bold hover:underline">View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (selectedAgentTile === 'schedule') {
            return (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
                <div className="segmented-control mb-4">
                  <button 
                    onClick={() => setAgentDetailTab('today')} 
                    className={`segmented-item ${agentDetailTab === 'today' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {agentDetailTab === 'today' && <motion.div layoutId="agentScheduleTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Priorities Today
                  </button>
                  <button 
                    onClick={() => setAgentDetailTab('week')} 
                    className={`segmented-item ${agentDetailTab === 'week' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {agentDetailTab === 'week' && <motion.div layoutId="agentScheduleTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Weekly Calendar
                  </button>
                </div>
                <div className="space-y-4">
                  {agentDetailTab === 'today' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                        <div className="font-bold text-rose-600 w-16">10:00 AM</div>
                        <div>
                          <div className="font-bold text-slate-900">Meeting with TechCorp</div>
                          <div className="text-xs text-slate-500">Discuss new office layout</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <div className="font-bold text-slate-500 w-16">02:00 PM</div>
                        <div>
                          <div className="font-bold text-slate-900">Follow-up Call</div>
                          <div className="text-xs text-slate-500">Global Industries</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">Weekly calendar view placeholder...</div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        };

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setSelectedAdminSalesAgent(null);
                    setSelectedAgentTile(null);
                  }}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{agent?.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${agent?.status === 'Online' ? 'bg-emerald-500' : agent?.status === 'In Meeting' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                    {agent?.status} • {agent?.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div 
                onClick={() => { setSelectedAgentTile('clients'); setAgentDetailTab('active'); }}
                className={`bg-white p-4 rounded-xl border ${selectedAgentTile === 'clients' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="card-info-text">Clients</div>
                  <Users size={16} className="text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{agent?.activeClients} <span className="text-sm font-normal text-slate-500">Active</span></div>
              </div>
              <div 
                onClick={() => { setSelectedAgentTile('leads'); setAgentDetailTab('active'); }}
                className={`bg-white p-4 rounded-xl border ${selectedAgentTile === 'leads' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Leads</div>
                  <Crosshair size={16} className="text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{agent?.leads} <span className="text-sm font-normal text-slate-500">Total</span></div>
              </div>
              <div 
                onClick={() => { setSelectedAgentTile('schedule'); setAgentDetailTab('today'); }}
                className={`bg-white p-4 rounded-xl border ${selectedAgentTile === 'schedule' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Schedule</div>
                  <Calendar size={16} className="text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900">3 <span className="text-sm font-normal text-slate-500">Meetings Today</span></div>
              </div>
            </div>

            {/* Expanded Detail View */}
            <AnimatePresence mode="wait">
              {selectedAgentTile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {renderAgentDetailContent()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Graphical Representation */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Performance Metrics</h3>
                <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Week 1', revenue: 4000, orders: 24 },
                      { name: 'Week 2', revenue: 3000, orders: 13 },
                      { name: 'Week 3', revenue: 2000, orders: 98 },
                      { name: 'Week 4', revenue: 2780, orders: 39 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#818cf8" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#34d399" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">Visited Client: TechCorp Inc.</div>
                        <div className="text-xs text-slate-500 mt-1">Logged a positive sentiment meeting regarding new office furniture.</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">2 hours ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contextual Chat */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Contextual Chat</h3>
                      <p className="text-xs text-slate-500">Chat with {agent?.name?.split(' ')[0] || 'Unknown'}</p>
                    </div>
                  </div>
                  <select 
                    value={chatContext}
                    onChange={(e) => setChatContext(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Client/Lead Context...</option>
                    <option value="client1">TechCorp Inc. (Client)</option>
                    <option value="lead1">Global Industries (Lead)</option>
                  </select>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  {chatContext ? (
                    <>
                      <div className="flex flex-col gap-1 items-start">
                        <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl rounded-tl-sm text-sm text-slate-700 shadow-sm max-w-[85%]">
                          Hi Admin, regarding {chatContext === 'client1' ? 'TechCorp' : 'Global Industries'}, they asked for a discount on bulk orders.
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 px-1">10:30 AM</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
                          We can offer 5% if they order more than 50 units.
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 px-1">10:32 AM</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      Select a context to view or start a conversation.
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-slate-100">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={chatContext ? "Type a message..." : "Select context first"} 
                      disabled={!chatContext}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all disabled:opacity-50"
                    />
                    <button 
                      disabled={!chatContext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      const manager = salesAgents.find(a => !a.reportsTo);
      const reports = salesAgents.filter(a => a.reportsTo === manager?.id);

      const renderMetricCard = (title: string, value7d: string | number, trend7d: string, value30d: string | number, trend30d: string, isPositive: boolean, Icon: any) => (
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all h-[100px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</div>
            <Icon size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={metricInterval}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-end gap-2.5"
            >
              <div className="text-lg sm:text-xl font-bold text-slate-900 leading-none">{metricInterval === '7d' ? value7d : value30d}</div>
              <div className="flex flex-col mb-0.5 leading-none">
                <div className={`flex items-center text-[11px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPositive ? <TrendingUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                  {metricInterval === '7d' ? trend7d : trend30d}
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1 whitespace-nowrap">
                  {metricInterval === '7d' ? '7 Days' : '30 Days'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-50 overflow-hidden">
            <motion.div 
              className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              key={metricInterval}
            />
          </div>
        </div>
      );

      return (
        <div className="space-y-6">
          {/* Overview Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {renderMetricCard("Sales Value", "₹14.2L", "22%", "₹58.4L", "18%", true, DollarSign)}
            {renderMetricCard("Active Execs", "12 / 15", "5%", "14 / 15", "2%", true, Briefcase)}
            {renderMetricCard("Client Visits", "28", "12%", "112", "15%", false, Eye)}
            {renderMetricCard("New Leads", "45", "18%", "184", "22%", true, Zap)}
            {renderMetricCard("Active Clients", "89", "2%", "92", "4%", true, Users)}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                <button 
                  onClick={() => setSalesViewMode('hierarchy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${salesViewMode === 'hierarchy' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users size={14} /> Hierarchy
                </button>
                <button 
                  onClick={() => setSalesViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${salesViewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ClipboardList size={14} /> List View
                </button>
              </div>
            </div>
          </div>

          {salesViewMode === 'hierarchy' ? (
            <div className="bg-slate-50/50 p-8 rounded-lg border border-slate-100 shadow-inner overflow-x-auto minimal-scrollbar">
              <div className="min-w-[800px] flex flex-col items-center">
                {/* Chairperson / Top Level */}
                <div className="flex flex-col items-center">
                  <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-xl w-64 text-center text-white shadow-2xl relative mb-12">
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200"></div>
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3 backdrop-blur-3xl border border-white/10">
                      JD
                    </div>
                    <h3 className="font-bold text-white tracking-tight">John Doe</h3>
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Chairperson / Owner</p>
                  </div>
                </div>

                {/* Level 1: Sales Agents / Managers */}
                <div className="relative">
                  {/* Horizontal Connector */}
                  {salesAgents.filter(a => !a.reportsTo).length > 1 && (
                    <div className="absolute -top-6 left-0 right-0 h-0.5 bg-slate-200 mx-[140px]"></div>
                  )}
                  
                  <div className="flex gap-12">
                    {salesAgents.filter(a => !a.reportsTo).map((agent, idx) => (
                      <div key={agent.id} className="relative flex flex-col items-center">
                        {/* Vertical line to horizontal Connector */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200"></div>
                        
                        <div 
                          onClick={() => setSelectedAdminSalesAgent(agent.id)}
                          className="bg-white/60 backdrop-blur-xl border border-white/40 p-4 rounded-xl w-60 text-center cursor-pointer hover:shadow-2xl hover:bg-white/80 hover:scale-[1.02] transition-all relative z-10 group shadow-xl"
                        >
                          <div className="w-12 h-12 bg-indigo-600/90 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2 shadow-lg border border-white/20 group-hover:scale-110 transition-transform">
                            {agent.name?.charAt(0) || '?'}
                          </div>
                          <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{agent.name}</h3>
                          <p className="text-[9px] text-indigo-600 font-bold mb-2 uppercase tracking-widest opacity-80">{agent.role}</p>
                          <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>{agent.activeClients} Clients</span>
                            <span>{agent.leads} Leads</span>
                          </div>
                        </div>

                        {/* Level 2: Sub-reports */}
                        {salesAgents.some(a => a.reportsTo === agent.id) && (
                          <div className="mt-12 relative flex flex-col items-center">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-200"></div>
                            
                            {/* Horizontal Connector for Level 2 */}
                            {salesAgents.filter(a => a.reportsTo === agent.id).length > 1 && (
                              <div className="absolute -top-6 left-0 right-0 h-0.5 bg-slate-200 mx-[80px]"></div>
                            )}

                            <div className="flex gap-8">
                              {salesAgents.filter(a => a.reportsTo === agent.id).map(subAgent => (
                                <div key={subAgent.id} className="relative pt-6">
                                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200"></div>
                                  <div 
                                    onClick={() => setSelectedAdminSalesAgent(subAgent.id)}
                                    className="bg-white/30 backdrop-blur-sm border border-white/10 p-3 rounded-xl w-48 text-center cursor-pointer hover:shadow-xl hover:bg-white/50 transition-all relative z-10 group shadow-sm"
                                  >
                                    <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                      {subAgent.name?.charAt(0) || '?'}
                                    </div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm">{subAgent.name}</h3>
                                    <p className="text-[9px] text-slate-500 mb-1 font-bold uppercase tracking-tight">{subAgent.role}</p>
                                    <div className="flex justify-center gap-3 text-[9px] font-bold text-slate-400">
                                      <span>{subAgent.activeClients} C</span>
                                      <span>{subAgent.leads} L</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto minimal-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {salesAgents.map(agent => (
                      <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                              {agent.name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{agent.name}</div>
                              <div className="text-[10px] text-slate-400">ID: {agent.id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{agent.role}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                              <span>Conversion</span>
                              <span className="text-emerald-600">{agent.conversion}</span>
                            </div>
                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: agent.conversion }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">{agent.revenue}</div>
                          <div className="text-[10px] text-emerald-600 font-bold">+12.4%</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <span className="text-xs text-slate-600">{agent.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedAdminSalesAgent(agent.id)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    };

    const renderAdminClientsOrders = () => {
      if (selectedAdminOrderDetails) {
        const order: any = activeOrders.find(o => o.orderId === selectedAdminOrderDetails) || orders.find(o => o.id === selectedAdminOrderDetails);
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setSelectedAdminOrderDetails(null)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Order {order?.orderId || order?.id}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    {order?.overallStage || order?.status}
                  </span>
                  • Placed on {order?.date || new Date().toISOString().split('T')[0]}
                </div>
              </div>
            </div>

            {/* Client Finances Summary */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-lg cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => { setSelectedClientDetails(order?.customer || order?.client || null); setSelectedAdminOrderDetails(null); }}>
                  Client: {order?.customer || order?.client}
                </h3>
                <button className="text-sm font-bold text-indigo-600 hover:underline" onClick={() => { setSelectedClientDetails(order?.customer || order?.client || null); setSelectedAdminOrderDetails(null); }}>View Client Profile</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Order Value</div>
                  <div className="text-2xl font-bold text-slate-900">₹{(order?.value || 0).toLocaleString()}</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Advance Received</div>
                  <div className="text-2xl font-bold text-emerald-700">₹{(order?.advance || 0).toLocaleString()}</div>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl">
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Pending Dues</div>
                  <div className="text-2xl font-bold text-rose-700">₹{(order?.pending || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Details */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Expected Delivery</span>
                    <span className="font-bold text-slate-900 text-sm">{order?.expectedDelivery}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Sales Executive</span>
                    <span 
                      className="font-bold text-indigo-600 text-sm cursor-pointer hover:underline"
                      onClick={() => { setAdminTab('Sales'); setSelectedAdminSalesAgent(order?.salesAgentId || null); }}
                    >
                      {order?.salesAgent}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Supervisor (Production)</span>
                    <span 
                      className="font-bold text-indigo-600 text-sm cursor-pointer hover:underline"
                      onClick={() => { setAdminTab('Manufacturing'); }}
                    >
                      {order?.supervisor}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Accountant</span>
                    <span 
                      className="font-bold text-indigo-600 text-sm cursor-pointer hover:underline"
                      onClick={() => { setAdminTab('Finance'); setSelectedAdminAccountant(order?.accountantId || null); }}
                    >
                      {order?.accountant}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <h3 className="font-bold text-slate-900 mb-4">Financial Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Draft Amount</span>
                    <span className="font-bold text-slate-900 text-sm">₹{((order?.value || 0) + (order?.discount || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Discount Offered</span>
                    <span className="font-bold text-rose-600 text-sm">-₹{(order?.discount || 0).toLocaleString()}</span>
                  </div>
                  {(order?.discount || 0) > 0 && (
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-slate-500 text-sm">Discount Reason</span>
                      <span className="font-bold text-slate-900 text-sm">{order?.discountReason}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm font-bold">Final Price</span>
                    <span className="font-bold text-indigo-600 text-lg">₹{(order?.value || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversations / Notes */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Conversations & Notes</h3>
              <div className="space-y-4">
                {order?.notes && order.notes.length > 0 ? (
                  order.notes.map((note: any) => (
                    <div key={note.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">{note.author}</span>
                        <span className="text-xs text-slate-500">{note.time}</span>
                      </div>
                      <p className="text-sm text-slate-700">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 text-sm">No notes or conversations recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        );
      }

      if (selectedClientDetails) {
        const client = clients.find(c => c.name === selectedClientDetails) || clients[0];
        const isLeadOnly = !client.is_client;
        
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setSelectedClientDetails(null)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{client.name}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.is_client ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {client.is_client ? 'Client' : 'Lead'}
                  </span>
                  • {isLeadOnly ? 'New Lead' : 'Client Profile'}
                </div>
              </div>
            </div>

            {/* Client Info & Financials */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 lg:col-span-1">
                <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Location</div>
                      <div className="text-sm text-slate-500">{client.location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Phone</div>
                      <div className="text-sm text-slate-500">{client.contact}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Email</div>
                      <div className="text-sm text-slate-500">{client.email}</div>
                    </div>
                  </div>
                  {isLeadOnly && (client as any).salesAgent && (
                    <div className="flex items-start gap-3 pt-4 border-t border-slate-50">
                      <Users size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">Sales Executive</div>
                        <div className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline" onClick={() => { setAdminTab('Sales'); }}>{(client as any).salesAgent}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isLeadOnly && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 lg:col-span-2">
                  <h3 className="font-bold text-slate-900 mb-4">Financial Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Value</div>
                      <div className="text-xl font-bold text-slate-900">₹{((client as any).totalValue || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Paid</div>
                      <div className="text-xl font-bold text-emerald-700">₹{(((client as any).totalValue || 0) * 0.8).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-lg">
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Due Amount</div>
                      <div className="text-xl font-bold text-rose-700">₹{(((client as any).totalValue || 0) * 0.2).toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Advance</div>
                      <div className="text-xl font-bold text-indigo-700">₹5,000</div>
                    </div>
                  </div>
                </div>
              )}
              
              {isLeadOnly && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 lg:col-span-2">
                  <h3 className="font-bold text-slate-900 mb-4">Conversations & Notes</h3>
                  <div className="space-y-4">
                    {(client as any).notes && (client as any).notes.length > 0 ? (
                      (client as any).notes.map((note: any) => (
                        <div key={note.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-900 text-sm">{note.author}</span>
                            <span className="text-xs text-slate-500">{note.time}</span>
                          </div>
                          <p className="text-sm text-slate-700">{note.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-500 text-sm">No notes or conversations recorded yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isLeadOnly && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Tabs */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 lg:col-span-2">
                <div className="segmented-control mb-6">
                  <button 
                    onClick={() => setClientDetailTab('active')} 
                    className={`segmented-item ${clientDetailTab === 'active' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {clientDetailTab === 'active' && <motion.div layoutId="adminClientOrdersTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Active Orders
                  </button>
                  <button 
                    onClick={() => setClientDetailTab('draft')} 
                    className={`segmented-item ${clientDetailTab === 'draft' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {clientDetailTab === 'draft' && <motion.div layoutId="adminClientOrdersTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Drafted Orders
                  </button>
                  <button 
                    onClick={() => setClientDetailTab('past')} 
                    className={`segmented-item ${clientDetailTab === 'past' ? 'segmented-item-active' : 'segmented-item-inactive'}`}
                  >
                    {clientDetailTab === 'past' && <motion.div layoutId="adminClientOrdersTab" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-100 z-[-1]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                    Past Orders
                  </button>
                </div>
                <div className="space-y-4">
                  {clientDetailTab === 'active' && activeOrders.filter(o => o.customer === client.name || o.client === client.name).map((order) => (
                    <div key={order.orderId || order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          <Package size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{order.orderId || order.id}</div>
                          <div className="text-xs text-slate-500">Status: {order.overallStage || order.status} • Est. Delivery: {order.expectedDelivery || new Date().toISOString().split('T')[0]}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹{(order?.value || 0).toLocaleString()}</div>
                        <button onClick={() => setSelectedAdminOrderDetails(order.id)} className="text-indigo-600 text-xs font-bold hover:underline mt-1">View Details</button>
                      </div>
                    </div>
                  ))}
                  {clientDetailTab === 'active' && activeOrders.filter(o => o.customer === client.name || o.client === client.name).length === 0 && (
                    <div className="text-center py-8 text-slate-500">No active orders found.</div>
                  )}

                  {clientDetailTab === 'draft' && orders.filter(o => o.category === 'Open' && o.orgId === client.id).map((draft) => (
                    <div key={draft.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{draft.id}</div>
                          <div className="text-xs text-slate-500">Priority: {draft.priority || 'Normal'} • Agent: {draft.salesAgent || 'System'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">Est. ₹{(draft.totalAmount || 0).toLocaleString()}</div>
                        <button onClick={() => setSelectedAdminOrderDetails(draft.id)} className="text-indigo-600 text-xs font-bold hover:underline mt-1">View Details</button>
                      </div>
                    </div>
                  ))}
                  {clientDetailTab === 'draft' && orders.filter(o => o.category === 'Open' && o.orgId === client.id).length === 0 && (
                    <div className="text-center py-8 text-slate-500">No drafted orders found.</div>
                  )}

                  {clientDetailTab === 'past' && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Order #ORD-0982</div>
                          <div className="text-xs text-slate-500">Delivered: Sep 12, 2023 • Agent: Sarah Jenkins</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹8,500</div>
                        <button className="text-indigo-600 text-xs font-bold hover:underline mt-1">View Invoice</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversation Records */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 lg:col-span-1">
                <h3 className="font-bold text-slate-900 mb-4">Interaction History</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <MessageSquare size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 text-sm">Sales Call</div>
                        <div className="text-[10px] text-slate-500">Today, 10:30 AM</div>
                      </div>
                      <div className="text-xs text-slate-600">Discussed bulk discount for upcoming order.</div>
                      <div className="text-[10px] text-indigo-600 font-bold mt-2">By Sarah Jenkins</div>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <DollarSign size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 text-sm">Payment Received</div>
                        <div className="text-[10px] text-slate-500">Oct 12, 2023</div>
                      </div>
                      <div className="text-xs text-slate-600">Advance payment of ₹5,000 processed.</div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-2">By Accounts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner shadow-slate-200 w-fit">
              {[
                { id: 'activeOrders', label: 'Active Orders' },
                { id: 'draftOrders', label: 'Draft Orders' },
                { id: 'leads', label: 'New Leads' },
                { id: 'allClients', label: 'Clients' }
              ].map((tab) => {
                const isActive = clientsOrdersMainTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`admin-tab-${tab.id}`}
                    onClick={() => setClientsOrdersMainTab(tab.id as any)}
                    className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 relative ${
                      isActive 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeAdminClientsTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm -z-[1]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                <input 
                  type="text" 
                  value={clientsSearchQuery}
                  onChange={(e) => setClientsSearchQuery(e.target.value)}
                  placeholder="Filter records..." 
                  className="bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs w-full md:w-64 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowClientsFilters(!showClientsFilters)}
                className={`p-2 rounded-xl border transition-all ${showClientsFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'}`}
              >
                <Filter size={16} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showClientsFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden"
              >
                <div className="p-4 flex flex-wrap gap-6">
                  {/* Contextual Filters */}
                  {clientsOrdersMainTab === 'activeOrders' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Active', 'In Production', 'Packaging', 'Delivered'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setActiveOrdersStatusFilter(status)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeOrdersStatusFilter === status ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(clientsOrdersMainTab === 'draftOrders' || clientsOrdersMainTab === 'leads') && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Mart', 'School', 'Office', 'Hospital', 'Independent'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setClientCategoryFilter(cat)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${clientCategoryFilter === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {clientsOrdersMainTab === 'allClients' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'All', label: 'All' },
                            { id: 'Active Client', label: 'Active' },
                            { id: 'Past Client', label: 'Past' },
                            { id: 'Active Lead', label: 'Lead' },
                            { id: 'Inactive Lead', label: 'Inactive' }
                          ].map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setAllClientsFilter(type.id as any)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${allClientsFilter === type.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                        <div className="flex flex-wrap gap-2">
                          {['All', 'Mart', 'School', 'Office', 'Hospital', 'Independent'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setClientCategoryFilter(cat)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${clientCategoryFilter === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    {clientsOrdersMainTab === 'activeOrders' && (
                      <>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('id')}>Order {renderSortIcon('id')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('client')}>Client {renderSortIcon('client')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('date')}>Dates {renderSortIcon('date')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </>
                    )}
                    {clientsOrdersMainTab === 'draftOrders' && (
                      <>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('id')}>Draft Order {renderSortIcon('id')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('client')}>Client / Org {renderSortIcon('client')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('priority')}>Priority {renderSortIcon('priority')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </>
                    )}
                    {clientsOrdersMainTab === 'leads' && (
                      <>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('name')}>New Lead Name {renderSortIcon('name')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('contactPerson')}>Contact {renderSortIcon('contactPerson')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('interest')}>Interest {renderSortIcon('interest')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </>
                    )}
                    {clientsOrdersMainTab === 'allClients' && (
                      <>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('name')}>Client Name {renderSortIcon('name')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('type')}>Type {renderSortIcon('type')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('totalOrders')}>Orders {renderSortIcon('totalOrders')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('totalValue')}>Revenue {renderSortIcon('totalValue')}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {clientsOrdersMainTab === 'activeOrders' && sortData(activeOrders.filter(o => 
                    ((o.customer || o.client || '').toLowerCase().includes(clientsSearchQuery.toLowerCase()) || 
                     (o.orderId || o.id || '').toLowerCase().includes(clientsSearchQuery.toLowerCase())) &&
                    (activeOrdersStatusFilter === 'All' || o.overallStage === activeOrdersStatusFilter || o.status === activeOrdersStatusFilter)
                  )).map((order) => (
                    <tr key={order.orderId || order.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{order.orderId || order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setSelectedClientDetails(order.customer || order.client)}>{order.customer || order.client}</div>
                        <div className="text-[11px] text-slate-400 font-medium">₹{(order.value || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[11px] text-slate-600"><span className="text-slate-400 uppercase tracking-tighter mr-1">Exp:</span> {order.expectedDelivery || new Date().toISOString().split('T')[0]}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700">
                          {order.overallStage || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedAdminOrderDetails(order.orderId || order.id)} className="text-slate-400 hover:text-indigo-600 transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {clientsOrdersMainTab === 'draftOrders' && sortData(orders.filter(o => o.category === 'Open').filter(o => {
                    const client = clients.find(c => c.id === o.orgId);
                    return (
                      ((client?.name || '').toLowerCase().includes(clientsSearchQuery.toLowerCase()) || o.id.toLowerCase().includes(clientsSearchQuery.toLowerCase())) &&
                      (clientCategoryFilter === 'All' || client?.client_type === clientCategoryFilter)
                    );
                  })).map((draft) => (
                    <tr key={draft.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{draft.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900">{clients.find(c => c.id === draft.orgId)?.name || 'Unknown Client'}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Est. ₹{(draft.totalAmount || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${draft.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                          {draft.priority || 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedAdminOrderDetails(draft.id)} className="text-slate-400 hover:text-indigo-600 transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {clientsOrdersMainTab === 'leads' && sortData(clients.filter(c => !c.is_client).filter(l => 
                    ((l.name || '').toLowerCase().includes(clientsSearchQuery.toLowerCase()) || (l.contactPerson || '').toLowerCase().includes(clientsSearchQuery.toLowerCase())) &&
                    (clientCategoryFilter === 'All' || l.client_type === clientCategoryFilter)
                  )).map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</div>
                        <div className="text-[11px] text-slate-400">Since: {lead.interactions?.[0]?.date || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900">{lead.contactPerson || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">{lead.contact || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-slate-600">
                        {lead.interest || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedClientDetails(lead.name)} className="text-slate-400 hover:text-indigo-600 transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {clientsOrdersMainTab === 'allClients' && sortData(clients.filter(c => 
                    (allClientsFilter === 'All' || 
                     (allClientsFilter === 'Active Client' && c.is_client) || 
                     (allClientsFilter === 'Past Client' && c.is_client && orders.some(o => o.orgId === c.id && o.status === 'Delivered')) ||
                     (allClientsFilter === 'Active Lead' && !c.is_client && c.status === 'Active') || 
                     (allClientsFilter === 'Inactive Lead' && !c.is_client && c.status === 'Inactive')) &&
                    (clientCategoryFilter === 'All' || c.client_type === clientCategoryFilter) &&
                    ((c.name || '').toLowerCase().includes(clientsSearchQuery.toLowerCase()))
                  )).map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{client.name}</div>
                        <div className="text-[11px] text-slate-400">{client.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.is_client ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                          {client.is_client ? 'Client' : 'Lead'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-900 font-medium">
                        {orders.filter(o => o.orgId === client.id).length}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold text-slate-900">
                        ₹{(client.totalValue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedClientDetails(client.name)} className="text-slate-400 hover:text-indigo-600 transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Placeholder (Match Ref Image 2) */}
            <div className="px-6 py-4 bg-white border-t border-slate-50 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Showing 1-{activeOrders.length > 5 ? 5 : activeOrders.length} of {activeOrders.length} records
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderAdminDelivery = () => {
      if (selectedAdminDeliveryAgent && deliveryAgents.length > 0) {
        const agent = deliveryAgents.find(a => a.id === selectedAdminDeliveryAgent);

        const renderAgentDetailContent = () => {
          if (selectedDeliveryAgentTile === 'tasks') {
            return (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                  <button onClick={() => setDeliveryAgentDetailTab('active')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'active' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-50'}`}>Active Tasks</button>
                  <button onClick={() => setDeliveryAgentDetailTab('complete')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'complete' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-50'}`}>Complete Tasks</button>
                  <button onClick={() => setDeliveryAgentDetailTab('today')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'today' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-50'}`}>Completed Today</button>
                </div>
                <div className="space-y-4">
                  {deliveryAgentDetailTab === 'active' ? (
                    <div className="text-sm text-slate-600">Showing {agent?.activeToday} active tasks...</div>
                  ) : deliveryAgentDetailTab === 'complete' ? (
                    <div className="text-sm text-slate-600">Showing all historical complete tasks...</div>
                  ) : (
                    <div className="text-sm text-slate-600">Showing {agent?.doneToday} tasks completed today...</div>
                  )}
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-bold text-slate-900">Task #{2000 + i}</div>
                        <div className="text-xs text-slate-500">Client: {agent?.currentClient}</div>
                      </div>
                      <button className="text-orange-600 text-sm font-bold hover:underline">View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (selectedDeliveryAgentTile === 'schedule') {
            return (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                  <button onClick={() => setDeliveryAgentDetailTab('week')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'week' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'}`}>Upcoming Week</button>
                  <button onClick={() => setDeliveryAgentDetailTab('available')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'available' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'}`}>Available Tasks</button>
                </div>
                <div className="space-y-4">
                  {deliveryAgentDetailTab === 'week' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <div className="font-bold text-slate-500 w-24">Tomorrow</div>
                        <div>
                          <div className="font-bold text-slate-900">Route 4A - Downtown</div>
                          <div className="text-xs text-slate-500">3 Deliveries Scheduled</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">Showing available tasks/orders to take up...</div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        };

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setSelectedAdminDeliveryAgent(null);
                    setSelectedDeliveryAgentTile(null);
                  }}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{agent?.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${agent?.status === 'On Route' ? 'bg-emerald-500' : agent?.status === 'Available' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                    {agent?.status} • {agent?.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Tiles */}
            <div className="flex gap-3 overflow-x-auto pb-4 minimal-scrollbar">
              <div 
                onClick={() => { setSelectedDeliveryAgentTile('tasks'); setDeliveryAgentDetailTab('active'); }}
                className={`bg-white p-4 rounded-xl border-2 min-w-[240px] flex-1 ${selectedDeliveryAgentTile === 'tasks' ? 'border-orange-500' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">TASKS</div>
                  <Package size={18} className="text-orange-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{agent?.activeToday}</span>
                  <span className="text-sm text-slate-500">Active</span>
                </div>
              </div>
              
              <div 
                onClick={() => { setSelectedDeliveryAgentTile('schedule'); setDeliveryAgentDetailTab('week'); }}
                className={`bg-white p-4 rounded-xl border-2 min-w-[240px] flex-1 ${selectedDeliveryAgentTile === 'schedule' ? 'border-orange-500' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">SCHEDULE</div>
                  <Calendar size={18} className="text-orange-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">5</span>
                  <span className="text-sm text-slate-500">Upcoming Routes</span>
                </div>
              </div>
            </div>

            {/* Expanded Detail View */}
            <AnimatePresence mode="wait">
              {selectedDeliveryAgentTile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {renderAgentDetailContent()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Graphical Representation */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Delivery Performance</h3>
                <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-orange-500">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Mon', completed: 4, active: 1 },
                      { name: 'Tue', completed: 6, active: 0 },
                      { name: 'Wed', completed: 5, active: 2 },
                      { name: 'Thu', completed: 8, active: 0 },
                      { name: 'Fri', completed: 3, active: 3 },
                      { name: 'Sat', completed: 2, active: 0 },
                      { name: 'Sun', completed: 0, active: 0 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Area type="monotone" dataKey="completed" name="Completed Tasks" stroke="#f97316" fill="#ffedd5" strokeWidth={2} />
                    <Area type="monotone" dataKey="active" name="Active Tasks" stroke="#818cf8" fill="#e0e7ff" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Route / Activity */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <h3 className="font-bold text-slate-900 mb-4">Current Route</h3>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">Delivery to: {agent?.currentClient}</div>
                        <div className="text-xs text-slate-500 mt-1">Expected arrival in 15 mins.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contextual Chat */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Contextual Chat</h3>
                      <p className="text-xs text-slate-500">Chat with {agent?.name?.split(' ')[0] || 'Unknown'}</p>
                    </div>
                  </div>
                  <select 
                    value={deliveryChatContext}
                    onChange={(e) => setDeliveryChatContext(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                  >
                    <option value="">Select Client/Order Context...</option>
                    <option value="client1">{agent?.currentClient} (Active Order)</option>
                    <option value="client2">Global Logistics (Past Order)</option>
                  </select>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  {deliveryChatContext ? (
                    <>
                      <div className="flex flex-col gap-1 items-start">
                        <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl rounded-tl-sm text-sm text-slate-700 shadow-sm max-w-[85%]">
                          Hi Admin, traffic is heavy on I-95, might be delayed by 10 mins for the {deliveryChatContext === 'client1' ? agent?.currentClient : 'Global Logistics'} delivery.
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 px-1">10:30 AM</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="bg-orange-600 text-white px-4 py-2 rounded-xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
                          Noted. I'll update the client. Drive safe!
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 px-1">10:32 AM</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      Select a context to view or start a conversation.
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-slate-100">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={deliveryChatContext ? "Type a message..." : "Select context first"} 
                      disabled={!deliveryChatContext}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all disabled:opacity-50"
                    />
                    <button 
                      disabled={!deliveryChatContext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      const renderDeliveryMetricCard = (title: string, value7d: string | number, trend7d: string, value30d: string | number, trend30d: string, isPositive: boolean, Icon: any) => (
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all h-[100px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</div>
            <Icon size={14} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={metricInterval}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-end gap-2.5"
            >
              <div className="text-lg sm:text-xl font-bold text-slate-900 leading-none">{metricInterval === '7d' ? value7d : value30d}</div>
              <div className="flex flex-col mb-0.5 leading-none">
                <div className={`flex items-center text-[11px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPositive ? <TrendingUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                  {metricInterval === '7d' ? trend7d : trend30d}
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1 whitespace-nowrap">
                  {metricInterval === '7d' ? '7 Days' : '30 Days'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-50 overflow-hidden">
            <motion.div 
              className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              key={metricInterval}
            />
          </div>
        </div>
      );

      return (
        <div className="space-y-6">
          {/* Overview Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {renderDeliveryMetricCard("Deliveries Executed", "842", "15%", "3,642", "18%", true, CheckCircle)}
            {renderDeliveryMetricCard("Active Fleet", "8 / 10", "2%", "10 / 10", "0%", true, Truck)}
            {renderDeliveryMetricCard("Pending Tasks", "14", "5%", "42", "12%", false, Clock)}
            {renderDeliveryMetricCard("On-Time Rate", "98.2%", "0.5%", "97.5%", "0.2%", true, Activity)}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
                <button 
                  onClick={() => setDeliveryViewMode('hierarchy')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${deliveryViewMode === 'hierarchy' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users size={14} /> Hierarchy
                </button>
                <button 
                  onClick={() => setDeliveryViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${deliveryViewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ClipboardList size={14} /> List View
                </button>
              </div>
            </div>
          </div>

          {deliveryViewMode === 'hierarchy' ? (
            <div className="bg-slate-50/50 p-8 rounded-lg border border-slate-100 shadow-inner overflow-x-auto minimal-scrollbar">
              <div className="min-w-[800px] flex flex-col items-center">
                {/* Head of Delivery / Top Level */}
                <div className="flex flex-col items-center">
                  <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-xl w-64 text-center text-white shadow-2xl relative mb-12">
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200"></div>
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3 backdrop-blur-3xl border border-white/10">
                      AS
                    </div>
                    <h3 className="font-bold text-white tracking-tight">Amit Sharma</h3>
                    <p className="text-[10px] text-orange-300 font-bold uppercase tracking-widest">Head of Operations</p>
                  </div>
                </div>

                {/* Level 1: Fleet Managers / Supervisors */}
                <div className="relative">
                  {/* Horizontal Connector */}
                  {deliveryAgents.filter(a => a.role === 'DELIVERY_SUPERVISOR' || !a.reportsTo).length > 1 && (
                    <div className="absolute -top-6 left-0 right-0 h-0.5 bg-slate-200 mx-[140px]"></div>
                  )}
                  
                  <div className="flex gap-12">
                    {deliveryAgents.filter(a => a.role === 'DELIVERY' || a.role === 'DELIVERY_SUPERVISOR').slice(0, 3).map((agent, idx) => (
                      <div key={agent.id} className="relative flex flex-col items-center">
                        {/* Vertical line to horizontal Connector */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200"></div>
                        
                        <div 
                          onClick={() => setSelectedAdminDeliveryAgent(agent.id)}
                          className="bg-white/60 backdrop-blur-xl border border-white/40 p-4 rounded-xl w-60 text-center cursor-pointer hover:shadow-2xl hover:bg-white/80 hover:scale-[1.02] transition-all relative z-10 group shadow-xl"
                        >
                          <div className="w-12 h-12 bg-orange-600/90 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2 shadow-lg border border-white/20 group-hover:scale-110 transition-transform">
                            {agent.name?.charAt(0) || '?'}
                          </div>
                          <h3 className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors uppercase tracking-tight text-sm">{agent.name}</h3>
                          <p className="text-[9px] text-orange-600 font-bold mb-2 uppercase tracking-widest opacity-80">{agent.role}</p>
                          <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>{agent.activeToday} Active</span>
                            <span>{agent.doneToday} Done</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto minimal-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tasks</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Efficiency</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {deliveryAgents.map(agent => (
                      <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs uppercase">
                              {agent.name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1">{agent.name}</div>
                              <div className="text-[10px] text-slate-400">ID: {agent.id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{agent.role}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">{agent.doneToday} <span className="text-slate-400 font-normal">/ {agent.activeToday + agent.doneToday}</span></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                              <span>94%</span>
                            </div>
                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: '94%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'On Route' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <span className="text-xs text-slate-600">{agent.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedAdminDeliveryAgent(agent.id)}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            View Fleet
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    };

    const renderAdminFinance = () => {

      if (selectedAdminAccountant) {
        const agent = accountants.find(a => a.id === selectedAdminAccountant);
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedAdminAccountant(null)}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{agent?.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${agent?.status === 'Online' ? 'bg-emerald-500' : agent?.status === 'In Meeting' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                    {agent?.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="card-info-text mb-1">Processed</div>
                    <div className="text-xl font-bold text-slate-900">{agent?.processedInvoices}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="card-info-text mb-1">Pending</div>
                    <div className="text-xl font-bold text-slate-900">{agent?.pendingApprovals}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="card-info-text mb-1">Accuracy</div>
                    <div className="text-xl font-bold text-slate-900">{agent?.accuracy}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                  <h3 className="font-bold text-slate-900 mb-4">Recent Approvals</h3>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                          <Receipt size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">Approved Invoice #INV-2026-00{i}</div>
                          <div className="text-xs text-slate-500 mt-1">Amount: ₹12,400.00 - TechCorp Inc.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col h-[600px]">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Direct Message</h3>
                    <p className="text-xs text-slate-500">Chat with {agent?.name?.split(' ')?.[0] || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl rounded-tl-sm text-sm text-slate-700 shadow-sm max-w-[85%]">
                      Hi Admin, I need approval for the new equipment purchase order.
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 px-1">11:15 AM</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="bg-amber-600 text-white px-4 py-2 rounded-xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
                      Sure, I'll review it and get back to you shortly.
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 px-1">11:20 AM</span>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-600 text-white rounded-lg flex items-center justify-center hover:bg-amber-700 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Finance Team</h2>
              <p className="text-slate-500 text-sm mt-1">Monitor and manage accountants</p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors flex items-center gap-2 shadow-sm">
              <Plus size={16} /> Add Accountant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountants.map(agent => (
              <div 
                key={agent.id} 
                onClick={() => setSelectedAdminAccountant(agent.id)}
                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-bold text-lg group-hover:scale-110 transition-transform">
                      {agent.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{agent.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Online' ? 'bg-emerald-500' : agent.status === 'In Meeting' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
                        {agent.status}
                      </div>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="card-info-text mb-1">Processed</div>
                    <div className="font-bold text-slate-900 text-sm">{agent.processedInvoices}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="card-info-text mb-1">Pending</div>
                    <div className="font-bold text-slate-900 text-sm">{agent.pendingApprovals}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="card-info-text mb-1">Acc.</div>
                    <div className="font-bold text-emerald-600 text-sm">{agent.accuracy}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderOverview = () => (
      <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <TrendingUp size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">₹124,500</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Revenue</div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <ShoppingBasket size={20} />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">1,240</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Orders</div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">24 Active</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">45</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Sales Agents</div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                <ShieldAlert size={20} />
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">3 Critical</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">8</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Pending Alerts</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
                <p className="text-xs text-slate-500">Weekly revenue trends</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-100">7 Days</button>
                <button className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-rose-100">30 Days</button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Production Status</h3>
                <p className="text-xs text-slate-500">Completed vs Pending by line</p>
              </div>
              <button className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                <Filter size={16} />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PRODUCTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 20 }} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Agents and Leads Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Agent Performance</h3>
                <p className="text-xs text-slate-500">Top performing sales agents</p>
              </div>
              <button className="text-xs font-bold text-rose-600">View Detailed Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-50">
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agent Name</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leads</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversions</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {AGENT_PERFORMANCE.map((agent, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-[10px]">
                            {(agent.name || '').split(' ').map(n => n[0]).join('') || '?'}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-600 font-medium">{agent.leads}</td>
                      <td className="py-4 text-sm text-slate-600 font-medium">{agent.conversions}</td>
                      <td className="py-4 text-sm font-bold text-slate-900">₹{(agent?.revenue || 0).toLocaleString()}</td>
                      <td className="py-4">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">On Track</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Active Leads Status</h3>
            <div className="space-y-6">
              {[
                { label: 'New Leads', count: 124, color: 'bg-blue-500', percentage: 45 },
                { label: 'In Progress', count: 86, color: 'bg-amber-500', percentage: 30 },
                { label: 'Negotiation', count: 42, color: 'bg-indigo-500', percentage: 15 },
                { label: 'Closed/Won', count: 28, color: 'bg-emerald-500', percentage: 10 },
              ].map((lead, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-700">{lead.label}</span>
                    <span className="text-xs font-bold text-slate-900">{lead.count}</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${lead.percentage}%` }}
                      className={`h-full ${lead.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-rose-600 shadow-sm">
                  <PieChart size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversion</div>
                  <div className="text-lg font-bold text-rose-600">18.4%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Mobile Backdrop */}
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
        <aside className={`fixed inset-y-0 left-0 flex flex-col w-72 bg-white border-r border-slate-100 p-3 sm:p-4 h-full z-[70] transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-100">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">Admin</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise v2.4</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto minimal-scrollbar pr-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-4">Dashboards</div>
            {[
              { id: 'Overview', icon: LayoutGrid, label: 'Overview' },
              { id: 'Live Map', icon: Navigation, label: 'Live Map' },
              { id: 'Clients & Orders', icon: Briefcase, label: 'Clients & Orders' },
              { id: 'Sales', icon: TrendingUp, label: 'Sales' },
              { id: 'Delivery', icon: Truck, label: 'Delivery' },
              { id: 'Manufacturing', icon: Factory, label: 'Manufacturing' },
              { id: 'Finance', icon: DollarSign, label: 'Finance' },
            ].map((item) => {
              const isActive = adminTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => { setAdminTab(item.id as any); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className={`text-sm font-bold leading-tight ${item.id === 'Clients & Orders' ? 'whitespace-nowrap' : ''}`}>{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto flex-shrink-0" />}
                </button>
              );
            })}

            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-6">System</div>
            {[
              { id: 'Users', icon: Users, label: 'User Management' },
              { id: 'System', icon: Server, label: 'System Health' },
              { id: 'Logs', icon: History, label: 'Activity Logs' },
              { id: 'Data Sync', icon: Database, label: 'Data Sync' },
              { id: 'Settings', icon: Settings, label: 'Settings' },
            ].map((item) => {
              const isActive = adminTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => { setAdminTab(item.id as any); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className={`text-sm font-bold leading-tight ${item.id === 'Clients & Orders' ? 'whitespace-nowrap' : ''}`}>{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-50">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
            >
              <LogIn size={20} className="text-slate-400 group-hover:text-rose-600 rotate-180" />
              <span className="text-sm font-bold truncate whitespace-nowrap">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-72 min-w-0">
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <LayoutGrid size={24} />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate max-w-[150px] sm:max-w-none">{adminTab}</h2>
                <p className="hidden sm:block text-xs text-slate-500">Real-time system insights</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
              <div className="flex relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-slate-50 border border-slate-100 rounded-xl py-2 sm:py-2.5 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm w-32 sm:w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="relative w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <AlertCircle size={18} />
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-100">
                  <div className="text-right hidden xs:block sm:block">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-[60px] sm:max-w-none">{profile?.name?.split(' ')[0] || 'Admin'}</div>
                    <div className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Admin</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-100">
                    {(profile?.name || 'AD').charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className={`mx-auto ${adminTab === 'Live Map' ? 'w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-73px)]' : 'p-2 sm:p-4 max-w-7xl'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={adminTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={adminTab === 'Live Map' ? 'h-full overflow-hidden' : ''}
              >
                {adminTab === 'Overview' && renderOverview()}
                {adminTab === 'Live Map' && <LogisticsDashboard />}
                {adminTab === 'Sales' && renderAdminSales()}
                {adminTab === 'Clients & Orders' && renderAdminClientsOrders()}
                {adminTab === 'Manufacturing' && <SupervisorDashboard isAdminView={true} />}
                {adminTab === 'Delivery' && renderAdminDelivery()}
                {adminTab === 'Finance' && renderAdminFinance()}
                {adminTab === 'Data Sync' && <DataSync />}
                {adminTab !== 'Overview' && adminTab !== 'Live Map' && adminTab !== 'Sales' && adminTab !== 'Clients & Orders' && adminTab !== 'Manufacturing' && adminTab !== 'Delivery' && adminTab !== 'Finance' && adminTab !== 'Data Sync' && (
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                      {adminTab === 'Users' && <Users size={48} />}
                      {adminTab === 'System' && <Server size={48} />}
                      {adminTab === 'Logs' && <History size={48} />}
                      {adminTab === 'Settings' && <Settings size={48} />}
                      {adminTab === 'Delivery' && <Truck size={48} />}
                      {adminTab === 'Finance' && <DollarSign size={48} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{adminTab} Module</h3>
                      <p className="text-slate-500 mt-2">This section is currently being synchronized with real-time data.</p>
                    </div>
                    <button className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-100 hover:scale-105 transition-transform">
                      Refresh Module
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

      </div>
    );
  };

export default AdminDashboard;
