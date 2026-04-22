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


  const AccountantDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {
  const { profile } = useAuth();
  const { appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, deliveryAgents, setDeliveryAgents, accountants, setAccountants, flipText, setFlipText, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData } = useAppState();
    const renderOverview = () => (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 opacity-30" />
            <div className="relative z-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Balance</div>
              <div className="text-5xl font-bold text-slate-900 mb-8">₹42,850.00</div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <TrendingUp size={16} />
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Monthly Income</div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">+₹12,400.00</div>
                  <div className="text-[10px] text-emerald-600/70 mt-1">+15% from last month</div>
                </div>
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                      <TrendingUp size={16} className="rotate-180" />
                    </div>
                    <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Monthly Expenses</div>
                  </div>
                  <div className="text-2xl font-bold text-rose-700">-₹4,200.00</div>
                  <div className="text-[10px] text-rose-600/70 mt-1">-5% from last month</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-600 p-8 rounded-3xl shadow-lg shadow-amber-100 text-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CreditCard size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Corporate Card</span>
              </div>
              <div className="text-2xl font-mono mb-2 tracking-wider">**** **** **** 8829</div>
              <div className="text-sm opacity-80">Balance: ₹12,450.00</div>
            </div>
            <div className="flex justify-between items-end mt-8">
              <div>
                <div className="text-[10px] uppercase opacity-60 mb-1">Card Holder</div>
                <div className="text-sm font-bold">FINANCE DEPT</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase opacity-60 mb-1">Expires</div>
                <div className="text-sm font-bold">08/28</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Cash Flow Trend</h3>
                <p className="text-xs text-slate-500">Income vs Expenses (Last 6 Months)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Expenses</span>
                </div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CASH_FLOW_DATA}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#f43f5e" 
                    strokeWidth={3}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <Receipt size={28} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">14</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Invoices</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <PieChart size={28} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">84%</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget Utilization</div>
              </div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700">Tax Ready</div>
                <div className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider">Q1 Audit Complete</div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
              <p className="text-sm text-slate-500">Real-time financial activity log</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 shadow-sm">Export CSV</button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-100">Add Transaction</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(tx => (
                  <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold text-slate-900">{tx.id}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{tx.date}</td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-700">{tx.description}</td>
                    <td className={`px-8 py-4 text-sm font-bold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        tx.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>{tx.type}</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-medium text-slate-600">{tx.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );

    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-8 fixed h-full z-50">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Accountant</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Financial Control</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'Overview', icon: LayoutGrid, label: 'Dashboard' },
              { id: 'Transactions', icon: History, label: 'Transactions' },
              { id: 'Invoices', icon: Receipt, label: 'Invoices' },
              { id: 'Reports', icon: FileText, label: 'Financial Reports' },
              { id: 'Settings', icon: Settings, label: 'Settings' },
            ].map((item) => {
              const isActive = accountantTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => setAccountantTab(item.id as any)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'text-slate-500 hover:bg-slate-50'
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
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-all group"
            >
              <LogIn size={20} className="text-slate-400 group-hover:text-amber-600 rotate-180" />
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
                <h2 className="text-xl font-bold text-slate-900">{accountantTab}</h2>
                <p className="text-xs text-slate-500">Financial overview and tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button className="relative w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900">{profile?.full_name || 'Finance Team'}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.role || 'Senior Accountant'}</div>
                  </div>
                  <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-amber-100">
                    FT
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8 max-w-7xl mx-auto">
      const { profile } = useAuth();
        <AnimatePresence mode="wait">
              <motion.div
                key={accountantTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {accountantTab === 'Overview' && renderOverview()}
                {accountantTab !== 'Overview' && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-600">
                      {accountantTab === 'Transactions' && <History size={48} />}
                      {accountantTab === 'Invoices' && <Receipt size={48} />}
                      {accountantTab === 'Reports' && <FileText size={48} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{accountantTab} Module</h3>
                      <p className="text-slate-500 mt-2">Financial data is being synchronized for this section.</p>
                    </div>
                    <button className="px-8 py-3 bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-100 hover:scale-105 transition-transform">
                      Refresh Records
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {[
            { id: 'Overview', icon: LayoutGrid, label: 'Home' },
            { id: 'Transactions', icon: History, label: 'Trans.' },
            { id: 'Invoices', icon: Receipt, label: 'Invoices' },
            { id: 'Reports', icon: FileText, label: 'Reports' },
          ].map((tab) => {
            const isActive = accountantTab === tab.id;
            const Icon = tab.icon;

            return (
              <button key={tab.id} onClick={() => setAccountantTab(tab.id as any)} className="relative flex flex-col items-center justify-center py-1 px-4 transition-all duration-300 outline-none group">
                {isActive && <motion.div layoutId="activeAccountantTabMobile" className="absolute inset-0 bg-amber-50 rounded-2xl -z-10" />}
                <Icon size={isActive ? 22 : 20} className={`transition-all duration-300 ${isActive ? 'text-amber-600 scale-110' : 'text-slate-400'}`} />
                <span className={`text-[9px] font-bold uppercase mt-1 tracking-wider ${isActive ? 'text-amber-700' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

export default AccountantDashboard;
