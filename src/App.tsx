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
import { appConfig } from './config/appConfig';

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

const DeliveryMap = React.lazy(() => import('./DeliveryMap'));

const MOCK_ORGS: any[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Medical Way, Downtown',
    status: 'Priority',
    is_client: false,
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
    is_client: true,
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
    is_client: false,
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
    is_client: false,
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

const MOCK_ORDERS: any[] = [
  { 
    id: 'ORD-8821', 
    orgId: '2', 
    orgName: 'Oakwood Academy', 
    items: [{ productId: 'p2', quantity: 50 }], 
    status: 'In Production', 
    category: 'Active',
    paymentStatus: 'Partial',
    tracking_mode: 'Item Level',
    expectedDelivery: '2024-03-25',
    createdAt: '2024-02-20'
  },
  { 
    id: 'DFT-1022', 
    orgId: '3', 
    orgName: 'Tech Park Canteen', 
    items: [{ productId: 'p1', quantity: 12 }], 
    status: 'Draft', 
    category: 'Open',
    paymentStatus: 'Pending',
    tracking_mode: null,
    expectedDelivery: '2024-04-10',
    createdAt: '2024-03-05'
  },
  { 
    id: 'ORD-7712', 
    orgId: '1', 
    orgName: 'City General Hospital', 
    items: [{ productId: 'p3', quantity: 5 }], 
    status: 'Delivered', 
    category: 'Closed',
    paymentStatus: 'Paid',
    tracking_mode: 'Order Level',
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

// --- Supervisor Mock Data ---
interface InventoryItem {
  id: string;
  name: string;
  category: 'Raw Material' | 'Finished Good';
  stock: number;
  minStock: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'To Be Manufactured';
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'INV001', name: 'Oak Wood Planks', category: 'Raw Material', stock: 450, minStock: 100, unit: 'sq ft', status: 'In Stock' },
  { id: 'INV002', name: 'Steel Rods (12mm)', category: 'Raw Material', stock: 85, minStock: 150, unit: 'units', status: 'Low Stock' },
  { id: 'INV003', name: 'Industrial Glue', category: 'Raw Material', stock: 12, minStock: 10, unit: 'liters', status: 'In Stock' },
  { id: 'INV004', name: 'Modern Dining Chair', category: 'Finished Good', stock: 24, minStock: 20, unit: 'units', status: 'In Stock' },
  { id: 'INV005', name: 'Minimalist Desk', category: 'Finished Good', stock: 0, minStock: 5, unit: 'units', status: 'To Be Manufactured' },
];

interface ProductionRecord {
  id: string;
  itemName: string;
  producedDate: string;
  deliveredTo: string;
  status: 'Produced' | 'In Transit' | 'Delivered';
}

const MOCK_PRODUCTION_LOG: ProductionRecord[] = [
  { id: 'PRD001', itemName: 'Modern Dining Chair', producedDate: '2026-03-05', deliveredTo: 'Central Warehouse', status: 'Delivered' },
  { id: 'PRD002', itemName: 'Minimalist Desk', producedDate: '2026-03-06', deliveredTo: 'Showroom A', status: 'In Transit' },
  { id: 'PRD003', itemName: 'Oak Coffee Table', producedDate: '2026-03-07', deliveredTo: 'Customer: Alice Smith', status: 'In Transit' },
  { id: 'PRD004', itemName: 'Steel Frame Bed', producedDate: '2026-03-07', deliveredTo: 'Logistics Hub', status: 'Produced' },
];

interface OrderUnitProgress {
  unitId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  stage: string;
}

interface OrderProgress {
  orderId: string;
  customer: string;
  totalUnits: number;
  completedUnits: number;
  items: OrderUnitProgress[];
}

const MOCK_ACTIVE_ORDERS: any[] = [
  {
    orderId: 'ORD-8829',
    customer: 'Furniture World',
    totalUnits: 10,
    completedUnits: 6,
    tracking_mode: 'Item Level',
    items: [
      { unitId: 'U1', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U2', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U3', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U4', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U5', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U6', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U7', status: 'In Progress', stage: 'Assembly' },
      { unitId: 'U8', status: 'In Progress', stage: 'Assembly' },
      { unitId: 'U9', status: 'Pending', stage: 'Wood Cutting' },
      { unitId: 'U10', status: 'Pending', stage: 'Metal Forging' },
    ]
  },
  {
    orderId: 'ORD-8830',
    customer: 'Design Studio',
    totalUnits: 5,
    completedUnits: 1,
    tracking_mode: 'Order Level',
    overallStage: 'Painting',
    items: [
      { unitId: 'U1', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U2', status: 'In Progress', stage: 'Painting' },
      { unitId: 'U3', status: 'Pending', stage: 'Assembly' },
      { unitId: 'U4', status: 'Pending', stage: 'Wood Cutting' },
      { unitId: 'U5', status: 'Pending', stage: 'Metal Forging' },
    ]
  }
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

interface DeliveryTask {
  id: string;
  orderId: string;
  orgId: string;
  orgName: string;
  address: string;
  status: 'Open' | 'In Progress' | 'Delivered';
  priority: 'Normal' | 'High';
  itemsExpected: number;
  itemsReceived?: number;
  contactName: string;
  contactPhone: string;
  dueDate: string;
  locationTagged?: boolean;
  taggedLat?: number;
  taggedLng?: number;
  proofImage?: string;
  logs?: string;
  lat?: number;
  lng?: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', date: 'Mar 07, 2026', description: 'Order #ORD-8829 Payment', amount: 1240.00, type: 'Income', status: 'Completed' },
  { id: 'T2', date: 'Mar 06, 2026', description: 'Raw Material Purchase', amount: 450.00, type: 'Expense', status: 'Completed' },
  { id: 'T3', date: 'Mar 05, 2026', description: 'Electricity Bill', amount: 120.00, type: 'Expense', status: 'Pending' },
  { id: 'T4', date: 'Mar 04, 2026', description: 'Bulk Order #ORD-8825', amount: 3200.00, type: 'Income', status: 'Completed' },
];

const MOCK_DELIVERY_TASKS: DeliveryTask[] = [
  {
    id: 'DT-101',
    orderId: 'ORD-8821',
    orgId: '2',
    orgName: 'Oakwood Academy',
    address: 'Thamel, Kathmandu',
    status: 'In Progress',
    priority: 'High',
    itemsExpected: 50,
    itemsReceived: 50,
    contactName: 'Robert Brown',
    contactPhone: '+977 9841234567',
    dueDate: '2026-04-07',
    locationTagged: false,
    lat: 27.7172,
    lng: 85.3240,
  },
  {
    id: 'DT-102',
    orderId: 'ORD-7712',
    orgId: '1',
    orgName: 'City General Hospital',
    address: 'Maharajgunj, Kathmandu',
    status: 'Open',
    priority: 'Normal',
    itemsExpected: 5,
    contactName: 'Dr. Sarah Smith',
    contactPhone: '+977 9851234567',
    dueDate: '2026-04-08',
    lat: 27.7336,
    lng: 85.3303,
  },
  {
    id: 'DT-103',
    orderId: 'ORD-9934',
    orgId: '3',
    orgName: 'TechCorp HQ',
    address: 'Patan, Lalitpur',
    status: 'Open',
    priority: 'High',
    itemsExpected: 120,
    contactName: 'Jane Doe',
    contactPhone: '+977 9801234567',
    dueDate: '2026-04-07',
    lat: 27.6766,
    lng: 85.3123,
  },
  {
    id: 'DT-104',
    orderId: 'ORD-5542',
    orgId: '4',
    orgName: 'Sunrise Cafe',
    address: 'Durbar Marg, Kathmandu',
    status: 'Delivered',
    priority: 'Normal',
    itemsExpected: 15,
    itemsReceived: 15,
    contactName: 'Mike Johnson',
    contactPhone: '+977 9811234567',
    dueDate: '2026-04-06',
    locationTagged: true,
    lat: 27.7120,
    lng: 85.3129,
  },
  {
    id: 'DT-105',
    orderId: 'ORD-3321',
    orgId: '5',
    orgName: 'Central Library',
    address: 'Jamal, Kathmandu',
    status: 'Open',
    priority: 'Normal',
    itemsExpected: 30,
    contactName: 'Alice Williams',
    contactPhone: '+977 9821234567',
    dueDate: '2026-04-09',
    lat: 27.7025,
    lng: 85.3166,
  },
  {
    id: 'DT-106',
    orderId: 'ORD-2210',
    orgId: '6',
    orgName: 'Metro Transit',
    address: 'Kalanki, Kathmandu',
    status: 'Open',
    priority: 'High',
    itemsExpected: 200,
    contactName: 'Tom Davis',
    contactPhone: '+977 9861234567',
    dueDate: '2026-04-10',
    lat: 27.6936,
    lng: 85.2805,
  }
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

const DeliveryDashboard = ({ onBack, isAdminView = false }: { onBack: () => void, isAdminView?: boolean }) => {
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Active' | 'Route'>('Tasks');
  const [view, setView] = useState<'List' | 'Add' | 'Detail'>('List');
  const [tasks, setTasks] = useState<DeliveryTask[]>(MOCK_DELIVERY_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [receivedInputs, setReceivedInputs] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'All' | 'Open' | 'In Progress' | 'Delivered'>('All');
  const [sortBy, setSortBy] = useState<'Priority' | 'Date'>('Priority');
  const [expandedRouteTask, setExpandedRouteTask] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTaskId, setNavigatingTaskId] = useState<string | null>(null);
  const [mapCenterTrigger, setMapCenterTrigger] = useState(0);

  const [newTask, setNewTask] = useState<Partial<DeliveryTask>>({
    priority: 'Normal',
    status: 'Open'
  });

  const handleHandover = (taskId: string) => {
    const received = receivedInputs[taskId];
    if (received) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, itemsReceived: parseInt(received, 10) } : t));
    }
  };

  const handleTagLocation = (taskId: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          localStorage.setItem('deliveryUserLocation', JSON.stringify(loc));
          setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true, taggedLat: loc.lat, taggedLng: loc.lng } : t));
        },
        (error) => {
          console.error("Geolocation Error:", error.message);
          // Fallback to cached or IP location if GPS fails
          if (userLocation) {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true, taggedLat: userLocation.lat, taggedLng: userLocation.lng } : t));
          } else {
            handleGetLocation(); // Try to get IP location
            setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true } : t));
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, locationTagged: true } : t));
    }
  };

  const handleUploadProof = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, proofImage: imageUrl } : t));
    }
  };

  const handleMarkDelivered = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Delivered' } : t));
    // If no more active tasks, switch back to Tasks tab
    if (tasks.filter(t => t.status === 'In Progress' && t.id !== taskId).length === 0) {
      setActiveTab('Tasks');
    }
  };

  const handleStartDelivery = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'In Progress' } : t));
    setActiveTab('Active');
  };

  const handleCancelTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Open' } : t));
  };

  const fetchIpLocation = async () => {
    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await response.json();
      if (data && data.latitude && data.longitude) {
        const loc = { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) };
        setUserLocation(loc);
        localStorage.setItem('deliveryUserLocation', JSON.stringify(loc));
      } else {
        throw new Error("Invalid IP location data");
      }
    } catch (err) {
      console.error("IP Location fallback failed", err);
      // Fallback to Kathmandu
      setUserLocation({ lat: 27.7172, lng: 85.3240 });
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          localStorage.setItem('deliveryUserLocation', JSON.stringify(loc));
          setMapCenterTrigger(prev => prev + 1);
        },
        (error) => {
          console.error("Geolocation Error:", error.message, "Code:", error.code);
          // Fallback to Kathmandu if geolocation fails to keep it focused on Nepal
          const fallbackLoc = { lat: 27.7172, lng: 85.3240 };
          setUserLocation(fallbackLoc);
          setMapCenterTrigger(prev => prev + 1);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      const fallbackLoc = { lat: 27.7172, lng: 85.3240 };
      setUserLocation(fallbackLoc);
      setMapCenterTrigger(prev => prev + 1);
    }
  };

  useEffect(() => {
    const cachedLoc = localStorage.getItem('deliveryUserLocation');
    if (cachedLoc) {
      try {
        setUserLocation(JSON.parse(cachedLoc));
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
      (t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
       t.orgName.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <p className="text-sm text-slate-500">Welcome back, Agent 4029</p>
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
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStartNavigation(activeTask.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-200 transition-colors"
                      >
                        <Navigation size={14} /> Navigate
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors">
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
                        <MapPin size={14} /> {activeTask.locationTagged ? `Tagged: ${activeTask.taggedLat?.toFixed(4)}, ${activeTask.taggedLng?.toFixed(4)}` : 'Tag Geolocation'}
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
      ? [userLocation, ...targetTasks.filter(t => t.lat && t.lng).map(t => ({ lat: t.lat!, lng: t.lng! }))]
      : targetTasks.filter(t => t.lat && t.lng).map(t => ({ lat: t.lat!, lng: t.lng! }));

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

function ProfileModal({ 
  isOpen, 
  onClose, 
  onSignOut, 
  stats 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSignOut: () => void;
  stats: { label: string; value: string | number }[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="flex flex-col items-center mt-4">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src="https://picsum.photos/seed/agent/200/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-4">Agent 4029</h2>
          <p className="text-sm text-slate-500">Senior Representative</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={onSignOut}
          className="w-full py-3.5 bg-rose-50 text-rose-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
        >
          <LogIn size={18} className="rotate-180" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [appView, setAppView] = useState<'selection' | 'login' | 'dashboard'>('selection');
  const [selectedDashboard, setSelectedDashboard] = useState<'sales' | 'supervisor' | 'admin' | 'accountant' | 'delivery' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showSalesProfile, setShowSalesProfile] = useState(false);

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
  const [flipText, setFlipText] = useState(false);

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

  const renderLeads = () => {
    // Filter organizations based on leadFilter (which now includes 'Clients')
    const filteredOrgs = MOCK_ORGS.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
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
          {appConfig.dashboards.sales.enabled && (
            <button 
              onClick={() => { 
                setSelectedDashboard('sales'); 
                setAppView(appConfig.auth.enabled ? 'login' : 'dashboard'); 
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
                setAppView(appConfig.auth.enabled ? 'login' : 'dashboard'); 
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
                setAppView(appConfig.auth.enabled ? 'login' : 'dashboard'); 
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
                setAppView(appConfig.auth.enabled ? 'login' : 'dashboard'); 
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
                setAppView(appConfig.auth.enabled ? 'login' : 'dashboard'); 
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
            selectedDashboard === 'delivery' ? 'bg-orange-500 shadow-orange-100' :
            'bg-amber-600 shadow-amber-100'
          }`}>
            {selectedDashboard === 'sales' && <TrendingUp className="text-white" size={32} />}
            {selectedDashboard === 'supervisor' && <ShieldCheck className="text-white" size={32} />}
            {selectedDashboard === 'admin' && <Shield className="text-white" size={32} />}
            {selectedDashboard === 'accountant' && <Wallet className="text-white" size={32} />}
            {selectedDashboard === 'delivery' && <Truck className="text-white" size={32} />}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Login to your {
            selectedDashboard === 'sales' ? 'Sales' : 
            selectedDashboard === 'supervisor' ? 'Supervisor' :
            selectedDashboard === 'admin' ? 'Admin' :
            selectedDashboard === 'delivery' ? 'Delivery' :
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
                  selectedDashboard === 'delivery' ? 'focus:ring-orange-500/20 focus:border-orange-500' :
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
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 border-2 border-slate-200 rounded-md flex items-center justify-center transition-colors ${
                selectedDashboard === 'sales' ? 'group-hover:border-emerald-500' :
                selectedDashboard === 'supervisor' ? 'group-hover:border-indigo-500' :
                selectedDashboard === 'admin' ? 'group-hover:border-rose-500' :
                selectedDashboard === 'delivery' ? 'group-hover:border-orange-500' :
                'group-hover:border-amber-500'
              }`}>
                <div className={`w-2 h-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                  selectedDashboard === 'sales' ? 'bg-emerald-500' :
                  selectedDashboard === 'supervisor' ? 'bg-indigo-500' :
                  selectedDashboard === 'admin' ? 'bg-rose-500' :
                  selectedDashboard === 'delivery' ? 'bg-orange-500' :
                  'bg-amber-500'
                }`} />
              </div>
              <span className="text-xs text-slate-500">Remember me</span>
            </label>
            <button className={`text-xs font-bold ${
              selectedDashboard === 'sales' ? 'text-emerald-600' :
              selectedDashboard === 'supervisor' ? 'text-indigo-600' :
              selectedDashboard === 'admin' ? 'text-rose-600' :
              selectedDashboard === 'delivery' ? 'text-orange-600' :
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
              selectedDashboard === 'delivery' ? 'bg-orange-500 shadow-orange-100' :
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
              selectedDashboard === 'delivery' ? 'text-orange-600' :
              'text-amber-600'
            } font-bold`}>Contact Admin</button>
          </p>
        </div>
      </motion.div>
    </div>
  );

  const renderSupervisorDashboard = (isAdminView = false) => {
    const renderInventory = () => (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Items</div>
            <div className="text-3xl font-bold text-slate-900">{MOCK_INVENTORY.length}</div>
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
                {MOCK_INVENTORY.map((item) => (
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
                {MOCK_PRODUCTION_LOG.map((record) => (
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
        {MOCK_ACTIVE_ORDERS.map((order) => (
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

  const renderAdminDashboard = () => {
    const renderAdminSales = () => {
      const MOCK_SALES_AGENTS = [
        { id: '1', name: 'Sarah Jenkins', role: 'Senior Sales Manager', leads: 24, activeClients: 12, pastClients: 45, revenue: '₹145,000', conversion: '50%', status: 'Online', reportsTo: null },
        { id: '2', name: 'Michael Chen', role: 'Sales Executive', leads: 18, activeClients: 8, pastClients: 20, revenue: '₹28,500', conversion: '44%', status: 'In Meeting', reportsTo: '1' },
        { id: '3', name: 'David Rodriguez', role: 'Sales Executive', leads: 32, activeClients: 15, pastClients: 30, revenue: '₹62,000', conversion: '46%', status: 'Offline', reportsTo: '1' },
      ];

      if (selectedAdminSalesAgent) {
        const agent = MOCK_SALES_AGENTS.find(a => a.id === selectedAdminSalesAgent);
        
        const renderAgentDetailContent = () => {
          if (selectedAgentTile === 'clients') {
            return (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                  <button onClick={() => setAgentDetailTab('active')} className={`text-sm font-bold pb-2 border-b-2 ${agentDetailTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Active Clients</button>
                  <button onClick={() => setAgentDetailTab('past')} className={`text-sm font-bold pb-2 border-b-2 ${agentDetailTab === 'past' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Past Clients</button>
                </div>
                <div className="space-y-4">
                  {agentDetailTab === 'active' ? (
                    <div className="text-sm text-slate-600">Showing {agent?.activeClients} active clients with ongoing orders...</div>
                  ) : (
                    <div className="text-sm text-slate-600">Showing {agent?.pastClients} past clients...</div>
                  )}
                  {/* Mock List */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <div className="font-bold text-slate-900">Client Company {i}</div>
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                  <button onClick={() => setAgentDetailTab('active')} className={`text-sm font-bold pb-2 border-b-2 ${agentDetailTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Active Leads</button>
                  <button onClick={() => setAgentDetailTab('new')} className={`text-sm font-bold pb-2 border-b-2 ${agentDetailTab === 'new' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>New Leads</button>
                </div>
                <div className="space-y-4">
                  {agentDetailTab === 'active' ? (
                    <div className="text-sm text-slate-600">Showing {agent?.leads} active leads...</div>
                  ) : (
                    <div className="text-sm text-slate-600">Showing new leads assigned by admin...</div>
                  )}
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <div className="font-bold text-slate-900">Potential Lead {i}</div>
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                  <button onClick={() => setAgentDetailTab('today')} className={`text-sm font-bold pb-2 border-b-2 ${agentDetailTab === 'today' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Priorities Today</button>
                  <button onClick={() => setAgentDetailTab('week')} className={`text-sm font-bold pb-2 border-b-2 ${agentDetailTab === 'week' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Weekly Calendar</button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => { setSelectedAgentTile('clients'); setAgentDetailTab('active'); }}
                className={`bg-white p-4 rounded-2xl border ${selectedAgentTile === 'clients' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Clients</div>
                  <Users size={16} className="text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{agent?.activeClients} <span className="text-sm font-normal text-slate-500">Active</span></div>
              </div>
              <div 
                onClick={() => { setSelectedAgentTile('leads'); setAgentDetailTab('active'); }}
                className={`bg-white p-4 rounded-2xl border ${selectedAgentTile === 'leads' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Leads</div>
                  <Crosshair size={16} className="text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{agent?.leads} <span className="text-sm font-normal text-slate-500">Total</span></div>
              </div>
              <div 
                onClick={() => { setSelectedAgentTile('schedule'); setAgentDetailTab('today'); }}
                className={`bg-white p-4 rounded-2xl border ${selectedAgentTile === 'schedule' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Contextual Chat</h3>
                      <p className="text-xs text-slate-500">Chat with {agent?.name.split(' ')[0]}</p>
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
                        <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm max-w-[85%]">
                          Hi Admin, regarding {chatContext === 'client1' ? 'TechCorp' : 'Global Industries'}, they asked for a discount on bulk orders.
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 px-1">10:30 AM</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
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

      const manager = MOCK_SALES_AGENTS.find(a => !a.reportsTo);
      const reports = MOCK_SALES_AGENTS.filter(a => a.reportsTo === manager?.id);

      return (
        <div className="space-y-8">
          {/* Overview Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Sales Executed</div>
              <div className="text-2xl font-bold text-slate-900">142</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Active Execs Today</div>
              <div className="text-2xl font-bold text-slate-900">12 <span className="text-sm font-normal text-slate-400">/ 15</span></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Planned Visits Today</div>
              <div className="text-2xl font-bold text-slate-900">28</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">New Leads Ready</div>
              <div className="text-2xl font-bold text-slate-900">45</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Active Clients</div>
              <div className="text-2xl font-bold text-slate-900">89</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Sales Hierarchy</h2>
              <p className="text-slate-500 text-sm mt-1">Manage and monitor your sales team structure</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
              <Plus size={16} /> Add Agent
            </button>
          </div>

          {/* Hierarchical View */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
            <div className="min-w-[600px] flex flex-col items-center">
              {/* Manager Level */}
              {manager && (
                <div 
                  onClick={() => setSelectedAdminSalesAgent(manager.id)}
                  className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl w-64 text-center cursor-pointer hover:shadow-md transition-all relative z-10"
                >
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2 shadow-sm">
                    {manager.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-slate-900">{manager.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold mb-2">{manager.role}</p>
                  <div className="flex justify-center gap-4 text-xs text-slate-600">
                    <span>{manager.activeClients} Clients</span>
                    <span>{manager.leads} Leads</span>
                  </div>
                </div>
              )}

              {/* Connecting Lines */}
              <div className="w-px h-8 bg-slate-300"></div>
              <div className="w-[400px] h-px bg-slate-300"></div>
              <div className="flex justify-between w-[400px]">
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="w-px h-8 bg-slate-300"></div>
              </div>

              {/* Reports Level */}
              <div className="flex gap-16">
                {reports.map(agent => (
                  <div 
                    key={agent.id}
                    onClick={() => setSelectedAdminSalesAgent(agent.id)}
                    className="bg-white border border-slate-200 p-4 rounded-2xl w-64 text-center cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all relative z-10"
                  >
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                      {agent.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-slate-900">{agent.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{agent.role}</p>
                    <div className="flex justify-center gap-4 text-xs text-slate-600">
                      <span>{agent.activeClients} Clients</span>
                      <span>{agent.leads} Leads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderAdminClientsOrders = () => {
      const MOCK_ACTIVE_ORDERS = [
        { id: 'ORD-1001', client: 'TechCorp Industries', date: 'Oct 10, 2023', expectedDelivery: 'Oct 15, 2023', salesAgent: 'Sarah Jenkins', salesAgentId: '1', accountant: 'Alice Smith', accountantId: '1', supervisor: 'Mark Taylor', supervisorId: '1', status: 'In Production', value: 12500, advance: 5000, pending: 7500, discount: 500, discountReason: 'Volume discount', notes: [{ id: 1, author: 'Sarah Jenkins', text: 'Client requested expedited delivery.', time: 'Oct 11, 2023' }] },
        { id: 'ORD-1002', client: 'Apex Solutions', date: 'Oct 12, 2023', expectedDelivery: 'Oct 18, 2023', salesAgent: 'Sarah Jenkins', salesAgentId: '1', accountant: 'Bob Johnson', accountantId: '2', supervisor: 'Lisa Wong', supervisorId: '2', status: 'In Production', value: 8500, advance: 8500, pending: 0, discount: 0, discountReason: '', notes: [] },
      ];

      const MOCK_DRAFT_ORDERS = [
        { id: 'DRF-0045', client: 'Global Logistics', org: 'Global Logistics Inc.', priority: 'High', salesAgent: 'Michael Chen', value: 15000, date: 'Oct 14, 2023', status: 'Draft', advance: 0, pending: 15000, notes: [{ id: 1, author: 'Michael Chen', text: 'Initial discussion about bulk order.', time: '2 days ago' }] },
        { id: 'DRF-0046', client: 'Nexus Dynamics', org: 'Nexus Dynamics LLC', priority: 'Medium', salesAgent: 'Michael Chen', value: 5000, date: 'Oct 13, 2023', status: 'Draft', advance: 0, pending: 5000, notes: [] },
      ];

      const MOCK_LEADS = [
        { id: 'L-001', name: 'Future Tech', contactPerson: 'John Doe', interest: 'Bulk Chairs', lastContact: '2 days ago', salesAgent: 'David Rodriguez', location: 'Kathmandu, Nepal', email: 'john@futuretech.com', contact: '+977 9844444444', type: 'Active Lead', notes: [{ id: 1, author: 'David Rodriguez', text: 'Interested in 50 ergonomic chairs.', time: '2 days ago' }] },
      ];

      const MOCK_ALL_CLIENTS = [
        { id: 'C-001', name: 'TechCorp Industries', type: 'Active Client', totalOrders: 2, totalValue: 25000, lastInteraction: 'Today', location: 'Kathmandu, Nepal', contact: '+977 9800000000', email: 'contact@techcorp.com' },
        { id: 'C-002', name: 'Quantum Retail', type: 'Past Client', totalOrders: 5, totalValue: 45000, lastInteraction: 'Jan 15, 2023', location: 'Pokhara, Nepal', contact: '+977 9811111111', email: 'procurement@quantumretail.com' },
        { id: 'C-003', name: 'Global Logistics', type: 'Active Lead', totalOrders: 0, totalValue: 0, lastInteraction: 'Yesterday', location: 'Lalitpur, Nepal', contact: '+977 9822222222', email: 'info@globallogistics.com' },
        { id: 'C-004', name: 'Stark Industries', type: 'Inactive Lead', totalOrders: 0, totalValue: 0, lastInteraction: 'Mar 10, 2023', location: 'Bhaktapur, Nepal', contact: '+977 9833333333', email: 'tony@stark.com' },
      ];

      if (selectedAdminOrderDetails) {
        const order: any = MOCK_ACTIVE_ORDERS.find(o => o.id === selectedAdminOrderDetails) || MOCK_DRAFT_ORDERS.find(o => o.id === selectedAdminOrderDetails);
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
                <h2 className="text-2xl font-bold text-slate-900">Order {order?.id}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    {order?.status}
                  </span>
                  • Placed on {order?.date}
                </div>
              </div>
            </div>

            {/* Client Finances Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-lg cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => { setSelectedClientDetails(order?.client || null); setSelectedAdminOrderDetails(null); }}>
                  Client: {order?.client}
                </h3>
                <button className="text-sm font-bold text-indigo-600 hover:underline" onClick={() => { setSelectedClientDetails(order?.client || null); setSelectedAdminOrderDetails(null); }}>View Client Profile</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Order Value</div>
                  <div className="text-2xl font-bold text-slate-900">₹{order?.value.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Advance Received</div>
                  <div className="text-2xl font-bold text-emerald-700">₹{order?.advance.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl">
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Pending Dues</div>
                  <div className="text-2xl font-bold text-rose-700">₹{order?.pending.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
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
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Financial Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Draft Amount</span>
                    <span className="font-bold text-slate-900 text-sm">₹{(order ? order.value + (order.discount || 0) : 0).toLocaleString()}</span>
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
                    <span className="font-bold text-indigo-600 text-lg">₹{order?.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversations / Notes */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Conversations & Notes</h3>
              <div className="space-y-4">
                {order?.notes && order.notes.length > 0 ? (
                  order.notes.map((note: any) => (
                    <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
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
        const client = MOCK_ALL_CLIENTS.find(c => c.name === selectedClientDetails) || MOCK_LEADS.find(l => l.name === selectedClientDetails) || MOCK_ALL_CLIENTS[0];
        const isLeadOnly = client.type.includes('Lead');
        
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
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.type.includes('Client') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {client.type}
                  </span>
                  • {isLeadOnly ? 'New Lead' : 'Client Profile'}
                </div>
              </div>
            </div>

            {/* Client Info & Financials */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-1">
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
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
                  <h3 className="font-bold text-slate-900 mb-4">Financial Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Value</div>
                      <div className="text-xl font-bold text-slate-900">₹{((client as any).totalValue || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl">
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Paid</div>
                      <div className="text-xl font-bold text-emerald-700">₹{(((client as any).totalValue || 0) * 0.8).toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-2xl">
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Due Amount</div>
                      <div className="text-xl font-bold text-rose-700">₹{(((client as any).totalValue || 0) * 0.2).toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-2xl">
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Advance</div>
                      <div className="text-xl font-bold text-indigo-700">₹5,000</div>
                    </div>
                  </div>
                </div>
              )}
              
              {isLeadOnly && (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
                  <h3 className="font-bold text-slate-900 mb-4">Conversations & Notes</h3>
                  <div className="space-y-4">
                    {(client as any).notes && (client as any).notes.length > 0 ? (
                      (client as any).notes.map((note: any) => (
                        <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-6">
                  <button onClick={() => setClientDetailTab('active')} className={`text-sm font-bold pb-2 border-b-2 ${clientDetailTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Active Orders</button>
                  <button onClick={() => setClientDetailTab('draft')} className={`text-sm font-bold pb-2 border-b-2 ${clientDetailTab === 'draft' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Drafted Orders</button>
                  <button onClick={() => setClientDetailTab('past')} className={`text-sm font-bold pb-2 border-b-2 ${clientDetailTab === 'past' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>Past Orders</button>
                </div>
                <div className="space-y-4">
                  {clientDetailTab === 'active' && MOCK_ACTIVE_ORDERS.filter(o => o.client === client.name).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          <Package size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{order.id}</div>
                          <div className="text-xs text-slate-500">Status: {order.status} • Est. Delivery: {order.expectedDelivery}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹{order.value.toLocaleString()}</div>
                        <button onClick={() => setSelectedAdminOrderDetails(order.id)} className="text-indigo-600 text-xs font-bold hover:underline mt-1">View Details</button>
                      </div>
                    </div>
                  ))}
                  {clientDetailTab === 'active' && MOCK_ACTIVE_ORDERS.filter(o => o.client === client.name).length === 0 && (
                    <div className="text-center py-8 text-slate-500">No active orders found.</div>
                  )}

                  {clientDetailTab === 'draft' && MOCK_DRAFT_ORDERS.filter(o => o.client === client.name).map((draft) => (
                    <div key={draft.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{draft.id}</div>
                          <div className="text-xs text-slate-500">Priority: {draft.priority} • Agent: {draft.salesAgent}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">Est. ₹{draft.value.toLocaleString()}</div>
                        <button onClick={() => setSelectedAdminOrderDetails(draft.id)} className="text-indigo-600 text-xs font-bold hover:underline mt-1">View Details</button>
                      </div>
                    </div>
                  ))}
                  {clientDetailTab === 'draft' && MOCK_DRAFT_ORDERS.filter(o => o.client === client.name).length === 0 && (
                    <div className="text-center py-8 text-slate-500">No drafted orders found.</div>
                  )}

                  {clientDetailTab === 'past' && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:col-span-1">
                <h3 className="font-bold text-slate-900 mb-4">Interaction History</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <MessageSquare size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
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
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Clients & Orders</h2>
              <p className="text-slate-500 text-sm mt-1">Manage all clients, leads, and their respective orders</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={clientsSearchQuery}
                  onChange={(e) => setClientsSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6 border-b border-slate-200">
            <button onClick={() => setClientsOrdersMainTab('activeOrders')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${clientsOrdersMainTab === 'activeOrders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Active Orders</button>
            <button onClick={() => setClientsOrdersMainTab('draftOrders')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${clientsOrdersMainTab === 'draftOrders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Draft Orders</button>
            <button onClick={() => setClientsOrdersMainTab('leads')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${clientsOrdersMainTab === 'leads' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Active Leads</button>
            <button onClick={() => setClientsOrdersMainTab('allClients')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${clientsOrdersMainTab === 'allClients' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>All Clients</button>
          </div>

          {clientsOrdersMainTab === 'allClients' && (
            <div className="flex gap-2">
              <button onClick={() => setAllClientsFilter('All')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${allClientsFilter === 'All' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>All</button>
              <button onClick={() => setAllClientsFilter('Active Client')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${allClientsFilter === 'Active Client' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Active Clients</button>
              <button onClick={() => setAllClientsFilter('Past Client')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${allClientsFilter === 'Past Client' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Past Clients</button>
              <button onClick={() => setAllClientsFilter('Active Lead')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${allClientsFilter === 'Active Lead' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Active Leads</button>
              <button onClick={() => setAllClientsFilter('Inactive Lead')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${allClientsFilter === 'Inactive Lead' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Inactive</button>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">
                {clientsOrdersMainTab === 'activeOrders' && 'Active Orders'}
                {clientsOrdersMainTab === 'draftOrders' && 'Draft Orders'}
                {clientsOrdersMainTab === 'leads' && 'Active Leads'}
                {clientsOrdersMainTab === 'allClients' && (
                  <>
                    {allClientsFilter === 'All' && 'All Clients'}
                    {allClientsFilter === 'Active Client' && 'Active Clients'}
                    {allClientsFilter === 'Past Client' && 'Past Clients'}
                    {allClientsFilter === 'Active Lead' && 'Active Leads'}
                    {allClientsFilter === 'Inactive Lead' && 'Inactive Leads'}
                  </>
                )}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {clientsOrdersMainTab === 'activeOrders' && (
                      <>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('id')}>Order {renderSortIcon('id')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('client')}>Client {renderSortIcon('client')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('date')}>Dates {renderSortIcon('date')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('salesAgent')}>Team {renderSortIcon('salesAgent')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </>
                    )}
                    {clientsOrdersMainTab === 'draftOrders' && (
                      <>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('id')}>Draft Order {renderSortIcon('id')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('client')}>Client / Org {renderSortIcon('client')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('priority')}>Priority {renderSortIcon('priority')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('salesAgent')}>Sales Agent {renderSortIcon('salesAgent')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </>
                    )}
                    {clientsOrdersMainTab === 'leads' && (
                      <>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('name')}>Lead Name {renderSortIcon('name')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('contactPerson')}>Contact {renderSortIcon('contactPerson')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('interest')}>Interest {renderSortIcon('interest')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('salesAgent')}>Sales Agent {renderSortIcon('salesAgent')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </>
                    )}
                    {clientsOrdersMainTab === 'allClients' && (
                      <>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('name')}>Client Name {renderSortIcon('name')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('type')}>Status {renderSortIcon('type')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('totalOrders')}>Total Orders {renderSortIcon('totalOrders')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('totalValue')}>Total Value {renderSortIcon('totalValue')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-slate-700 transition-colors" onClick={() => handleSort('lastInteraction')}>Last Interaction {renderSortIcon('lastInteraction')}</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientsOrdersMainTab === 'activeOrders' && sortData(MOCK_ACTIVE_ORDERS.filter(o => o.client.toLowerCase().includes(clientsSearchQuery.toLowerCase()) || o.id.toLowerCase().includes(clientsSearchQuery.toLowerCase()))).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{order.id}</div>
                        <div className="text-xs text-indigo-600 font-bold mt-1">{order.status}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 cursor-pointer hover:text-indigo-600" onClick={() => setSelectedClientDetails(order.client)}>{order.client}</div>
                        <div className="text-xs text-slate-500 font-medium">₹{order.value.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900"><span className="text-slate-500 text-xs">Placed:</span> {order.date}</div>
                        <div className="text-sm text-slate-900 mt-1"><span className="text-slate-500 text-xs">Delivery:</span> {order.expectedDelivery}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-slate-600"><span className="font-bold text-slate-500">Sales:</span> {order.salesAgent}</div>
                        <div className="text-xs text-slate-600 my-0.5"><span className="font-bold text-slate-500">Prod:</span> {order.supervisor}</div>
                        <div className="text-xs text-slate-600"><span className="font-bold text-slate-500">Acc:</span> {order.accountant}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedAdminOrderDetails(order.id)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors">View Details</button>
                      </td>
                    </tr>
                  ))}

                  {clientsOrdersMainTab === 'draftOrders' && sortData(MOCK_DRAFT_ORDERS.filter(o => o.client.toLowerCase().includes(clientsSearchQuery.toLowerCase()) || o.id.toLowerCase().includes(clientsSearchQuery.toLowerCase()))).map((draft) => (
                    <tr key={draft.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{draft.id}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">Est. ₹{draft.value.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{draft.client}</div>
                        <div className="text-xs text-slate-500">{draft.org}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${draft.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {draft.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">{draft.salesAgent}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedAdminOrderDetails(draft.id)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors">View Details</button>
                      </td>
                    </tr>
                  ))}

                  {clientsOrdersMainTab === 'leads' && sortData(MOCK_LEADS.filter(l => l.name.toLowerCase().includes(clientsSearchQuery.toLowerCase()) || l.contactPerson.toLowerCase().includes(clientsSearchQuery.toLowerCase()))).map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500 mt-1">Last Contact: {lead.lastContact}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">{lead.contactPerson}</div>
                        <div className="text-xs text-slate-500">{lead.contact}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">{lead.interest}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">{lead.salesAgent}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedClientDetails(lead.name)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors">View Details</button>
                      </td>
                    </tr>
                  ))}

                  {clientsOrdersMainTab === 'allClients' && sortData(MOCK_ALL_CLIENTS.filter(c => allClientsFilter === 'All' || c.type === allClientsFilter).filter(c => c.name.toLowerCase().includes(clientsSearchQuery.toLowerCase()))).map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{client.name}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.type.includes('Client') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {client.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">{client.totalOrders}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900 font-bold">₹{client.totalValue.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">{client.lastInteraction}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedClientDetails(client.name)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const renderAdminDelivery = () => {
      const MOCK_DELIVERY_AGENTS = [
        { id: '1', name: 'James Wilson', role: 'Senior Driver', activeToday: 3, doneToday: 5, currentClient: 'TechCorp Industries', efficiency: '98%', status: 'On Route' },
        { id: '2', name: 'Robert Fox', role: 'Driver', activeToday: 1, doneToday: 8, currentClient: 'Global Logistics', efficiency: '95%', status: 'Available' },
        { id: '3', name: 'Emily Davis', role: 'Driver', activeToday: 4, doneToday: 2, currentClient: 'Apex Solutions', efficiency: '99%', status: 'On Route' },
        { id: '4', name: 'Michael Brown', role: 'Driver', activeToday: 0, doneToday: 0, currentClient: 'None', efficiency: '94%', status: 'Offline' },
      ];

      if (selectedAdminDeliveryAgent) {
        const agent = MOCK_DELIVERY_AGENTS.find(a => a.id === selectedAdminDeliveryAgent);

        const renderAgentDetailContent = () => {
          if (selectedDeliveryAgentTile === 'tasks') {
            return (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                  <button onClick={() => setDeliveryAgentDetailTab('active')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'active' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'}`}>Active Tasks</button>
                  <button onClick={() => setDeliveryAgentDetailTab('complete')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'complete' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'}`}>Complete Tasks</button>
                  <button onClick={() => setDeliveryAgentDetailTab('today')} className={`text-sm font-bold pb-2 border-b-2 ${deliveryAgentDetailTab === 'today' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'}`}>Completed Today</button>
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
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
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
            <div className="flex gap-4 overflow-x-auto pb-4">
              <div 
                onClick={() => { setSelectedDeliveryAgentTile('tasks'); setDeliveryAgentDetailTab('active'); }}
                className={`bg-white p-4 rounded-2xl border-2 min-w-[240px] flex-1 ${selectedDeliveryAgentTile === 'tasks' ? 'border-orange-500' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
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
                className={`bg-white p-4 rounded-2xl border-2 min-w-[240px] flex-1 ${selectedDeliveryAgentTile === 'schedule' ? 'border-orange-500' : 'border-slate-100'} shadow-sm cursor-pointer hover:shadow-md transition-all`}
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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Contextual Chat</h3>
                      <p className="text-xs text-slate-500">Chat with {agent?.name.split(' ')[0]}</p>
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
                        <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm max-w-[85%]">
                          Hi Admin, traffic is heavy on I-95, might be delayed by 10 mins for the {deliveryChatContext === 'client1' ? agent?.currentClient : 'Global Logistics'} delivery.
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 px-1">10:30 AM</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="bg-orange-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
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

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Delivery Fleet</h2>
              <p className="text-slate-500 text-sm mt-1">Monitor and manage delivery personnel</p>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-sm">
              <Plus size={16} /> Add Agent
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {MOCK_DELIVERY_AGENTS.map(agent => (
              <div 
                key={agent.id} 
                onClick={() => setSelectedAdminDeliveryAgent(agent.id)}
                className="bg-orange-50 border border-orange-100 p-6 rounded-3xl text-center cursor-pointer hover:shadow-md transition-all relative z-10"
              >
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-sm">
                  {agent.name.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{agent.name}</h3>
                <p className="text-sm text-orange-600 font-bold mb-3">{agent.role}</p>
                <div className="flex justify-center gap-4 text-sm text-slate-600 mb-4">
                  <span className="font-medium"><strong className="text-slate-900">{agent.activeToday}</strong> Active</span>
                  <span className="font-medium"><strong className="text-slate-900">{agent.doneToday}</strong> Done</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Client</div>
                <div className="font-bold text-indigo-600 truncate text-sm">{agent.currentClient}</div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderAdminFinance = () => {
      const MOCK_ACCOUNTANTS = [
        { id: '1', name: 'Alice Smith', processedInvoices: 145, pendingApprovals: 12, accuracy: '99.8%', status: 'Online' },
        { id: '2', name: 'Bob Johnson', processedInvoices: 132, pendingApprovals: 5, accuracy: '99.5%', status: 'In Meeting' },
        { id: '3', name: 'Carol Williams', processedInvoices: 156, pendingApprovals: 8, accuracy: '99.9%', status: 'Offline' },
      ];

      if (selectedAdminAccountant) {
        const agent = MOCK_ACCOUNTANTS.find(a => a.id === selectedAdminAccountant);
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Processed</div>
                    <div className="text-xl font-bold text-slate-900">{agent?.processedInvoices}</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending</div>
                    <div className="text-xl font-bold text-slate-900">{agent?.pendingApprovals}</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Accuracy</div>
                    <div className="text-xl font-bold text-slate-900">{agent?.accuracy}</div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Recent Approvals</h3>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
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

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[600px]">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Direct Message</h3>
                    <p className="text-xs text-slate-500">Chat with {agent?.name?.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm max-w-[85%]">
                      Hi Admin, I need approval for the new equipment purchase order.
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 px-1">11:15 AM</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="bg-amber-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
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
            {MOCK_ACCOUNTANTS.map(agent => (
              <div 
                key={agent.id} 
                onClick={() => setSelectedAdminAccountant(agent.id)}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-bold text-lg group-hover:scale-110 transition-transform">
                      {agent.name.charAt(0)}
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
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Processed</div>
                    <div className="font-bold text-slate-900">{agent.processedInvoices}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending</div>
                    <div className="font-bold text-slate-900">{agent.pendingApprovals}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acc.</div>
                    <div className="font-bold text-emerald-600">{agent.accuracy}</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">₹124,500</div>
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
                      <td className="py-4 text-sm font-bold text-slate-900">₹{agent.revenue.toLocaleString()}</td>
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

          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-4">Dashboards</div>
            {[
              { id: 'Overview', icon: LayoutGrid, label: 'Overview' },
              { id: 'Sales', icon: TrendingUp, label: 'Sales' },
              { id: 'Clients & Orders', icon: Briefcase, label: 'Clients & Orders' },
              { id: 'Manufacturing', icon: Factory, label: 'Manufacturing' },
              { id: 'Delivery', icon: Truck, label: 'Delivery' },
              { id: 'Finance', icon: DollarSign, label: 'Finance' },
            ].map((item) => {
              const isActive = adminTab === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => setAdminTab(item.id as any)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="text-sm font-bold">{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
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
                  onClick={() => setAdminTab(item.id as any)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
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
                {adminTab === 'Sales' && renderAdminSales()}
                {adminTab === 'Clients & Orders' && renderAdminClientsOrders()}
                {adminTab === 'Manufacturing' && renderSupervisorDashboard(true)}
                {adminTab === 'Delivery' && renderAdminDelivery()}
                {adminTab === 'Finance' && renderAdminFinance()}
                {adminTab === 'Data Sync' && <DataSync />}
                {adminTab !== 'Overview' && adminTab !== 'Sales' && adminTab !== 'Clients & Orders' && adminTab !== 'Manufacturing' && adminTab !== 'Delivery' && adminTab !== 'Finance' && adminTab !== 'Data Sync' && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600">
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
                {MOCK_TRANSACTIONS.map(tx => (
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
      
      <ProfileModal 
        isOpen={showSalesProfile} 
        onClose={() => setShowSalesProfile(false)} 
        onSignOut={() => { setAppView('selection'); setSelectedDashboard(null); }}
        stats={[
          { label: 'Orders This Month', value: 45 },
          { label: 'Total Revenue', value: '₹12.4k' }
        ]}
      />
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
          {selectedDashboard === 'delivery' && <DeliveryDashboard onBack={() => { setAppView('selection'); setSelectedDashboard(null); }} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
