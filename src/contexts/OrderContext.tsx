import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => Promise<void>;
  loading: boolean;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    const fetchOrders = async () => {
      try {
        const { data: clientsData } = await supabase.from('clients').select('id, sales_agent_id');
        let myClientIds: string[] = [];
        
        if (profile.role === 'SALES' && clientsData) {
           myClientIds = clientsData.filter(c => c.sales_agent_id === profile.id).map(c => c.id);
        }

        const { data, error } = await supabase.from('orders').select('*, order_items(*)');
        if (error) throw error;
        
        // Filter if sales
        let filteredData = data || [];
        if (profile.role === 'SALES') {
           filteredData = filteredData.filter(o => myClientIds.includes(o.org_id));
        }

        const mappedOrders = filteredData.map((o: any) => {
          // Normalize legacy statuses
          let status = o.status;
          if (status === 'Queued') status = 'Received';
          if (status === 'Active') status = 'Packaging';
          if (status === 'Ready for Dispatch') status = 'Ready for Delivery';
          if (status === 'Manufacturing') status = 'In Production';
          if (status === 'Packaging/QA') status = 'Packaging';

          return {
            id: o.id, 
            orgId: o.org_id,
            orgName: o.customer_name || 'Unknown',
            items: o.order_items?.map((item: any) => ({
              productId: item.product_id, quantity: item.quantity
            })) || [],
            status,
            category: status === 'Draft' ? 'Open' : (status === 'Closed' ? 'Closed' : 'Active'),
            paymentStatus: o.payment_status || 'Pending',
            expectedDelivery: o.expected_delivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: o.date ? o.date.split('T')[0] : o.created_at || new Date().toISOString().split('T')[0],
            totalAmount: o.total_amount
          };
        });

        setOrders(mappedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const normalizeStatus = (s: string) => {
          if (s === 'Queued') return 'Received';
          if (s === 'Active') return 'Packaging';
          if (s === 'Ready for Dispatch') return 'Ready for Delivery';
          if (s === 'Manufacturing') return 'In Production';
          if (s === 'Packaging/QA') return 'Packaging';
          return s as OrderStatus;
        };

        if (payload.eventType === 'INSERT') {
          const newOrder = payload.new as any;
          const status = normalizeStatus(newOrder.status);
          setOrders((prev) => [...prev, {
            id: newOrder.id,
            orgId: newOrder.org_id,
            orgName: newOrder.customer_name || 'Unknown',
            items: [], 
            status,
            category: status === 'Draft' ? 'Open' : (status === 'Closed' ? 'Closed' : 'Active'),
            paymentStatus: newOrder.payment_status || 'Pending',
            expectedDelivery: newOrder.expected_delivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: newOrder.date ? newOrder.date.split('T')[0] : newOrder.created_at || new Date().toISOString().split('T')[0],
            totalAmount: newOrder.total_amount
          }]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as any;
          const status = normalizeStatus(updated.status);
          setOrders((prev) => prev.map((o) => {
            if (o.id === updated.id) {
               return {
                 ...o,
                 status,
                 category: status === 'Draft' ? 'Open' : (status === 'Closed' ? 'Closed' : 'Active'),
               };
            }
            return o;
          }));
        } else if (payload.eventType === 'DELETE') {
          const deleted = payload.old as any;
          setOrders((prev) => prev.filter((o) => o.id !== deleted.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus, note?: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(prev => prev.map(o => o.id === orderId ? { 
        ...o, 
        status: newStatus,
        category: newStatus === 'Draft' ? 'Open' : (newStatus === 'Closed' ? 'Closed' : 'Active')
      } : o));
    } catch (err) {
      console.error('Failed to update order status:', err);
      throw err;
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus, loading }}>
        {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
