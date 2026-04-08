export type UserRole = "ADMIN" | "SUPERVISOR" | "ACCOUNTS" | "SALES" | "DELIVERY";

export type InteractionType = 'Visit' | 'Call' | 'Meeting';
export type Sentiment = 'High' | 'Medium' | 'Low';
export type ClientStatus = 'Priority' | 'New' | 'Active';
export type OrderStatus = 'Received' | 'Metal Forging' | 'Wood Cutting' | 'Assembly' | 'Painting' | 'Finishing' | 'Delivery';
export type OrderCategory = 'Open' | 'Active' | 'Closed';
export type PaymentStatus = 'Pending' | 'Partial' | 'Paid';

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  sentiment: Sentiment;
  notes: string;
  location?: string;
  photoUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  status: ClientStatus;
  contacts: Contact[];
  interactions: Interaction[];
  nextFollowUp?: string;
}

export interface Product {
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

export interface Order {
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

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ProductionLine {
  id: string;
  name: string;
  status: 'Running' | 'Maintenance' | 'Offline';
  efficiency: number;
  operator: string;
  output: number;
  target: number;
}

export interface SystemUser {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Raw Material' | 'Finished Good';
  stock: number;
  minStock: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'To Be Manufactured';
}

export interface ProductionRecord {
  id: string;
  itemName: string;
  producedDate: string;
  deliveredTo: string;
  status: 'Produced' | 'In Transit' | 'Delivered';
}

export interface OrderUnitProgress {
  unitId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  stage: string;
}

export interface OrderProgress {
  orderId: string;
  customer: string;
  totalUnits: number;
  completedUnits: number;
  items: OrderUnitProgress[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  status: 'Completed' | 'Pending';
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  orgId: string;
  orgName: string;
  address: string;
  status: 'Open' | 'In Progress' | 'Delivered';
  priority: 'High' | 'Normal';
  itemsExpected: number;
  itemsReceived?: number;
  contactName?: string;
  contactPhone?: string;
  dueDate: string;
  locationTagged?: boolean;
  proofImageUrl?: string;
}
