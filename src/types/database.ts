export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'SALES' | 'ACCOUNTS' | 'DELIVERY';

export interface UserProfile {
  id: string; // Matches auth.users.id
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  status: 'Priority' | 'New' | 'Active';
  is_client: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  org_id: string;
  status: 'Draft' | 'Active' | 'In Production' | 'Ready for Delivery' | 'Delivered' | 'Closed';
  category: 'Open' | 'Active' | 'Closed';
  payment_status: 'Pending' | 'Partial' | 'Paid';
  tracking_mode: 'Order Level' | 'Item Level' | null;
  expected_delivery: string;
  created_at: string;
}

export interface Task {
  id: string;
  order_id: string;
  assigned_to: string; // User ID
  status: 'Open' | 'In Progress' | 'Delivered';
  priority: 'Normal' | 'High';
  due_date: string;
  created_at: string;
}

// Additional types can be added here as needed
