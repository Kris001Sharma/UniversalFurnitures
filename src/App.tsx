import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, 
  Users, 
  Package, 
  Clock, 
  Plus, 
  Search, 
  MapPin, 
  Camera, 
  ChevronRight, 
  CheckCircle2, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowLeft,
  Filter,
  Truck,
  Factory,
  Hammer,
  Paintbrush,
  Box,
  CheckCircle,
  TrendingUp,
  Star,
  Hash,
  Settings,
  Edit,
  Trash2,
  ShoppingCart,
  ShoppingBasket,
  X,
  ShieldCheck,
  UserCircle,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Monitor,
  Activity,
  AlertCircle,
  Users2,
  ClipboardList,
  BarChart3,
  Zap,
  ShieldAlert,
  Shield,
  Key,
  UserPlus,
  Database,
  Server,
  Wallet,
  Receipt,
  CreditCard,
  FileText,
  PieChart,
  Coins,
  History,
  Bell,
  MessageSquare,
  Navigation,
  Maximize,
  Minimize,
  Compass,
  Crosshair,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Order, Transaction, Product, CartItem, ProductionLine, ProductionRecord, InventoryItem, DeliveryTask, Organization, OrderStatus, OrderCategory } from './types';
import SalesDashboard from './components/dashboards/SalesDashboard';
import AccountantDashboard from './components/dashboards/AccountantDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import SupervisorDashboard from './components/dashboards/SupervisorDashboard';
import { AppStateProvider } from './contexts/AppStateContext';
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'Manufacturing': 'bg-blue-100 text-blue-700',
    'Delivered': 'bg-emerald-100 text-emerald-700',
    'Pending': 'bg-amber-100 text-amber-700',
    'High': 'bg-rose-100 text-rose-700',
    'Priority': 'bg-rose-100 text-rose-700',
    'New': 'bg-blue-100 text-blue-700',
    'Active': 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};
const DeliveryMap = React.lazy(() => import('./DeliveryMap'));
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';

import { DataSync } from './components/admin/DataSync';
import DeliveryDashboard from './components/dashboards/DeliveryDashboard';
import ProfileModal from './components/ProfileModal';
import { appConfig } from './config/appConfig';
import { useAuth } from './contexts/AuthContext';
import { authService } from './services/auth.service';
import { dataService } from './services/data.service';

// --- Types ---


// --- Analytics Chart Setup ---
const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 2000, orders: 12 },
  { name: 'Thu', revenue: 2780, orders: 20 },
  { name: 'Fri', revenue: 1890, orders: 15 },
  { name: 'Sat', revenue: 2390, orders: 17 },
  { name: 'Sun', revenue: 3490, orders: 22 },
];

const PRODUCTION_DATA = [
  { name: 'Forging', completed: 45, pending: 12 },
  { name: 'Cutting', completed: 38, pending: 8 },
  { name: 'Assembly', completed: 52, pending: 15 },
  { name: 'Painting', completed: 30, pending: 5 },
  { name: 'Finishing', completed: 25, pending: 10 },
];

  const AGENT_PERFORMANCE = [
    { name: 'John Sales', leads: 45, conversions: 12, revenue: 12500 },
    { name: 'Sarah Miller', leads: 38, conversions: 15, revenue: 18200 },
    { name: 'Mike Ross', leads: 52, conversions: 10, revenue: 9800 },
    { name: 'Jane Smith', leads: 30, conversions: 8, revenue: 7500 },
  ];

  const CASH_FLOW_DATA = [
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Feb', income: 52000, expenses: 34000 },
    { month: 'Mar', income: 48000, expenses: 31000 },
    { month: 'Apr', income: 61000, expenses: 38000 },
    { month: 'May', income: 55000, expenses: 35000 },
    { month: 'Jun', income: 67000, expenses: 42000 },
  ];

// --- Components ---

