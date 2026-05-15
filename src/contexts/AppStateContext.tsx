import React, { useMemo } from 'react';
import { useSystem } from './SystemContext';
import { useSales } from './SalesContext';
import { useInventory } from './InventoryContext';
import { useOrders } from './OrderContext';

export const useAppState = () => {
  const system = useSystem() || {};
  const inventory = useInventory() || {};
  const { orders = [], updateOrderStatus, loading: ordersLoading } = useOrders() || {};
  
  // To avoid circular dependency or overriding issues between OrderContext and SalesContext
  const sales = useSales() || {};

  // Dynamically derive activeOrders from the real-time orders
  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'Draft' && o.status !== 'Closed').map(o => ({
      orderId: o.id,
      customer: o.orgName,
      totalUnits: o.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
      completedUnits: 0,
      tracking_mode: 'Order Level',
      overallStage: o.status,
      value: o.totalAmount || 0,
      expectedDelivery: o.expectedDelivery,
      items: o.items || []
    }));
  }, [orders]);

  return {
    ...system,
    ...sales, 
    ...inventory,
    orders,
    updateOrderStatus,
    ordersLoading,
    activeOrders, // Override any stale activeOrders from inventory
  };
};

// We don't need AppStateProvider anymore because we wrapped things in the specific providers in App.tsx
// But if someone imports it, we can return a dummy Fragment.
export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
