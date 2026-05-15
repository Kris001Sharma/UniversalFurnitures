export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'SALES' | 'ACCOUNTS' | 'DELIVERY';

export interface UserProfile {
  id: string; // Matches auth.users.id
  email: string;
  name: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  duty_status: 'Off Duty' | 'On Duty' | 'On Break';
  last_known_latitude?: number;
  last_known_longitude?: number;
  last_active_at?: string;
  created_at: string;
}

export interface UserTracking {
  user_id: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  battery_level?: number;
  is_charging?: boolean;
  updated_at: string;
}

export interface UnifiedActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  status: 'Started' | 'Completed';
  latitude?: number;
  longitude?: number;
  metadata?: any;
  completed_at?: string;
  created_at: string;
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
  status: 'Draft' | 'Received' | 'In Production' | 'Packaging' | 'Ready for Delivery' | 'Out for Delivery' | 'Delivered' | 'Closed';
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