const OrderTracker = ({ status }: { status: OrderStatus }) => {
  const stages: OrderStatus[] = ['Draft', 'Received', 'In Production', 'Ready for Delivery', 'Out for Delivery', 'Delivered'];
  const currentIndex = stages.indexOf(status);

  const getIcon = (stage: OrderStatus) => {
    switch (stage) {
      case 'Draft': return <Box size={14} />;
      case 'Received': return <Box size={14} />;
      case 'In Production': return <Factory size={14} />;
      case 'Ready for Delivery': return <CheckCircle size={14} />;
      case 'Out for Delivery': return <Truck size={14} />;
      case 'Delivered': return <CheckCircle2 size={14} />;
      default: return <Box size={14} />;
    }
  };

  return (
    <div className="py-6">
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        ></div>
        
        {stages.map((stage, idx) => (
          <div key={stage} className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${idx <= currentIndex ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
              {idx < currentIndex ? <CheckCircle2 size={16} /> : getIcon(stage)}
            </div>
            {idx === currentIndex && (
              <span className="absolute -bottom-6 text-[8px] font-bold text-emerald-600 uppercase whitespace-nowrap tracking-tighter">
                {stage}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---


export default function App() {
  const { user, profile, isLoading } = useAuth();
  const [appView, setAppView] = useState<'selection' | 'login' | 'dashboard'>(appConfig.devMode ? 'selection' : 'login');
  const [selectedDashboard, setSelectedDashboard] = useState<'sales' | 'supervisor' | 'admin' | 'accountant' | 'delivery' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [loginRole, setLoginRole] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSalesProfile, setShowSalesProfile] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!appConfig.devMode && user && appView === 'login') {
      if (isLoading) return; // Wait for profile to load

      // If we don't have a specific dashboard selected yet, infer it from profile
      if (profile) {
        const role = profile.role;
        let inferredDashboard: 'sales' | 'supervisor' | 'admin' | 'accountant' | 'delivery' | null = null;
        if (role === 'SALES') inferredDashboard = 'sales';
        else if (role === 'SUPERVISOR') inferredDashboard = 'supervisor';
        else if (role === 'ADMIN') inferredDashboard = 'admin';
        else if (role === 'ACCOUNTS') inferredDashboard = 'accountant';
        else if (role === 'DELIVERY') inferredDashboard = 'delivery';

        if (inferredDashboard) {
           setSelectedDashboard(inferredDashboard);
           setAppView('dashboard');
           return;
        }
      }
      setLoginError('User profile not found. Please contact administrator.');
    }
  }, [user, profile, isLoading, appView]);

  const handleEmailCheck = async () => {
    if (!loginEmail.trim()) {
      setLoginError('Please enter an email address');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);
    
    try {
      const role = await authService.checkEmailRole(loginEmail);
      if (role) {
        setLoginRole(role);
        
        // Infer dashboard to adjust UI colors before we even finish logging in
        if (role === 'SALES') setSelectedDashboard('sales');
        else if (role === 'SUPERVISOR') setSelectedDashboard('supervisor');
        else if (role === 'ADMIN') setSelectedDashboard('admin');
        else if (role === 'ACCOUNTS') setSelectedDashboard('accountant');
        else if (role === 'DELIVERY') setSelectedDashboard('delivery');
        
        setLoginStep(2);
      } else {
        setLoginError('Email not found in our system.');
      }
    } catch (err: any) {
      console.error('Email check error:', err);
      setLoginError('Unable to verify email at this time.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await authService.login(loginEmail, loginPassword);
      // The auto-redirect effect will handle the transition
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (!appConfig.devMode) {
        await authService.logout();
      }
      setAppView(appConfig.devMode ? 'selection' : 'login');
      setSelectedDashboard(null);
      setLoginStep(1);
      setLoginRole(null);
      setLoginPassword('');
    } catch (e) {
      console.error('Signout Error', e);
    }
  };

  const [supervisorTab, setSupervisorTab] = useState<'Overview' | 'Inventory' | 'Production Log' | 'Active Manufacturing' | 'Team' | 'Alerts' | 'Settings'>('Overview');
  const [adminTab, setAdminTab] = useState<'Overview' | 'Sales' | 'Clients & Orders' | 'Manufacturing' | 'Delivery' | 'Finance' | 'Users' | 'System' | 'Logs' | 'Data Sync' | 'Settings'>('Overview');
  const [selectedAdminSalesAgent, setSelectedAdminSalesAgent] = useState<string | null>(null);
  const [selectedAgentTile, setSelectedAgentTile] = useState<'clients' | 'leads' | 'schedule' | null>(null);
  const [agentDetailTab, setAgentDetailTab] = useState<string>('active');
  const [chatContext, setChatContext] = useState<string>('');
  const [selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent] = useState<string | null>(null);
  const [selectedDeliveryAgentTile, setSelectedDeliveryAgentTile] = useState<'tasks' | 'schedule' | null>(null);
  const [deliveryAgentDetailTab, setDeliveryAgentDetailTab] = useState<string>('active');
  const [deliveryChatContext, setDeliveryChatContext] = useState<string>('');
  const [clientsSearchQuery, setClientsSearchQuery] = useState('');
  const [clientsOrdersMainTab, setClientsOrdersMainTab] = useState<'activeOrders' | 'draftOrders' | 'leads' | 'allClients'>('activeOrders');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />;
    }
    return <ArrowDown size={14} className="inline ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />;
  };

  const sortData = (data: any[]) => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };
  const [selectedAdminOrderDetails, setSelectedAdminOrderDetails] = useState<string | null>(null);
  const [selectedClientDetails, setSelectedClientDetails] = useState<string | null>(null);
  const [clientDetailTab, setClientDetailTab] = useState<'active' | 'past' | 'draft'>('active');
  const [allClientsFilter, setAllClientsFilter] = useState<'All' | 'Active Client' | 'Past Client' | 'Active Lead' | 'Inactive Lead'>('All');
  const [showClientsFilters, setShowClientsFilters] = useState(false);
  const [clientsSortBy, setClientsSortBy] = useState<'newest' | 'value_high' | 'value_low'>('newest');
  const [selectedAdminAccountant, setSelectedAdminAccountant] = useState<string | null>(null);
  const [accountantTab, setAccountantTab] = useState<'Overview' | 'Transactions' | 'Invoices' | 'Reports'>('Overview');
  const [activeTab, setActiveTab] = useState<'Home' | 'Leads' | 'Catalog' | 'Orders'>('Home');
  const [catalogLevel, setCatalogLevel] = useState<'discover' | 'category' | 'productDetail' | 'cart'>('discover');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Chairs');
  const [view, setView] = useState<'List' | 'Detail' | 'AddLead' | 'LogInteraction' | 'CreateOrder' | 'Priorities' | 'ViewOrder' | 'EditOrder' | 'TrackOrder'>('List');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [leadFilter, setLeadFilter] = useState<string>('All');
  const [orderTab, setOrderTab] = useState<OrderCategory>('Active');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartClientId, setCartClientId] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [productionLog, setProductionLog] = useState<ProductionRecord[]>([]);
  const [salesAgents, setSalesAgents] = useState<any[]>([]);
  const [deliveryAgents, setDeliveryAgents] = useState<any[]>([]);
  const [accountants, setAccountants] = useState<any[]>([]);
  const [flipText, setFlipText] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (appView === 'dashboard' && !isLoading) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          let [fetchedClients, fetchedOrders, fetchedTransactions, fetchedProducts, fetchedInventory, fetchedProductionLines, fetchedProductionLog, fetchedSalesAgents, fetchedDeliveryAgents, fetchedAccountants] = await Promise.all([
            dataService.getClients(profile?.role === 'SALES' ? profile.id : undefined),
            dataService.getOrders(),
            dataService.getTransactions(),
            dataService.getProducts(),
            dataService.getInventory(),
            dataService.getProductionLines(),
            dataService.getProductionLog(),
            dataService.getSalesAgents(),
            dataService.getDeliveryAgents(),
            dataService.getAccountants()
          ]);
          
          if (profile?.role === 'SALES') {
             if (fetchedOrders && fetchedClients) {
               const myClientIds = fetchedClients.map((c: any) => c.id);
               fetchedOrders = fetchedOrders.filter((o: any) => myClientIds.includes(o.org_id));
             }
          }
          
          if (fetchedClients && fetchedClients.length > 0) {
            setClients(fetchedClients.filter((c: any) => !c.is_deleted));
          }
          if (fetchedSalesAgents && fetchedSalesAgents.length > 0) {
             const mappedAgents = fetchedSalesAgents.map((a: any) => {
                 const metrics = a.sales_agent_metrics?.[0] || {};
                 return {
                     id: a.id,
                     name: a.name,
                     role: a.role,
                     leads: metrics.leads || 0,
                     activeClients: metrics.active_clients || 0,
                     pastClients: metrics.past_clients || 0,
                     revenue: metrics.revenue ? `₹${metrics.revenue.toLocaleString()}` : '₹0',
                     conversion: metrics.conversion ? `${metrics.conversion}%` : '0%',
                     status: a.status || 'Online',
                     reportsTo: a.reports_to || null
                 };
             });
             setSalesAgents(mappedAgents);
          }
          if (fetchedDeliveryAgents && fetchedDeliveryAgents.length > 0) {
             const mappedAgents = fetchedDeliveryAgents.map((a: any) => ({
                 id: a.id,
                 name: a.name,
                 role: a.role,
                 activeToday: Math.floor(Math.random() * 5),
                 doneToday: Math.floor(Math.random() * 10),
                 currentClient: 'None',
                 efficiency: a.accuracy || '98%',
                 status: a.status || 'Available',
                 reportsTo: a.reports_to || null
             }));
             setDeliveryAgents(mappedAgents);
          }
          if (fetchedAccountants && fetchedAccountants.length > 0) {
             const mappedAgents = fetchedAccountants.map((a: any) => {
                 const metrics = a.accountant_metrics?.[0] || {};
                 return {
                     id: a.id,
                     name: a.name,
                     role: a.role,
                     processedInvoices: metrics.processed_invoices || 0,
                     pendingApprovals: metrics.pending_approvals || 0,
                     accuracy: metrics.accuracy || '100%',
                     status: a.status || 'Online',
                     reportsTo: a.reports_to || null
                 };
             });
             setAccountants(mappedAgents);
          }
          if (fetchedProductionLog && fetchedProductionLog.length > 0) {
            const mappedLog = fetchedProductionLog.map((l: any) => ({
              id: l.id,
              itemName: l.product_name || 'Unknown Product',
              producedDate: l.date || new Date().toISOString().split('T')[0],
              deliveredTo: l.delivered_to || 'Warehouse',
              status: l.status || 'Produced'
            }));
            setProductionLog(mappedLog);
          }
          if (fetchedProductionLines && fetchedProductionLines.length > 0) {
            const mappedLines = fetchedProductionLines.map((l: any) => ({
              id: l.id,
              name: l.name,
              status: l.status,
              efficiency: l.efficiency || 85,
              output: l.output || 0,
              target: l.target || 100,
              operator: l.operator || 'Unassigned'
            }));
            setProductionLines(mappedLines);
          }
          if (fetchedInventory && fetchedInventory.length > 0) {
            const mappedInventory = fetchedInventory.map((i: any) => ({
              id: i.id,
              name: i.name || i.item_name,
              category: i.category,
              quantity: i.quantity,
              unit: i.unit || 'pcs',
              status: i.quantity > 50 ? 'In Stock' : (i.quantity > 0 ? 'Low Stock' : 'Out of Stock')
            }));
            setInventory(mappedInventory);
          }
          if (fetchedProducts && fetchedProducts.length > 0) {
            const mappedProducts = fetchedProducts.map((p: any) => ({
              id: p.id,
              name: p.name,
              code: p.id.substring(0, 8), // Generate a code if not present
              price: p.base_price,
              image: p.image_url || `https://picsum.photos/seed/${p.id}/400/400`,
              mainCategory: p.category,
              subCategory: p.category,
              description: p.description || 'Premium quality product.'
            }));
            setProducts(mappedProducts);
          }
          if (fetchedOrders && fetchedOrders.length > 0) {
            // Map Supabase orders to local Order type
            const mappedOrders = fetchedOrders.map((o: any) => {
              const org = fetchedClients?.find((c: any) => c.id === o.org_id);
              return {
                id: o.id,
                orgId: o.org_id,
                orgName: o.customer_name || org?.name || 'Unknown',
                items: o.order_items?.map((item: any) => ({
                  productId: item.product_id,
                  quantity: item.quantity
                })) || [],
                status: o.status === 'Draft' ? 'Received' : o.status, // Map Draft to Received for UI if needed
                category: o.status === 'Draft' ? 'Open' : (o.status === 'Closed' ? 'Closed' : 'Active'),
                paymentStatus: o.payment_status || 'Pending',
                expectedDelivery: o.expected_delivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                createdAt: o.date ? o.date.split('T')[0] : new Date().toISOString().split('T')[0],
                totalAmount: o.total_amount
              };
            });
            setOrders(mappedOrders);

            // Map active orders for supervisor/admin
            const mappedActiveOrders = fetchedOrders
              .filter((o: any) => o.status !== 'Draft' && o.status !== 'Closed')
              .map((o: any) => {
                const org = fetchedClients?.find((c: any) => c.id === o.org_id);
                const totalUnits = o.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                return {
                  orderId: o.id,
                  customer: o.customer_name || org?.name || 'Unknown',
                  totalUnits: totalUnits,
                  completedUnits: 0, // Would need actual logic to calculate
                  tracking_mode: o.tracking_mode || 'Order Level',
                  overallStage: o.status,
                  value: o.total_amount || 0,
                  expectedDelivery: o.expected_delivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  items: o.order_items || []
                };
              });
            setActiveOrders(mappedActiveOrders);
          }
          if (fetchedTransactions && fetchedTransactions.length > 0) {
            setTransactions(fetchedTransactions);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [appView, profile, isLoading]);

  useEffect(() => {
    let path = '/';
    if (appView === 'dashboard' && selectedDashboard) {
      path = `/${selectedDashboard}`;
      if (selectedDashboard === 'admin') path += `/${adminTab.toLowerCase().replace(' ', '-')}`;
      if (selectedDashboard === 'sales') path += `/${activeTab.toLowerCase().replace(' ', '-')}`;
      if (selectedDashboard === 'supervisor') path += `/${supervisorTab.toLowerCase().replace(' ', '-')}`;
      if (selectedDashboard === 'accountant') path += `/${accountantTab.toLowerCase().replace(' ', '-')}`;
    } else if (appView === 'login') {
      path = '/login';
    }
    
    // Update URL without reloading the page
    window.history.replaceState(null, '', path);
  }, [appView, selectedDashboard, adminTab, activeTab, supervisorTab, accountantTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipText(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const today = '2026-03-06';
  const endOfNextWeek = '2026-03-15'; // Sunday of next week


  const renderSelection = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center space-y-8"
      >
        <div className="space-y-2">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-100 mb-6">
            <Monitor className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Developer Mode</h1>
          <p className="text-slate-500">Bypass auth and select a dashboard directly</p>
        </div>

        <div className="grid gap-4">
          {appConfig.dashboards.sales.enabled && (
            <button 
              onClick={() => { 
                setSelectedDashboard('sales'); 
                setAppView('dashboard'); 
              }}
              className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Sales Dashboard</h3>
                <p className="text-xs text-slate-500">Manage leads, catalog, and orders</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
            </button>
          )}

          {appConfig.dashboards.supervisor.enabled && (
            <button 
              onClick={() => { 
                setSelectedDashboard('supervisor'); 
                setAppView('dashboard'); 
              }}
              className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Supervisor Dashboard</h3>
                <p className="text-xs text-slate-500">Monitor production and team performance</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
            </button>
          )}

          {appConfig.dashboards.admin.enabled && (
            <button 
              onClick={() => { 
                setSelectedDashboard('admin'); 
                setAppView('dashboard'); 
              }}
              className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Admin Dashboard</h3>
              <p className="text-xs text-slate-500">System settings and user management</p>
            </div>
            <ChevronRight className="ml-auto text-slate-300 group-hover:text-rose-500 transition-colors" size={20} />
          </button>
          )}

          {appConfig.dashboards.accountant.enabled && (
            <button 
              onClick={() => { 
                setSelectedDashboard('accountant'); 
                setAppView('dashboard'); 
              }}
              className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Accountant Dashboard</h3>
                <p className="text-xs text-slate-500">Financial reports and transactions</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-amber-500 transition-colors" size={20} />
            </button>
          )}

          {appConfig.dashboards.delivery.enabled && (
            <button 
              onClick={() => { 
                setSelectedDashboard('delivery'); 
                setAppView('dashboard'); 
              }}
              className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left flex items-center gap-4 overflow-hidden"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Delivery Dashboard</h3>
                <p className="text-xs text-slate-500">Order handover and client delivery</p>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-orange-500 transition-colors" size={20} />
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Enterprise Resource Planning v2.4</p>
      </motion.div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-white flex flex-col p-8">
      {appConfig.devMode && loginStep === 1 && (
        <button 
          onClick={() => setAppView('selection')}
          className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-12 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      
      {loginStep === 2 && (
        <button 
          onClick={() => {
            setLoginStep(1);
            setLoginPassword('');
            setLoginError('');
            setSelectedDashboard(null);
          }}
          className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-12 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {(!appConfig.devMode || loginStep === 2) && loginStep !== 2 && <div className="mb-12"></div>}

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 max-w-md mx-auto w-full flex flex-col"
      >
        <div className="mb-12 text-center">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-xl ${
            loginStep === 1 ? 'bg-slate-800 shadow-slate-200' :
            selectedDashboard === 'sales' ? 'bg-emerald-600 shadow-emerald-100' : 
            selectedDashboard === 'supervisor' ? 'bg-indigo-600 shadow-indigo-100' :
            selectedDashboard === 'admin' ? 'bg-rose-600 shadow-rose-100' :
            selectedDashboard === 'delivery' ? 'bg-orange-500 shadow-orange-100' :
            'bg-amber-600 shadow-amber-100'
          }`}>
            {loginStep === 1 && <Activity className="text-white" size={36} />}
            {loginStep === 2 && selectedDashboard === 'sales' && <TrendingUp className="text-white" size={36} />}
            {loginStep === 2 && selectedDashboard === 'supervisor' && <ShieldCheck className="text-white" size={36} />}
            {loginStep === 2 && selectedDashboard === 'admin' && <Shield className="text-white" size={36} />}
            {loginStep === 2 && selectedDashboard === 'accountant' && <Wallet className="text-white" size={36} />}
            {loginStep === 2 && selectedDashboard === 'delivery' && <Truck className="text-white" size={36} />}
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {loginStep === 1 ? 'Welcome' : 'Welcome back'}
          </h1>
          <p className="text-slate-500">
            {loginStep === 1 
              ? 'Enter your email address to continue' 
              : `Login to your ${loginRole} account`}
          </p>
        </div>

        <div className="space-y-6 flex-1">
          {loginError && (
            <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium border border-rose-100 flex items-center gap-2">
              <AlertCircle size={16} />
              {loginError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="agent@company.com"
                disabled={loginStep === 2 || isLoggingIn}
                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  loginStep === 1 ? 'focus:ring-slate-500/20 focus:border-slate-500' :
                  selectedDashboard === 'sales' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' :
                  selectedDashboard === 'supervisor' ? 'focus:ring-indigo-500/20 focus:border-indigo-500' :
                  selectedDashboard === 'admin' ? 'focus:ring-rose-500/20 focus:border-rose-500' :
                  selectedDashboard === 'delivery' ? 'focus:ring-orange-500/20 focus:border-orange-500' :
                  'focus:ring-amber-500/20 focus:border-amber-500'
                }`}
              />
            </div>
          </div>

          {loginStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 overflow-hidden"
            >
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                  className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 transition-all ${
                    selectedDashboard === 'sales' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' :
                    selectedDashboard === 'supervisor' ? 'focus:ring-indigo-500/20 focus:border-indigo-500' :
                    selectedDashboard === 'admin' ? 'focus:ring-rose-500/20 focus:border-rose-500' :
                    selectedDashboard === 'delivery' ? 'focus:ring-orange-500/20 focus:border-orange-500' :
                    'focus:ring-amber-500/20 focus:border-amber-500'
                  }`}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="flex justify-end pt-2">
                <button className={`text-xs font-bold hover:underline ${
                  selectedDashboard === 'sales' ? 'text-emerald-600' :
                  selectedDashboard === 'supervisor' ? 'text-indigo-600' :
                  selectedDashboard === 'admin' ? 'text-rose-600' :
                  selectedDashboard === 'delivery' ? 'text-orange-600' :
                  'text-amber-600'
                }`}>
                  Forgot Password?
                </button>
              </div>
            </motion.div>
          )}

          <div className="pt-6">
            <button 
              onClick={loginStep === 1 ? handleEmailCheck : handlePasswordLogin}
              disabled={isLoggingIn || !loginEmail}
              className={`w-full text-white rounded-2xl py-4 font-bold text-sm transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 ${
                loginStep === 1 ? 'bg-slate-800 shadow-slate-200 hover:bg-slate-900' :
                selectedDashboard === 'sales' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' :
                selectedDashboard === 'supervisor' ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' :
                selectedDashboard === 'admin' ? 'bg-rose-600 shadow-rose-100 hover:bg-rose-700' :
                selectedDashboard === 'delivery' ? 'bg-orange-500 shadow-orange-100 hover:bg-orange-600' :
                'bg-amber-600 shadow-amber-100 hover:bg-amber-700'
              }`}
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : loginStep === 1 ? (
                'Next'
              ) : (
                <>
                  <LogIn size={18} />
                  Login to Dashboard
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center mt-12">Enterprise Resource Planning v2.4</p>
      </motion.div>
    </div>
  );





  const appState = { appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, deliveryAgents, setDeliveryAgents, accountants, setAccountants, flipText, setFlipText, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData, renderSortIcon, addToCart, updateCartQuantity, cartCount, cartTotal, today, endOfNextWeek };
  return (
    <AppStateProvider state={appState}>
    <AnimatePresence mode="wait">
      {appView === 'selection' && <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderSelection()}</motion.div>}
      {appView === 'login' && <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderLogin()}</motion.div>}
      {appView === 'dashboard' && (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {selectedDashboard === 'sales' && <SalesDashboard />}
          {selectedDashboard === 'supervisor' && <SupervisorDashboard />}
          {selectedDashboard === 'admin' && <AdminDashboard />}
          {selectedDashboard === 'accountant' && <AccountantDashboard />}
          {selectedDashboard === 'delivery' && <DeliveryDashboard onBack={handleSignOut} />}
        </motion.div>
      )}
    </AnimatePresence>
  
    </AppStateProvider>
  );
}
