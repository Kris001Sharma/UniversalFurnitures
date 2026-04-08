import { 
  Organization, 
  Product, 
  Order, 
  ProductionLine, 
  SystemUser, 
  InventoryItem, 
  ProductionRecord, 
  OrderProgress, 
  Transaction,
  DeliveryTask
} from '../types';

export const MOCK_DELIVERY_TASKS: DeliveryTask[] = [
  {
    id: 'DT-101',
    orderId: 'ORD-8821',
    orgId: '2',
    orgName: 'Oakwood Academy',
    address: '45 Education Blvd, City Center',
    status: 'In Progress',
    priority: 'High',
    itemsExpected: 50,
    itemsReceived: 50,
    contactName: 'Robert Brown',
    contactPhone: '+1 234 567 892',
    dueDate: '2026-04-07',
    locationTagged: false,
  },
  {
    id: 'DT-102',
    orderId: 'ORD-7712',
    orgId: '1',
    orgName: 'City General Hospital',
    address: '123 Medical Way, Downtown',
    status: 'Open',
    priority: 'Normal',
    itemsExpected: 5,
    contactName: 'Dr. Sarah Smith',
    contactPhone: '+1 234 567 890',
    dueDate: '2026-04-08',
  }
];

export const MOCK_ORGS: Organization[] = [
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

export const MOCK_PRODUCTS: Product[] = [
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

export const MOCK_ORDERS: Order[] = [
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

export const MOCK_PRODUCTION_LINES: ProductionLine[] = [
  { id: 'L1', name: 'Metal Forging A', status: 'Running', efficiency: 94, output: 142, target: 150, operator: 'John Doe' },
  { id: 'L2', name: 'Wood Cutting B', status: 'Running', efficiency: 88, output: 98, target: 110, operator: 'Jane Smith' },
  { id: 'L3', name: 'Assembly Line 1', status: 'Maintenance', efficiency: 0, output: 0, target: 200, operator: 'Mike Ross' },
  { id: 'L4', name: 'Painting Station', status: 'Offline', efficiency: 0, output: 45, target: 80, operator: 'Sarah Connor' },
];

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 'U1', name: 'Sarah Miller', role: 'Supervisor', status: 'Active', lastLogin: '2 mins ago' },
  { id: 'U2', name: 'John Sales', role: 'Sales Agent', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'U3', name: 'Admin User', role: 'Administrator', status: 'Active', lastLogin: 'Now' },
  { id: 'U4', name: 'Accountant A', role: 'Accountant', status: 'Inactive', lastLogin: '2 days ago' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'INV001', name: 'Oak Wood Planks', category: 'Raw Material', stock: 450, minStock: 100, unit: 'sq ft', status: 'In Stock' },
  { id: 'INV002', name: 'Steel Rods (12mm)', category: 'Raw Material', stock: 85, minStock: 150, unit: 'units', status: 'Low Stock' },
  { id: 'INV003', name: 'Industrial Glue', category: 'Raw Material', stock: 12, minStock: 10, unit: 'liters', status: 'In Stock' },
  { id: 'INV004', name: 'Modern Dining Chair', category: 'Finished Good', stock: 24, minStock: 20, unit: 'units', status: 'In Stock' },
  { id: 'INV005', name: 'Minimalist Desk', category: 'Finished Good', stock: 0, minStock: 5, unit: 'units', status: 'To Be Manufactured' },
];

export const MOCK_PRODUCTION_LOG: ProductionRecord[] = [
  { id: 'PRD001', itemName: 'Modern Dining Chair', producedDate: '2026-03-05', deliveredTo: 'Central Warehouse', status: 'Delivered' },
  { id: 'PRD002', itemName: 'Minimalist Desk', producedDate: '2026-03-06', deliveredTo: 'Showroom A', status: 'In Transit' },
  { id: 'PRD003', itemName: 'Oak Coffee Table', producedDate: '2026-03-07', deliveredTo: 'Customer: Alice Smith', status: 'In Transit' },
  { id: 'PRD004', itemName: 'Steel Frame Bed', producedDate: '2026-03-07', deliveredTo: 'Logistics Hub', status: 'Produced' },
];

export const MOCK_ACTIVE_ORDERS: OrderProgress[] = [
  {
    orderId: 'ORD-8829',
    customer: 'Furniture World',
    totalUnits: 10,
    completedUnits: 6,
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
    items: [
      { unitId: 'U1', status: 'Completed', stage: 'Finishing' },
      { unitId: 'U2', status: 'In Progress', stage: 'Painting' },
      { unitId: 'U3', status: 'Pending', stage: 'Assembly' },
      { unitId: 'U4', status: 'Pending', stage: 'Wood Cutting' },
      { unitId: 'U5', status: 'Pending', stage: 'Metal Forging' },
    ]
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', date: 'Mar 07, 2026', description: 'Order #ORD-8829 Payment', amount: 1240.00, type: 'Income', status: 'Completed' },
  { id: 'T2', date: 'Mar 06, 2026', description: 'Raw Material Purchase', amount: 450.00, type: 'Expense', status: 'Completed' },
  { id: 'T3', date: 'Mar 05, 2026', description: 'Electricity Bill', amount: 120.00, type: 'Expense', status: 'Pending' },
  { id: 'T4', date: 'Mar 04, 2026', description: 'Bulk Order #ORD-8825', amount: 3200.00, type: 'Income', status: 'Completed' },
];

export const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 2000, orders: 12 },
  { name: 'Thu', revenue: 2780, orders: 20 },
  { name: 'Fri', revenue: 1890, orders: 15 },
  { name: 'Sat', revenue: 2390, orders: 17 },
  { name: 'Sun', revenue: 3490, orders: 22 },
];

export const PRODUCTION_DATA = [
  { name: 'Forging', completed: 45, pending: 12 },
  { name: 'Cutting', completed: 38, pending: 8 },
  { name: 'Assembly', completed: 52, pending: 15 },
  { name: 'Painting', completed: 30, pending: 5 },
  { name: 'Finishing', completed: 25, pending: 10 },
];

export const AGENT_PERFORMANCE = [
  { name: 'John Sales', leads: 45, conversions: 12, revenue: 12500 },
  { name: 'Sarah Miller', leads: 38, conversions: 15, revenue: 18200 },
  { name: 'Mike Ross', leads: 52, conversions: 10, revenue: 9800 },
  { name: 'Jane Smith', leads: 30, conversions: 8, revenue: 7500 },
];

export const CASH_FLOW_DATA = [
  { month: 'Jan', income: 45000, expenses: 32000 },
  { month: 'Feb', income: 52000, expenses: 34000 },
  { month: 'Mar', income: 48000, expenses: 31000 },
  { month: 'Apr', income: 61000, expenses: 38000 },
  { month: 'May', income: 55000, expenses: 35000 },
  { month: 'Jun', income: 67000, expenses: 42000 },
];
