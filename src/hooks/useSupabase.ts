import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Generic hook to fetch data from a table
export function useTableData(tableName: string) {
  return useQuery({
    queryKey: [tableName],
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      return data;
    },
  });
}

// Specific hooks for our schema
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          organization:organizations(name, is_client),
          created_by_user:user_profiles!orders_created_by_fkey(full_name),
          supervisor:user_profiles!orders_assigned_supervisor_id_fkey(full_name)
        `);
      if (error) throw error;
      return data;
    },
  });
}

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*');
      if (error) throw error;
      return data;
    },
  });
}

export function useOrderItems(orderId: string | null) {
  return useQuery({
    queryKey: ['order_items', orderId],
    queryFn: async () => {
      if (!orderId) return [];
      const { data, error } = await supabase
        .from('order_items')
        .select('*, product:products(name, category, unit)')
        .eq('order_id', orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}
