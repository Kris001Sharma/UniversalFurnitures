import React, { useState, useEffect } from 'react';
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
  Bell
} from 'lucide-react';
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

// --- Types ---

type InteractionType = 'Visit' | 'Call' | 'Meeting';
type Sentiment = 'High' | 'Medium' | 'Low';
type ClientStatus = 'Priority' | 'New' | 'Active';
type OrderStatus = 'Received' | 'Metal Forging' | 'Wood Cutting' | 'Assembly' | 'Painting' | 'Finishing' | 'Delivery';
type OrderCategory = 'Open' | 'Active' | 'Closed';
type PaymentStatus = 'Pending' | 'Partial' | 'Paid';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  sentiment: Sentiment;
  notes: string;
  location?: string;
  photoUrl?: string;
}

interface Organization {
  id: string;
  name: string;
  address: string;
  status: ClientStatus;
  contacts: Contact[];
  interactions: Interaction[];
  nextFollowUp?: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  mainCategory: string;
  subcategory: string;
  itemCategory: string;
  image: string;
  description: string;
  price?: number;
}

interface Order {
  id: string;
  orgId: string;
  orgName: string;
  items: { productId: string; quantity: number }[];
  status: OrderStatus;
  category: OrderCategory;
  paymentStatus: PaymentStatus;
  expectedDelivery: string;
  createdAt: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

// --- Shared Components ---

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

// --- Mock Data ---

const MOCK_ORGS: Organization[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Medical Way, Downtown',
    status: 'Priority',
    contacts: [
      { id: 'c1', name: 'Dr. Sarah Smith', role: 'Procurement Head', phone: '+1 234 567 890', email: 'sarah@cityhosp.com' },
      { id: 'c2', name: 'James Wilson', role: 'Facility Manager', phone: '+1 234 567 891', email: 'james@cityhosp.com' }
    ],
    interactions: [
      { id: 'i1', date: '2024-03-01', type: 'Visit', sentiment: 'High', notes: 'Interested in ergonomic chairs for the waiting area.', location: '40.7128° N, 74.0060° W' }
    ],
    nextFollowUp: '2026-03-06'
  },
  {
    id: '2',
    name: 'Oakwood Academy',
    address: '45 Education Blvd',
    status: 'Active',
    contacts: [
      { id: 'c3', name: 'Robert Brown', role: 'Principal', phone: '+1 234 567 892', email: 'principal@oakwood.edu' }
    ],
    interactions: [
      { id: 'i2', date: '2024-02-15', type: 'Meeting', sentiment: 'High', notes: 'Order placed for 50 student desks.' }
    ]
  },
  {
    id: '3',
    name: 'Tech Park Canteen',
    address: '88 Innovation Way',
    status: 'New',
    contacts: [
      { id: 'c4', name: 'Alice Chen', role: 'Operations Manager', phone: '+1 234 567 893', email: 'alice@techpark.com' }
    ],
    interactions: [],
    nextFollowUp: '2026-03-06'
  },
  {
    id: '4',
    name: 'Green Valley Resort',
    address: '77 Nature Lane',
    status: 'New',
    contacts: [
      { id: 'c5', name: 'Mark Evans', role: 'Owner', phone: '+1 234 567 894', email: 'mark@greenvalley.com' }
    ],
    interactions: [],
    nextFollowUp: '2026-03-12'
  },
  {
    id: '5',
    name: 'Modern Office Hub',
    address: '10 Corporate Plaza',
    status: 'Priority',
    contacts: [
      { id: 'c6', name: 'Elena Vance', role: 'HR Director', phone: '+1 234 567 895', email: 'elena@modernoffice.com' }
    ],
    interactions: [],
    nextFollowUp: '2026-03-15'
  }
];

