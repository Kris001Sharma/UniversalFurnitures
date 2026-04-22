import React, { useState, useEffect } from 'react';
import { LayoutGrid, Users, Package, Clock, Plus, Search, MapPin, Camera, ChevronRight, CheckCircle2, MoreVertical, Phone, Mail, Calendar, ArrowLeft, Filter, Truck, Factory, Hammer, Paintbrush, Box, CheckCircle, TrendingUp, Star, Hash, Settings, Edit, Trash2, ShoppingCart, ShoppingBasket, X, ShieldCheck, UserCircle, Lock, Eye, EyeOff, LogIn, Monitor, Activity, AlertCircle, Users2, ClipboardList, BarChart3, Zap, ShieldAlert, Shield, Key, UserPlus, Database, Server, Wallet, Receipt, CreditCard, FileText, PieChart, Coins, History, Bell, MessageSquare, Navigation, Maximize, Minimize, Compass, ArrowUp, ArrowDown, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    const renderInventory = () => (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Items</div>
            <div className="text-3xl font-bold text-slate-900">{inventory.length}</div>
          </div>
          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Low Stock Alerts</div>
            <div className="text-3xl font-bold text-rose-700">2</div>
          </div>
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">To Be Manufactured</div>
            <div className="text-3xl font-bold text-amber-700">1</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Inventory Details</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><Search size={18} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><Filter size={18} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Level</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                        item.category === 'Raw Material' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-slate-700">{item.stock} {item.unit}</div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.status === 'Low Stock' ? 'bg-rose-500' : 
                              item.status === 'Out of Stock' ? 'bg-slate-300' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Low Stock' ? 'bg-rose-100 text-rose-700' :
                        item.status === 'To Be Manufactured' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 font-bold text-xs hover:underline">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    const renderProductionLog = () => (
      <div className="space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Production & Delivery History</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              <FileText size={14} /> Export Log
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produced Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivered To</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {productionLog.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{record.itemName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{record.producedDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{record.deliveredTo}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        record.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        record.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors">
                        <Truck size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    const renderActiveManufacturing = () => (
      <div className="space-y-8">
        {activeOrders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-lg">{order.orderId}</h3>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">In Manufacturing</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider border border-slate-200">
                    {order.tracking_mode || 'Item Level'} Tracking
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Customer: {order.customer}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">{order.completedUnits} / {order.totalUnits} Units Completed</div>
                <div className="w-48 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(order.completedUnits / order.totalUnits) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {order.tracking_mode === 'Order Level' ? (
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Order Stage</h4>
                    <div className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      {order.overallStage || 'In Progress'}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                    Update Order Stage
                  </button>
                </div>
              ) : (
                <>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Unit Level Progress</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {order.items.map((unit: any) => (
                      <div key={unit.unitId} className={`p-4 rounded-2xl border transition-all ${
                        unit.status === 'Completed' ? 'bg-emerald-50 border-emerald-100' :
                        unit.status === 'In Progress' ? 'bg-indigo-50 border-indigo-100' :
                        'bg-slate-50 border-slate-100'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-slate-400">Unit {unit.unitId}</span>
                          {unit.status === 'Completed' ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : unit.status === 'In Progress' ? (
                            <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Clock size={14} className="text-slate-300" />
                          )}
                        </div>
                        <div className={`text-xs font-bold ${
                          unit.status === 'Completed' ? 'text-emerald-700' :
                          unit.status === 'In Progress' ? 'text-indigo-700' :
                          'text-slate-500'
                        }`}>{unit.stage}</div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">{unit.status}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-indigo-600">{order.totalUnits - order.completedUnits} units remaining</span> to finish this order.
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View Detailed Timeline</button>
            </div>
          </div>
        ))}
      </div>
    );

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
      return (
        <div className="space-y-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Overview', 'Inventory', 'Production Log', 'Active Manufacturing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSupervisorTab(tab as any)}
                className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${supervisorTab === tab ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={supervisorTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {supervisorTab === 'Overview' && renderOverview()}
              {supervisorTab === 'Inventory' && renderInventory()}
              {supervisorTab === 'Production Log' && renderProductionLog()}
              {supervisorTab === 'Active Manufacturing' && renderActiveManufacturing()}
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-8 fixed h-full z-50">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Supervisor</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operations Control</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'Overview', icon: LayoutGrid, label: 'Dashboard' },
              { id: 'Inventory', icon: Package, label: 'Inventory Management' },
              { id: 'Production Log', icon: History, label: 'Production Log' },
              { id: 'Active Manufacturing', icon: Factory, label: 'Active Manufacturing' },
              { id: 'Team', icon: Users2, label: 'Team Management' },
              { id: 'Alerts', icon: ShieldAlert, label: 'System Alerts' },
              { id: 'Settings', icon: Settings, label: 'Settings' },
            ].map((item) => {
              const isActive = supervisorTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => setSupervisorTab(item.id as any)}
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
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 text-slate-500">
                <LayoutGrid size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{supervisorTab}</h2>
                <p className="text-xs text-slate-500">Welcome back, {profile?.full_name || 'Agent'}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button className="relative w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <AlertCircle size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900">{profile?.full_name || 'Agent'}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.role || 'Line Supervisor'}</div>
                  </div>
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                    SM
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={supervisorTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {supervisorTab === 'Overview' && renderOverview()}
                {supervisorTab === 'Inventory' && renderInventory()}
                {supervisorTab === 'Production Log' && renderProductionLog()}
                {supervisorTab === 'Active Manufacturing' && renderActiveManufacturing()}
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
            { id: 'Inventory', icon: Package, label: 'Inventory' },
            { id: 'Production Log', icon: History, label: 'Log' },
            { id: 'Active Manufacturing', icon: Factory, label: 'Active' },
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
      </div>
    );
  };

export default SupervisorDashboard;
