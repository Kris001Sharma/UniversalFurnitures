import React, { useState, useEffect } from 'react';
import { LayoutGrid, Users, Package, Clock, Plus, Search, MapPin, Camera, ChevronRight, CheckCircle2, MoreVertical, Phone, Mail, Calendar, ArrowLeft, Filter, Truck, Factory, Hammer, Paintbrush, Box, CheckCircle, TrendingUp, Star, Hash, Settings, Edit, Trash2, ShoppingCart, ShoppingBasket, X, ShieldCheck, UserCircle, Lock, Eye, EyeOff, LogIn, Monitor, Activity, AlertCircle, Users2, ClipboardList, BarChart3, Zap, ShieldAlert, Shield, Key, UserPlus, Database, Server, Wallet, Receipt, CreditCard, FileText, PieChart, Coins, History, Bell, MessageSquare, Navigation, Maximize, Minimize, Compass, ArrowUp, ArrowDown, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppState } from '../../contexts/AppStateContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileModal from '../ProfileModal';
import { DataSync } from '../admin/DataSync';
import { dataService } from '../../services/data.service';
import { Order, Transaction, Product, CartItem, ProductionLine, ProductionRecord, InventoryItem, DeliveryTask, Organization, OrderStatus, OrderCategory, ClientStatus } from '../../types';
import { StatusBadge } from '../StatusBadge';
import { OrderTracker } from '../OrderTracker';

  const SalesDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {
  const { appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, deliveryAgents, setDeliveryAgents, accountants, setAccountants, flipText, setFlipText, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData, addToCart, updateCartQuantity, cartCount, cartTotal, today, endOfNextWeek, renderSortIcon } = useAppState();
  const { profile } = useAuth();
  // Navigation Helper
  const goToDetail = (org: Organization) => {
    setSelectedOrg(org);
    setView('Detail');
  };

  const renderHome = () => (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, {profile?.full_name || 'Agent'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <div 
            onClick={() => setShowSalesProfile(true)}
            className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src="https://picsum.photos/seed/agent/100/100" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveTab('Leads');
            setLeadFilter('Priority');
            setView('List');
          }}
          className="bg-amber-50 p-3 rounded-2xl border border-amber-100 text-amber-700 shadow-sm cursor-pointer"
        >
          <div className="text-[10px] opacity-80 uppercase font-bold mb-1">Priorities</div>
          <div className="text-2xl font-mono font-bold">
            {clients.filter(o => o.nextFollowUp && o.nextFollowUp >= today).length}
          </div>
        </motion.div>
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveTab('Leads');
            setLeadFilter('New');
            setView('List');
          }}
          className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-emerald-700 shadow-sm cursor-pointer"
        >
          <div className="text-[10px] opacity-80 uppercase font-bold mb-1">New Leads</div>
          <div className="text-2xl font-mono font-bold">
            {clients.filter(o => o.status === 'New').length}
          </div>
        </motion.div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-700 shadow-sm">
          <div className="text-[10px] opacity-80 uppercase font-bold mb-1">Orders</div>
          <div className="text-2xl font-mono font-bold">{orders.length}</div>
        </div>
      </div>

      {/* Today's Priorities */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Priorities</h2>
        <div className="space-y-3">
          {clients.filter(o => o.nextFollowUp === today).map(org => (
            <motion.div 
              key={org.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab('Leads');
                goToDetail(org);
              }}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Star size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{org.name}</h3>
                <p className="text-xs text-slate-500">Due Today</p>
              </div>
              <StatusBadge status={org.status} />
              <ChevronRight size={18} className="text-slate-300" />
            </motion.div>
          ))}
          {clients.filter(o => o.nextFollowUp === today).length === 0 && (
            <p className="text-xs text-slate-400 italic px-2">No priorities for today.</p>
          )}
        </div>
      </section>

      {/* Follow-ups */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Follow-ups (Next Week)</h2>
        <div className="space-y-3">
          {clients.filter(o => o.nextFollowUp && o.nextFollowUp > today && o.nextFollowUp <= endOfNextWeek).map(org => (
            <motion.div 
              key={org.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab('Leads');
                goToDetail(org);
              }}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{org.name}</h3>
                <p className="text-xs text-slate-500">Next: {org.nextFollowUp}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </motion.div>
          ))}
          {clients.filter(o => o.nextFollowUp && o.nextFollowUp > today && o.nextFollowUp <= endOfNextWeek).length === 0 && (
            <p className="text-xs text-slate-400 italic px-2">No follow-ups due by next week.</p>
          )}
        </div>
      </section>

      {/* Recent Activity Stream */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h2>
        <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-4 relative">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex-1 pb-4 border-b border-slate-50">
                <p className="text-sm font-medium text-slate-800">Logged visit at <span className="font-bold">City General Hospital</span></p>
                <p className="text-[10px] text-slate-400 font-mono uppercase">2 HOURS AGO</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderLeads = () => {
    // Filter organizations based on leadFilter (which now includes 'Clients')
    const filteredOrgs = clients.filter(org => {
      const matchesSearch = (org.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      
      if (leadFilter === 'Clients') return org.is_client;
      if (leadFilter === 'All') return !org.is_client; // 'All' leads means non-clients
      return !org.is_client && org.status === leadFilter;
    });

    return (
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">CRM</h1>
          <button 
            onClick={() => setView('AddLead')}
            className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100"
          >
            <Plus size={20} />
          </button>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Priority', 'New', 'Active', 'Clients'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setLeadFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${leadFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredOrgs.map(org => (
            <motion.div 
              key={org.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => goToDetail(org)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900">{org.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                  org.is_client ? 'bg-indigo-100 text-indigo-700' :
                  org.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                  'bg-amber-100 text-amber-700'
                }`}>
                  {org.is_client ? 'Client' : org.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <MapPin size={12} />
                <span>{org.address}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <div className="flex -space-x-2">
                  {org.contacts?.map((c, i) => (
                    <div key={c.id} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                      {c.name?.charAt(0) || '?'}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-400">{org.interactions?.length || 0} Interactions</span>
              </div>
            </motion.div>
          ))}
          {filteredOrgs.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm">
              No {leadFilter === 'Clients' ? 'clients' : 'leads'} found for this category.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCatalog = () => {
    const categories = ['Sofas', 'Chairs', 'Tables', 'Kitchen'];
    const filteredProducts = selectedMainCategory 
      ? products.filter(p => p.mainCategory === selectedMainCategory)
      : products;
    const popularProducts = products.slice(1, 7);

    const renderDiscover = () => (
      <div className="space-y-8">
        <div className="relative h-[300px] rounded-3xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800&h=600" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center p-8">
            <h1 className="text-4xl font-bold text-white leading-tight mb-6">
              Renovate<br />your{' '}
              <span className="inline-block min-w-[140px]">
                <AnimatePresence mode="wait">
                  {!flipText ? (
                    <motion.span
                      key="interior"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="inline-block"
                    >
                      interior
                    </motion.span>
                  ) : (
                    <motion.span
                      key="home"
                      initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="inline-block font-calligraphy text-5xl font-normal"
                    >
                      home
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </h1>
            <button 
              onClick={() => setCatalogLevel('category')}
              className="bg-transparent border border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm w-fit transition-all duration-300"
            >
              Go to catalog
            </button>
          </div>
        </div>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Special Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:flex md:gap-4 gap-4 md:overflow-x-auto pb-4 md:scrollbar-hide">
            {[
              { name: 'Schools', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400&h=300' },
              { name: 'Hospitals', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300' },
              { name: 'Industries', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=300' }
            ].map((cat, idx) => (
              <div 
                key={cat.name} 
                className={`relative h-[100px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm ${
                  idx === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'
                } md:min-w-[180px] w-full`}
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white font-bold text-sm tracking-wide uppercase">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-8">
          <div className="flex flex-col items-center text-center mb-10">
            <h1 className="text-4xl font-bebas text-[#912b21] leading-none">POPULAR</h1>
            <h2 className="text-lg font-bebas text-[#b07b6f] tracking-[0.4em] mt-1">PRODUCTS</h2>
            <p className="text-xs text-slate-500 max-w-[280px] mt-4 leading-relaxed">
              Discover a diverse range of stylish Products, each designed to enhance your living with timeless appeal.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-12">
            {popularProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => { setSelectedProduct(product); setCatalogLevel('productDetail'); }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <h3 className="text-sm font-bebas text-[#912b21] uppercase tracking-wider mb-3 text-center">
                  {product.name}
                </h3>
                <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute bottom-2 right-2">
                    <div className="w-9 h-9 bg-[#912b21] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
                      <ShoppingCart size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );

    const renderCategoryProducts = () => (
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setCatalogLevel('discover')} className="p-2 bg-slate-100 rounded-xl text-slate-600">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold whitespace-nowrap">Discover products</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCatalogLevel('cart')} className="relative p-2 bg-slate-100 rounded-xl text-slate-600">
              <ShoppingBasket size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedMainCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${selectedMainCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
            >
              {cat}
            </button>
          ))}
          {selectedMainCategory && (
            <button 
              onClick={() => setSelectedMainCategory(null)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-bold flex items-center gap-1 border border-red-100 animate-in fade-in zoom-in duration-200"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => { setSelectedProduct(product); setCatalogLevel('productDetail'); }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <h3 className="text-sm font-bebas text-[#912b21] uppercase tracking-wider mb-3 text-center">
                {product.name}
              </h3>
              <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-2">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute bottom-2 right-2">
                  <div className="w-9 h-9 bg-[#912b21] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
                    <ShoppingCart size={16} />
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold text-[#912b21]">₹{product.price?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    );

    const renderProductDetail = () => {
      if (!selectedProduct) return null;
      return (
        <div className="space-y-6">
          <header className="flex justify-between items-center">
            <button onClick={() => setCatalogLevel('category')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <button className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-400">
              <Star size={20} />
            </button>
          </header>

          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <div className="flex gap-3 justify-center">
            <div className="w-16 h-16 rounded-xl border-2 border-slate-200 overflow-hidden">
              <img src={selectedProduct.image} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="w-16 h-16 rounded-xl border-2 border-slate-100 overflow-hidden opacity-50">
              <img src={selectedProduct.image} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" />
                <span>4.8</span>
              </div>
              <span className="text-slate-400">145 reviews</span>
            </div>

            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-slate-900">{selectedProduct.name}</h1>
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-200 border-2 border-emerald-500"></div>
                <div className="w-5 h-5 rounded-full bg-stone-200"></div>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="flex items-center justify-between pt-6">
              <div className="text-2xl font-bold text-slate-900">₹{selectedProduct.price.toFixed(2)}</div>
              <button 
                onClick={() => { addToCart(selectedProduct.id); setCatalogLevel('cart'); }}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      );
    };

    const handleCreateDraftOrder = async () => {
      if (!cartClientId) {
        alert('Please select a client first');
        return;
      }
      
      const client = clients.find(org => org.id === cartClientId);
      if (!client) return;

      try {
        const orderData = {
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          org_id: client.id,
          customer_name: client.name,
          category: 'Open',
          sales_agent: 'Current Agent',
          status: 'Draft',
          payment_status: 'Pending',
          total_amount: cartTotal + 70, // including delivery
          tracking_mode: 'Order Level'
        };

        const orderItems = cart.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: product?.price || 0,
            status: 'Pending'
          };
        });

        const newOrder = await dataService.createOrder(orderData, orderItems);

        // Update local state (you might want to re-fetch orders instead)
        const localOrder: Order = {
          id: newOrder.id,
          orgId: client.id,
          orgName: client.name,
          items: [...cart],
          status: 'Received',
          category: 'Open', // Open means Draft in this context
          paymentStatus: 'Pending',
          expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date().toISOString().split('T')[0]
        };

        setOrders([localOrder, ...orders]);
        setCart([]);
        setCartClientId('');
        setCatalogLevel('discover');
        setActiveTab('Orders');
        setOrderTab('Open'); // Switch to Open/Draft orders tab
      } catch (error) {
        console.error("Error creating draft order:", error);
        alert("Failed to create draft order. Please try again.");
      }
    };

    const renderCart = () => (
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setCatalogLevel('category')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center mr-10">Checkout</h1>
        </header>

        {cart.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Client</label>
            <select 
              value={cartClientId}
              onChange={(e) => setCartClientId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">-- Select a client --</option>
              {clients.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4">
          {cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{product.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">₹{product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button 
                      onClick={() => updateCartQuantity(item.productId, -1)}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.productId, 1)}
                      className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {cart.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Package size={40} />
              </div>
              <h3 className="font-bold text-slate-900">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mt-2">Add some furniture to get started!</p>
              <button 
                onClick={() => setCatalogLevel('category')}
                className="mt-6 text-emerald-600 font-bold text-sm"
              >
                Browse Catalog
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="bg-white p-8 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] -mx-6 space-y-4">
            <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
              <span>Subtotal</span>
              <span className="text-slate-900">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
              <span>Delivery charge</span>
              <span className="text-slate-900">₹70.00</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-slate-400 font-bold text-sm">Total</span>
              <span className="text-2xl font-bold text-slate-900">₹{(cartTotal + 70).toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCreateDraftOrder}
              disabled={!cartClientId}
              className="w-full py-4 bg-emerald-700 text-white rounded-2xl font-bold text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Order
            </button>
          </div>
        )}
      </div>
    );

    return (
      <div className="min-h-full">
        {catalogLevel === 'discover' && renderDiscover()}
        {catalogLevel === 'category' && renderCategoryProducts()}
        {catalogLevel === 'productDetail' && renderProductDetail()}
        {catalogLevel === 'cart' && renderCart()}
      </div>
    );
  };

  const renderOrders = () => {
    const filteredOrders = orders.filter(order => 
      (order.orgName || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
      order.category === orderTab
    );

    const renderModernCard = (order: Order) => {
      const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
      const isOpen = order.category === 'Open';

      return (
        <div 
          key={order.id} 
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-emerald-200 transition-all group"
        >
          <div 
            onClick={() => { setSelectedOrder(order); setView('ViewOrder'); }}
            className="p-4 cursor-pointer"
          >
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">{order.orgName}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[11px] font-mono text-slate-400">{order.id}</p>
                {!isOpen && (
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{order.status}</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <div className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">{isOpen ? 'Draft Date' : 'ETD'}</div>
                <div className="text-[13px] font-bold text-slate-700">{isOpen ? order.createdAt : order.expectedDelivery}</div>
              </div>
              <div>
                <div className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">QTY</div>
                <div className="text-[13px] font-bold text-slate-700">{totalItems}</div>
              </div>
              <div className="flex justify-end">
                {isOpen ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const org = clients.find(o => o.id === order.orgId);
                      if (org) {
                        setActiveTab('Leads');
                        goToDetail(org);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors border border-emerald-100 min-w-[80px] tracking-wider"
                  >
                    Follow
                  </button>
                ) : (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation();
                      setSelectedOrder(order); 
                      setView('TrackOrder'); 
                    }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors border border-emerald-100 min-w-[80px] tracking-wider"
                  >
                    Track
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search client or organization..." 
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['Open', 'Active', 'Closed'] as OrderCategory[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setOrderTab(tab)}
                className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${orderTab === tab ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>

            <div className="space-y-4">
              {filteredOrders.map(order => renderModernCard(order))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic text-xs">No {orderTab.toLowerCase()} orders found.</div>
              )}
            </div>
        </div>
      </div>
    );
  };

  const renderPriorities = () => {
    const statusOrder: Record<ClientStatus, number> = {
      'Priority': 1,
      'New': 2,
      'Active': 3
    };

    const sortedPriorities = clients
      .filter(o => o.nextFollowUp)
      .sort((a, b) => {
        // Sort by date ascending
        const dateA = a.nextFollowUp || '';
        const dateB = b.nextFollowUp || '';
        if (dateA !== dateB) return dateA.localeCompare(dateB);
        
        // Then by status order
        return statusOrder[a.status] - statusOrder[b.status];
      });

    return (
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('List')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">All Priorities</h1>
        </header>

        <div className="space-y-4">
          {sortedPriorities.map(org => (
            <motion.div 
              key={org.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => goToDetail(org)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900">{org.name}</h3>
                <StatusBadge status={org.status} />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={14} className={org.nextFollowUp === today ? 'text-amber-500' : 'text-slate-400'} />
                  <span className={org.nextFollowUp === today ? 'font-bold text-amber-600' : ''}>
                    {org.nextFollowUp === today ? 'TODAY' : org.nextFollowUp}
                  </span>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedOrg) return null;
    return (
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('List')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold truncate">{selectedOrg.name}</h1>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${selectedOrg.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {selectedOrg.status} Client
              </span>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <MapPin size={12} /> {selectedOrg.address}
              </p>
            </div>
            <button className="p-2 text-slate-400"><MoreVertical size={20} /></button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button 
              onClick={() => setView('LogInteraction')}
              className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold"
            >
              <Plus size={16} /> LOG VISIT
            </button>
            <button 
              onClick={() => { setActiveTab('Catalog'); setView('List'); }}
              className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold"
            >
              <Package size={16} /> NEW ORDER
            </button>
          </div>
        </div>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Persons</h2>
          <div className="space-y-3">
            {selectedOrg.contacts?.map(contact => (
              <div key={contact.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{contact.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-medium">{contact.role}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone size={16} /></button>
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
              <Plus size={16} /> ADD CONTACT
            </button>
          </div>
        </section>

        <section className="mt-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Activity Log</h2>
            <div className="space-y-4">
              {selectedOrg.interactions?.map(interaction => (
                <div key={interaction.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">{interaction.type}</span>
                      <span className="text-[10px] font-mono text-slate-400">{interaction.date}</span>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${interaction.sentiment === 'High' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                      {interaction.sentiment} INTEREST
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{interaction.notes}</p>
                  {interaction.location && (
                    <div className="mt-2 flex items-center gap-1 text-[8px] text-slate-400 font-mono">
                      <MapPin size={10} /> {interaction.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
      </div>
    );
  };

  const renderViewOrder = () => {
    if (!selectedOrder) return null;
    const isOpen = selectedOrder.category === 'Open';

    return (
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('List')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">{isOpen ? 'Draft Details' : 'Order Details'}</h1>
        </header>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedOrder.orgName}</h2>
                <p className="text-sm font-mono text-slate-400">{selectedOrder.id}</p>
              </div>
              {!isOpen && <StatusBadge status={selectedOrder.status} />}
            </div>

            {!isOpen && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Expected Delivery</p>
                  <p className="text-sm font-bold text-slate-700">{selectedOrder.expectedDelivery}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Status</p>
                  <p className="text-sm font-bold text-emerald-600">{selectedOrder.paymentStatus}</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-50">
              <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-slate-100">
                        <img src={product?.image} alt={product?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">{product?.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{product?.code}</p>
                      </div>
                      <div className="text-xs font-bold text-slate-900">x{item.quantity}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50">
            {isOpen ? (
              <div className="grid grid-cols-3">
                <button 
                  onClick={() => setView('EditOrder')}
                  className="py-3 bg-white text-slate-500 font-bold text-[10px] uppercase tracking-wider border-r border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={async () => {
                    try {
                      // Update order in Supabase
                      await dataService.updateOrder(selectedOrder.id, {
                        status: 'Active'
                      });

                      const updatedOrders = orders.map(o => 
                        o.id === selectedOrder.id 
                          ? { ...o, category: 'Active', status: 'Received' } 
                          : o
                      );
                      setOrders(updatedOrders);
                      
                      // Add to active manufacturing orders
                      const totalUnits = selectedOrder.items.reduce((acc, item) => acc + item.quantity, 0);
                      const newActiveOrder = {
                        orderId: selectedOrder.id,
                        customer: selectedOrder.orgName,
                        totalUnits: totalUnits,
                        completedUnits: 0,
                        tracking_mode: 'Order Level',
                        overallStage: 'Received',
                        items: []
                      };
                      setActiveOrders([newActiveOrder, ...activeOrders]);

                      // Add expected transaction for finance
                      let orderTotal = 0;
                      selectedOrder.items.forEach(item => {
                        const product = products.find(p => p.id === item.productId);
                        if (product && product.price) {
                          orderTotal += product.price * item.quantity;
                        }
                      });
                      
                      const newTransaction = {
                        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
                        order_id: selectedOrder.id,
                        date: new Date().toISOString().split('T')[0],
                        description: `Order Payment - ${selectedOrder.id}`,
                        amount: orderTotal,
                        type: 'Income',
                        status: 'Pending'
                      };
                      await dataService.createTransaction(newTransaction);
                      setTransactions([newTransaction, ...transactions]);
                      
                      // Update client status to active client
                      await dataService.updateClient(selectedOrder.orgId, { is_client: true, status: 'Active' });
                      const updatedClients = clients.map(c => 
                        c.id === selectedOrder.orgId 
                          ? { ...c, is_client: true, status: 'Active' } 
                          : c
                      );
                      setClients(updatedClients);
                      
                      setView('List');
                      setOrderTab('Active');
                      alert(`Order ${selectedOrder.id} Placed Successfully!`);
                    } catch (error) {
                      console.error("Error placing order:", error);
                      alert("Failed to place order. Please try again.");
                    }
                  }}
                  className="py-3 bg-white text-emerald-600 font-bold text-[10px] uppercase tracking-wider border-r border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  Place
                </button>
                <button 
                  onClick={() => alert(`Draft ${selectedOrder.id} Deleted!`)}
                  className="py-3 bg-white text-rose-600 font-bold text-[10px] uppercase tracking-wider hover:bg-rose-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="p-6 pt-0">
                <button 
                  onClick={() => alert('Redirecting to Create New Order...')}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 shadow-emerald-100"
                >
                  <Plus size={18} /> PLACE NEW ORDER
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEditOrder = () => {
    if (!selectedOrder) return null;
    return (
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('List')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Edit Order</h1>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Expected Delivery Date</label>
            <input type="date" defaultValue={selectedOrder.expectedDelivery} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Manufacturing Stage</label>
            <select defaultValue={selectedOrder.status} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none appearance-none">
              {['Received', 'Metal Forging', 'Wood Cutting', 'Assembly', 'Painting', 'Finishing', 'Delivery'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Modify Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">{product?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-6 h-6 bg-white rounded-lg border border-slate-200 text-slate-400">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button className="w-6 h-6 bg-white rounded-lg border border-slate-200 text-slate-400">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg mt-6">
            SAVE CHANGES
          </button>
        </div>
      </div>
    );
  };

  const renderTrackOrder = () => {
    if (!selectedOrder) return null;
    return (
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('List')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Track Order</h1>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">{selectedOrder.orgName}</h2>
            <p className="text-xs font-mono text-slate-400 mt-1">Status: {selectedOrder.status}</p>
          </div>

          <OrderTracker orderProgress={selectedOrder.progress || {
            preparation: { status: 'pending', timestamp: null },
            manufacturing: { status: 'pending', timestamp: null },
            qualityCheck: { status: 'pending', timestamp: null },
            readyForDispatch: { status: 'pending', timestamp: null },
            dispatched: { status: 'pending', timestamp: null },
            delivered: { status: 'pending', timestamp: null }
          }} />

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Timeline</h3>
            <div className="space-y-6">
              {[
                { time: '09:30 AM', event: 'Quality Check Completed', status: 'done' },
                { time: 'Yesterday', event: 'Assembly Phase Finished', status: 'done' },
                { time: 'Mar 04', event: 'Order Received & Verified', status: 'done' }
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 text-[10px] font-mono text-slate-400 pt-1">{log.time}</div>
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10 relative"></div>
                    {i < 2 && <div className="absolute top-3 left-1.5 w-0.5 h-10 bg-slate-100 -translate-x-1/2"></div>}
                  </div>
                  <div className="text-xs font-bold text-slate-700">{log.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleCreateLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient = {
      name: formData.get('name'),
      address: formData.get('address'),
      contact_person: formData.get('contactName'),
      contact: formData.get('phone'),
      email: formData.get('email'),
      status: 'New',
      is_client: false
    };

    try {
      setIsLoadingData(true);
      await dataService.createClient(newClient);
      const fetchedClients = await dataService.getClients();
      setClients(fetchedClients);
      setView('List');
    } catch (error) {
      console.error("Failed to create lead", error);
      alert("Failed to create lead.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const renderAddLead = () => (
    <form onSubmit={handleCreateLeadSubmit} className="space-y-6">
      <header className="flex items-center gap-4">
        <button type="button" onClick={() => setView('List')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">New Organization</h1>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Organization Name</label>
          <input name="name" type="text" required placeholder="e.g. St. Jude School" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Address</label>
          <textarea name="address" required placeholder="Full physical address" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none h-20" />
        </div>
        
        <div className="pt-4 border-t border-slate-50">
          <h3 className="text-xs font-bold text-slate-900 mb-3">Primary Contact</h3>
          <div className="space-y-3">
            <input name="contactName" required type="text" placeholder="Contact Name" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
            <input name="role" type="text" placeholder="Role / Designation" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input name="phone" required type="tel" placeholder="Phone" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
              <input name="email" required type="email" placeholder="Email" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoadingData} className={`w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 mt-6 flex justify-center ${isLoadingData ? 'opacity-70' : 'hover:bg-emerald-700'} transition-all`}>
          {isLoadingData ? 'SAVING...' : 'CREATE LEAD'}
        </button>
      </div>
    </form>
  );

  const renderLogInteraction = () => (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => setView('Detail')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Log Activity</h1>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex gap-4">
          <button className="flex-1 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100">IN-PERSON VISIT</button>
          <button className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-2xl text-xs font-bold border border-slate-100">PHONE CALL</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 text-slate-400">
            <Camera size={24} />
            <span className="text-[10px] font-bold uppercase">Add Photo</span>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center gap-2 text-emerald-600">
            <MapPin size={24} />
            <span className="text-[10px] font-bold uppercase">Location Captured</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Sentiment / Interest Level</label>
          <div className="flex gap-2">
            {['Low', 'Medium', 'High'].map(s => (
              <button key={s} className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase border ${s === 'High' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Notes</label>
          <textarea placeholder="What did you discuss?" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none h-32" />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Next Follow-up Date</label>
          <input type="date" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
        </div>

        <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100">
          SAVE ACTIVITY
        </button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <main className="max-w-md mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + view + (selectedOrg?.id || '') + (selectedOrder?.id || '')}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Home' && (view === 'Priorities' ? renderPriorities() : renderHome())}
            {activeTab === 'Leads' && (view === 'List' ? renderLeads() : view === 'Detail' ? renderDetail() : view === 'AddLead' ? renderAddLead() : renderLogInteraction())}
            {activeTab === 'Catalog' && renderCatalog()}
            {activeTab === 'Orders' && (
              view === 'List' ? renderOrders() :
              view === 'ViewOrder' ? renderViewOrder() :
              view === 'EditOrder' ? renderEditOrder() :
              renderTrackOrder()
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {[
          { id: 'Home', icon: LayoutGrid, label: 'Home', action: () => { setActiveTab('Home'); setView('List'); } },
          { id: 'Leads', icon: Users, label: 'Leads', action: () => { setActiveTab('Leads'); setView('List'); } },
          { id: 'Catalog', icon: Package, label: 'Catalog', action: () => { setActiveTab('Catalog'); setCatalogLevel('discover'); }, badge: cartCount },
          { id: 'Orders', icon: Truck, label: 'Orders', action: () => { setActiveTab('Orders'); setView('List'); } },
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
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-50 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative">
                <Icon 
                  size={isActive ? 22 : 20} 
                  className={`transition-all duration-300 ${isActive ? 'text-emerald-600 scale-110' : 'text-slate-400 group-hover:text-slate-500'}`} 
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-[6px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white transition-colors ${isActive ? 'bg-emerald-600' : 'bg-emerald-500'}`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-bold uppercase mt-1 tracking-wider transition-all duration-300 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <ProfileModal 
        isOpen={showSalesProfile} 
        onClose={() => setShowSalesProfile(false)} 
        onSignOut={handleSignOut}
        stats={[
          { label: 'Orders This Month', value: 45 },
          { label: 'Total Revenue', value: '₹12.4k' }
        ]}
      />
    </div>
  );
};
export default SalesDashboard;