const MOCK_PRODUCTS: Product[] = [
  // Chairs
  { id: 'p1', code: 'CH-01', name: 'Armchair', mainCategory: 'Chairs', subcategory: 'Lounge', itemCategory: 'Chairs', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400&h=400', description: 'A minimalist lounge chair with soft cushioning and wooden legs, perfect for modern living rooms.', price: 57.50 },
  { id: 'p2', code: 'CH-02', name: 'Barrel Chair', mainCategory: 'Chairs', subcategory: 'Lounge', itemCategory: 'Chairs', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400&h=400', description: 'The inspiration for the design of this chair comes from the industrial style of the first half of the last century, which is complemented by the most modern features.', price: 64.00 },
  { id: 'p3', code: 'CH-03', name: 'Dining Chair', mainCategory: 'Chairs', subcategory: 'Dining', itemCategory: 'Chairs', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=400&h=400', description: 'Classic dining chair with a grey fabric finish and sturdy black legs.', price: 61.00 },
  { id: 'p4', code: 'CH-04', name: 'Modern Chair', mainCategory: 'Chairs', subcategory: 'Lounge', itemCategory: 'Chairs', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=400&h=400', description: 'Vibrant yellow armchair that adds a pop of color to any interior space.', price: 47.50 },
  { id: 'p5', code: 'CH-05', name: 'Swivel Chair', mainCategory: 'Chairs', subcategory: 'Office', itemCategory: 'Chairs', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400&h=400', description: 'Elegant swivel chair for your home office.', price: 120.00 },
  { id: 'p6', code: 'CH-06', name: 'Ottoman Chair', mainCategory: 'Chairs', subcategory: 'Lounge', itemCategory: 'Chairs', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=400&h=400', description: 'Comfortable ottoman chair for relaxation.', price: 85.00 },
  
  // Sofas
  { id: 'p7', code: 'SF-01', name: 'Modern Sofa', mainCategory: 'Sofas', subcategory: 'Living Room', itemCategory: 'Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=400', description: 'Sleek and comfortable modern sofa with premium upholstery.', price: 270.00 },
  { id: 'p8', code: 'SF-02', name: 'Boogly Sofa', mainCategory: 'Sofas', subcategory: 'Living Room', itemCategory: 'Sofas', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=400&h=400', description: 'A cozy and stylish sofa for the ultimate relaxation experience.', price: 170.00 },

  // Tables
  { id: 'p9', code: 'TB-01', name: 'Marble Nexus', mainCategory: 'Tables', subcategory: 'Living Room', itemCategory: 'Tables', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400&h=400', description: 'Elegant marble coffee table with a minimalist steel frame.', price: 450.00 },
  { id: 'p10', code: 'TB-02', name: 'Zenith Desk', mainCategory: 'Tables', subcategory: 'Office', itemCategory: 'Tables', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400&h=400', description: 'Functional office desk with a clean and modern design.', price: 850.00 },

  // Kitchen
  { id: 'p11', code: 'KT-01', name: 'Island Stool', mainCategory: 'Kitchen', subcategory: 'Dining', itemCategory: 'Stools', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=400&h=400', description: 'High-quality kitchen island stool with a comfortable seat.', price: 85.00 },
];

const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-8821', 
    orgId: '2', 
    orgName: 'Oakwood Academy', 
    items: [{ productId: 'p2', quantity: 50 }], 
    status: 'Assembly', 
    category: 'Active',
    paymentStatus: 'Partial',
    expectedDelivery: '2024-03-25',
    createdAt: '2024-02-20'
  },
  { 
    id: 'DFT-1022', 
    orgId: '3', 
    orgName: 'Tech Park Canteen', 
    items: [{ productId: 'p1', quantity: 12 }], 
    status: 'Received', 
    category: 'Open',
    paymentStatus: 'Pending',
    expectedDelivery: '2024-04-10',
    createdAt: '2024-03-05'
  },
  { 
    id: 'ORD-7712', 
    orgId: '1', 
    orgName: 'City General Hospital', 
    items: [{ productId: 'p3', quantity: 5 }], 
    status: 'Delivery', 
    category: 'Closed',
    paymentStatus: 'Paid',
    expectedDelivery: '2024-02-15',
    createdAt: '2024-01-10'
  },
  { 
    id: 'ORD-9934', 
    orgId: '5', 
    orgName: 'Skyline Apartments', 
    items: [{ productId: 'p1', quantity: 100 }], 
    status: 'Metal Forging', 
    category: 'Active',
    paymentStatus: 'Pending',
    expectedDelivery: '2024-05-01',
    createdAt: '2024-03-01'
  },
  { 
    id: 'DFT-2044', 
    orgId: '6', 
    orgName: 'Riverside Cafe', 
    items: [{ productId: 'p2', quantity: 8 }], 
    status: 'Received', 
    category: 'Open',
    paymentStatus: 'Pending',
    expectedDelivery: '2024-04-20',
    createdAt: '2024-03-06'
  },
  { 
    id: 'ORD-1122', 
    orgId: '7', 
    orgName: 'Global Logistics Hub', 
    items: [{ productId: 'p3', quantity: 20 }], 
    status: 'Painting', 
    category: 'Active',
    paymentStatus: 'Paid',
    expectedDelivery: '2024-03-15',
    createdAt: '2024-02-10'
  }
];

// --- Supervisor Mock Data ---
interface ProductionLine {
  id: string;
  name: string;
  status: 'Running' | 'Idle' | 'Maintenance';
  efficiency: number;
  output: number;
  target: number;
  operator: string;
}

const MOCK_PRODUCTION_LINES: ProductionLine[] = [
  { id: 'L1', name: 'Metal Forging A', status: 'Running', efficiency: 94, output: 142, target: 150, operator: 'John Doe' },
  { id: 'L2', name: 'Wood Cutting B', status: 'Running', efficiency: 88, output: 98, target: 110, operator: 'Jane Smith' },
  { id: 'L3', name: 'Assembly Line 1', status: 'Maintenance', efficiency: 0, output: 0, target: 200, operator: 'Mike Ross' },
  { id: 'L4', name: 'Painting Station', status: 'Idle', efficiency: 0, output: 45, target: 80, operator: 'Sarah Connor' },
];

// --- Admin Mock Data ---
interface SystemUser {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 'U1', name: 'Sarah Miller', role: 'Supervisor', status: 'Active', lastLogin: '2 mins ago' },
  { id: 'U2', name: 'John Sales', role: 'Sales Agent', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'U3', name: 'Admin User', role: 'Administrator', status: 'Active', lastLogin: 'Now' },
  { id: 'U4', name: 'Accountant A', role: 'Accountant', status: 'Inactive', lastLogin: '2 days ago' },
];

// --- Accountant Mock Data ---
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  status: 'Completed' | 'Pending';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', date: 'Mar 07, 2026', description: 'Order #ORD-8829 Payment', amount: 1240.00, type: 'Income', status: 'Completed' },
  { id: 'T2', date: 'Mar 06, 2026', description: 'Raw Material Purchase', amount: 450.00, type: 'Expense', status: 'Completed' },
  { id: 'T3', date: 'Mar 05, 2026', description: 'Electricity Bill', amount: 120.00, type: 'Expense', status: 'Pending' },
  { id: 'T4', date: 'Mar 04, 2026', description: 'Bulk Order #ORD-8825', amount: 3200.00, type: 'Income', status: 'Completed' },
];

// --- Analytics Mock Data ---
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
  const stages: OrderStatus[] = ['Received', 'Metal Forging', 'Wood Cutting', 'Assembly', 'Painting', 'Finishing', 'Delivery'];
  const currentIndex = stages.indexOf(status);

  const getIcon = (stage: OrderStatus) => {
    switch (stage) {
      case 'Received': return <Box size={14} />;
      case 'Metal Forging': return <Factory size={14} />;
      case 'Wood Cutting': return <Hammer size={14} />;
      case 'Assembly': return <LayoutGrid size={14} />;
      case 'Painting': return <Paintbrush size={14} />;
      case 'Finishing': return <CheckCircle size={14} />;
      case 'Delivery': return <Truck size={14} />;
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
  const [appView, setAppView] = useState<'selection' | 'login' | 'dashboard'>('selection');
  const [selectedDashboard, setSelectedDashboard] = useState<'sales' | 'supervisor' | 'admin' | 'accountant' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [supervisorTab, setSupervisorTab] = useState<'Overview' | 'Production' | 'Team' | 'Alerts'>('Overview');
  const [adminTab, setAdminTab] = useState<'Overview' | 'Users' | 'System' | 'Logs'>('Overview');
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
  const [flipText, setFlipText] = useState(false);

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
    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const today = '2026-03-06';
  const endOfNextWeek = '2026-03-15'; // Sunday of next week

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
          <p className="text-sm text-slate-500">Welcome back, Agent 4029</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
          <img src="https://picsum.photos/seed/agent/100/100" alt="Profile" referrerPolicy="no-referrer" />
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
            {MOCK_ORGS.filter(o => o.nextFollowUp && o.nextFollowUp >= today).length}
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
            {MOCK_ORGS.filter(o => o.status === 'New').length}
          </div>
        </motion.div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-700 shadow-sm">
          <div className="text-[10px] opacity-80 uppercase font-bold mb-1">Orders</div>
          <div className="text-2xl font-mono font-bold">{MOCK_ORDERS.length}</div>
        </div>
      </div>

      {/* Today's Priorities */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Priorities</h2>
        <div className="space-y-3">
          {MOCK_ORGS.filter(o => o.nextFollowUp === today).map(org => (
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
          {MOCK_ORGS.filter(o => o.nextFollowUp === today).length === 0 && (
            <p className="text-xs text-slate-400 italic px-2">No priorities for today.</p>
          )}
        </div>
      </section>

      {/* Follow-ups */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Follow-ups (Next Week)</h2>
        <div className="space-y-3">
          {MOCK_ORGS.filter(o => o.nextFollowUp && o.nextFollowUp > today && o.nextFollowUp <= endOfNextWeek).map(org => (
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
          {MOCK_ORGS.filter(o => o.nextFollowUp && o.nextFollowUp > today && o.nextFollowUp <= endOfNextWeek).length === 0 && (
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

  const renderLeads = () => (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Active Leads</h1>
        <button 
          onClick={() => setView('AddLead')}
          className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Priority', 'New', 'Active'].map((filter) => (
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
        {MOCK_ORGS
          .filter(org => {
            const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = leadFilter === 'All' || org.status === leadFilter;
            return matchesSearch && matchesFilter;
          })
          .map(org => (
          <motion.div 
            key={org.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => goToDetail(org)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-900">{org.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${org.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {org.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <MapPin size={12} />
              <span>{org.address}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <div className="flex -space-x-2">
                {org.contacts.map((c, i) => (
                  <div key={c.id} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                    {c.name.charAt(0)}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400">{org.interactions.length} Interactions</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCatalog = () => {
    const categories = ['Sofas', 'Chairs', 'Tables', 'Kitchen'];
    const filteredProducts = selectedMainCategory 
      ? MOCK_PRODUCTS.filter(p => p.mainCategory === selectedMainCategory)
      : MOCK_PRODUCTS;
    const popularProducts = MOCK_PRODUCTS.slice(1, 7);

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
              <p className="text-sm font-bold text-[#912b21]">${product.price?.toFixed(2)}</p>
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
              <div className="text-2xl font-bold text-slate-900">${selectedProduct.price.toFixed(2)}</div>
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

    const renderCart = () => (
      <div className="space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setCatalogLevel('category')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center mr-10">Checkout</h1>
        </header>

        <div className="space-y-4">
          {cart.map(item => {
            const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{product.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">${product.price.toFixed(2)}</p>
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
              <span className="text-slate-900">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
              <span>Delivery charge</span>
              <span className="text-slate-900">$70.00</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-slate-400 font-bold text-sm">Total</span>
              <span className="text-2xl font-bold text-slate-900">${(cartTotal + 70).toFixed(2)}</span>
            </div>
            <button 
              onClick={() => alert('Processing payment...')}
              className="w-full py-4 bg-emerald-700 text-white rounded-2xl font-bold text-sm mt-4"
            >
              Pay Now
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
    const filteredOrders = MOCK_ORDERS.filter(order => 
      order.orgName.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
                      const org = MOCK_ORGS.find(o => o.id === order.orgId);
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

    const sortedPriorities = MOCK_ORGS
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
            {selectedOrg.contacts.map(contact => (
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
              {selectedOrg.interactions.map(interaction => (
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
                  const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
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
                  onClick={() => alert(`Order ${selectedOrder.id} Placed Successfully!`)}
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
                const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
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

          <OrderTracker status={selectedOrder.status} />

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

  const renderAddLead = () => (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => setView('List')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">New Organization</h1>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Organization Name</label>
          <input type="text" placeholder="e.g. St. Jude School" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Address</label>
          <textarea placeholder="Full physical address" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none h-20" />
        </div>
        
        <div className="pt-4 border-t border-slate-50">
          <h3 className="text-xs font-bold text-slate-900 mb-3">Primary Contact</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Contact Name" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
            <input type="text" placeholder="Role / Designation" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="tel" placeholder="Phone" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
              <input type="email" placeholder="Email" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none" />
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 mt-6">
          CREATE LEAD
        </button>
      </div>
    </div>
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
          <h1 className="text-3xl font-bold text-slate-900">Select Dashboard</h1>
          <p className="text-slate-500">Choose the workspace you want to access</p>
        </div>

        <div className="grid gap-4">
          <button 
            onClick={() => { setSelectedDashboard('sales'); setAppView('login'); }}
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

          <button 
            onClick={() => { setSelectedDashboard('supervisor'); setAppView('login'); }}
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

          <button 
            onClick={() => { setSelectedDashboard('admin'); setAppView('login'); }}
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

          <button 
            onClick={() => { setSelectedDashboard('accountant'); setAppView('login'); }}
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
        </div>

        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Enterprise Resource Planning v2.4</p>
      </motion.div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-white flex flex-col p-8">
      <button 
        onClick={() => setAppView('selection')}
        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-12"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 max-w-md mx-auto w-full flex flex-col"
      >
        <div className="mb-12">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
            selectedDashboard === 'sales' ? 'bg-emerald-600 shadow-emerald-100' : 
            selectedDashboard === 'supervisor' ? 'bg-indigo-600 shadow-indigo-100' :
            selectedDashboard === 'admin' ? 'bg-rose-600 shadow-rose-100' :
            'bg-amber-600 shadow-amber-100'
          }`}>
            {selectedDashboard === 'sales' && <TrendingUp className="text-white" size={32} />}
            {selectedDashboard === 'supervisor' && <ShieldCheck className="text-white" size={32} />}
            {selectedDashboard === 'admin' && <Shield className="text-white" size={32} />}
            {selectedDashboard === 'accountant' && <Wallet className="text-white" size={32} />}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Login to your {
            selectedDashboard === 'sales' ? 'Sales' : 
            selectedDashboard === 'supervisor' ? 'Supervisor' :
            selectedDashboard === 'admin' ? 'Admin' :
            'Accountant'
          } account</p>
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="agent@company.com"
                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                  selectedDashboard === 'sales' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' :
                  selectedDashboard === 'supervisor' ? 'focus:ring-indigo-500/20 focus:border-indigo-500' :
                  selectedDashboard === 'admin' ? 'focus:ring-rose-500/20 focus:border-rose-500' :
                  'focus:ring-amber-500/20 focus:border-amber-500'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 transition-all ${
                  selectedDashboard === 'sales' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' :
                  selectedDashboard === 'supervisor' ? 'focus:ring-indigo-500/20 focus:border-indigo-500' :
                  selectedDashboard === 'admin' ? 'focus:ring-rose-500/20 focus:border-rose-500' :
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
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 border-2 border-slate-200 rounded-md flex items-center justify-center transition-colors ${
                selectedDashboard === 'sales' ? 'group-hover:border-emerald-500' :
                selectedDashboard === 'supervisor' ? 'group-hover:border-indigo-500' :
                selectedDashboard === 'admin' ? 'group-hover:border-rose-500' :
                'group-hover:border-amber-500'
              }`}>
                <div className={`w-2 h-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                  selectedDashboard === 'sales' ? 'bg-emerald-500' :
                  selectedDashboard === 'supervisor' ? 'bg-indigo-500' :
                  selectedDashboard === 'admin' ? 'bg-rose-500' :
                  'bg-amber-500'
                }`} />
              </div>
              <span className="text-xs text-slate-500">Remember me</span>
            </label>
            <button className={`text-xs font-bold ${
              selectedDashboard === 'sales' ? 'text-emerald-600' :
              selectedDashboard === 'supervisor' ? 'text-indigo-600' :
              selectedDashboard === 'admin' ? 'text-rose-600' :
              'text-amber-600'
            }`}>Forgot Password?</button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button 
            onClick={() => setAppView('dashboard')}
            className={`w-full py-4 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              selectedDashboard === 'sales' ? 'bg-emerald-600 shadow-emerald-100' : 
              selectedDashboard === 'supervisor' ? 'bg-indigo-600 shadow-indigo-100' :
              selectedDashboard === 'admin' ? 'bg-rose-600 shadow-rose-100' :
              'bg-amber-600 shadow-amber-100'
            }`}
          >
            <LogIn size={18} />
            LOGIN TO DASHBOARD
          </button>
          <p className="text-center text-xs text-slate-400">
            Don't have an account? <button className={`${
              selectedDashboard === 'sales' ? 'text-emerald-600' :
              selectedDashboard === 'supervisor' ? 'text-indigo-600' :
              selectedDashboard === 'admin' ? 'text-rose-600' :
              'text-amber-600'
            } font-bold`}>Contact Admin</button>
          </p>
        </div>
      </motion.div>
    </div>
  );

  const renderSupervisorDashboard = () => {
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
            {MOCK_PRODUCTION_LINES.map(line => (
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
              { id: 'Production', icon: Factory, label: 'Production Lines' },
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
              onClick={() => setAppView('selection')}
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
                <p className="text-xs text-slate-500">Welcome back, Sarah Miller</p>
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
                    <div className="text-xs font-bold text-slate-900">Sarah Miller</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Line Supervisor</div>
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
                {supervisorTab !== 'Overview' && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                      {supervisorTab === 'Production' && <Factory size={48} />}
                      {supervisorTab === 'Team' && <Users2 size={48} />}
                      {supervisorTab === 'Alerts' && <ShieldAlert size={48} />}
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {[
            { id: 'Overview', icon: LayoutGrid, label: 'Home' },
            { id: 'Production', icon: Factory, label: 'Production' },
            { id: 'Team', icon: Users2, label: 'Team' },
            { id: 'Alerts', icon: ShieldAlert, label: 'Alerts' },
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

  const renderAdminDashboard = () => {
    const renderOverview = () => (
      <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">$124,500</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Revenue</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <ShoppingBasket size={24} />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">1,240</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Orders</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Users size={24} />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">24 Active</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">45</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Sales Agents</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                <ShieldAlert size={24} />
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">3 Critical</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">8</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Pending Alerts</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
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
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
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
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
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
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-600 font-medium">{agent.leads}</td>
                      <td className="py-4 text-sm text-slate-600 font-medium">{agent.conversions}</td>
                      <td className="py-4 text-sm font-bold text-slate-900">${agent.revenue.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">On Track</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
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
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                  <PieChart size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Conversion Rate</div>
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
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-8 fixed h-full z-50">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-100">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Admin</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise v2.4</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'Overview', icon: LayoutGrid, label: 'Dashboard' },
              { id: 'Users', icon: Users, label: 'User Management' },
              { id: 'System', icon: Server, label: 'System Health' },
              { id: 'Logs', icon: History, label: 'Activity Logs' },
              { id: 'Settings', icon: Settings, label: 'Settings' },
            ].map((item) => {
              const isActive = adminTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => setAdminTab(item.id as any)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'text-slate-500 hover:bg-slate-50'
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
              onClick={() => setAppView('selection')}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
            >
              <LogIn size={20} className="text-slate-400 group-hover:text-rose-600 rotate-180" />
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
                <h2 className="text-xl font-bold text-slate-900">{adminTab}</h2>
                <p className="text-xs text-slate-500">Real-time system insights</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search analytics..." 
                  className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="relative w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <AlertCircle size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900">Admin User</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</div>
                  </div>
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-rose-100">
                    AD
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={adminTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {adminTab === 'Overview' && renderOverview()}
                {adminTab !== 'Overview' && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600">
                      {adminTab === 'Users' && <Users size={48} />}
                      {adminTab === 'System' && <Server size={48} />}
                      {adminTab === 'Logs' && <History size={48} />}
                      {adminTab === 'Settings' && <Settings size={48} />}
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

        {/* Mobile Navigation (Only visible on small screens) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {[
            { id: 'Overview', icon: LayoutGrid, label: 'Home' },
            { id: 'Users', icon: Users, label: 'Users' },
            { id: 'System', icon: Server, label: 'System' },
            { id: 'Logs', icon: History, label: 'Logs' },
          ].map((tab) => {
            const isActive = adminTab === tab.id;
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setAdminTab(tab.id as any)} className="relative flex flex-col items-center justify-center py-1 px-4 transition-all duration-300 outline-none group">
                {isActive && <motion.div layoutId="activeAdminTabMobile" className="absolute inset-0 bg-rose-50 rounded-2xl -z-10" />}
                <Icon size={isActive ? 22 : 20} className={`transition-all duration-300 ${isActive ? 'text-rose-600 scale-110' : 'text-slate-400'}`} />
                <span className={`text-[9px] font-bold uppercase mt-1 tracking-wider ${isActive ? 'text-rose-700' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  const renderAccountantDashboard = () => {
    const renderOverview = () => (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 opacity-30" />
            <div className="relative z-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Balance</div>
              <div className="text-5xl font-bold text-slate-900 mb-8">$42,850.00</div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <TrendingUp size={16} />
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Monthly Income</div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">+$12,400.00</div>
                  <div className="text-[10px] text-emerald-600/70 mt-1">+15% from last month</div>
                </div>
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                      <TrendingUp size={16} className="rotate-180" />
                    </div>
                    <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Monthly Expenses</div>
                  </div>
                  <div className="text-2xl font-bold text-rose-700">-$4,200.00</div>
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
              <div className="text-sm opacity-80">Balance: $12,450.00</div>
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
                {MOCK_TRANSACTIONS.map(tx => (
                  <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold text-slate-900">{tx.id}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{tx.date}</td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-700">{tx.description}</td>
                    <td className={`px-8 py-4 text-sm font-bold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
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
              onClick={() => setAppView('selection')}
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
                    <div className="text-xs font-bold text-slate-900">Finance Team</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Senior Accountant</div>
                  </div>
                  <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-amber-100">
                    FT
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8 max-w-7xl mx-auto">
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

  const renderSalesDashboard = () => (
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
      
      {/* Logout Button (Floating) */}
      <button 
        onClick={() => setAppView('selection')}
        className="fixed top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-50"
      >
        <X size={20} />
      </button>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {appView === 'selection' && <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderSelection()}</motion.div>}
      {appView === 'login' && <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderLogin()}</motion.div>}
      {appView === 'dashboard' && (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {selectedDashboard === 'sales' && renderSalesDashboard()}
          {selectedDashboard === 'supervisor' && renderSupervisorDashboard()}
          {selectedDashboard === 'admin' && renderAdminDashboard()}
          {selectedDashboard === 'accountant' && renderAccountantDashboard()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
