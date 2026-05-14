import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/data.service';
import { useAuth } from './AuthContext';
import { Product, InventoryItem, ProductionLine, ProductionRecord, Transaction } from '../types';

export const InventoryContext = createContext<any>(null);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [productionLog, setProductionLog] = useState<ProductionRecord[]>([]);
  const [deliveryAgents, setDeliveryAgents] = useState<any[]>([]);
  const [accountants, setAccountants] = useState<any[]>([]);

  const [supervisorTab, setSupervisorTab] = useState<'Overview' | 'Inventory' | 'Production Log' | 'Active Manufacturing' | 'Team' | 'Alerts' | 'Settings'>('Overview');
  const [deliveryViewMode, setDeliveryViewMode] = useState<'list' | 'hierarchy'>('hierarchy');
  const [selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent] = useState<string | null>(null);
  const [selectedDeliveryAgentTile, setSelectedDeliveryAgentTile] = useState<'tasks' | 'schedule' | null>(null);
  const [deliveryAgentDetailTab, setDeliveryAgentDetailTab] = useState<string>('active');
  const [deliveryChatContext, setDeliveryChatContext] = useState<string>('');

  const [selectedAdminOrderDetails, setSelectedAdminOrderDetails] = useState<string | null>(null);
  const [activeOrdersStatusFilter, setActiveOrdersStatusFilter] = useState<string>('All');
  
  const [selectedAdminAccountant, setSelectedAdminAccountant] = useState<string | null>(null);
  const [accountantTab, setAccountantTab] = useState<'Overview' | 'Transactions' | 'Invoices' | 'Reports'>('Overview');
  const [activeOrders, setActiveOrders] = useState<any[]>([]); // Sourced from Sales Orders dynamically!
  
  // Notice: We leave data fetching for products/inventory here. 
  // Wait, if activeOrders relies on orders, we can fetch orders here if needed, or pass it via props?
  // We'll keep the fetch for inventory related stuff here.
  useEffect(() => {
    const fetchInvData = async () => {
      try {
        let [fetchedProducts, fetchedInventory, fetchedProductionLines, fetchedProductionLog, fetchedDeliveryAgents, fetchedAccountants, fetchedTransactions, fetchedOrders, fetchedClients] = await Promise.all([
          dataService.getProducts(),
          dataService.getInventory(),
          dataService.getProductionLines(),
          dataService.getProductionLog(),
          dataService.getDeliveryAgents(),
          dataService.getAccountants(),
          dataService.getTransactions(),
          dataService.getOrders(),
          dataService.getClients()
        ]);
        
        if (fetchedProducts) {
          const mappedProducts = fetchedProducts.map((p: any) => ({
            id: p.id, name: p.name, code: p.id.substring(0, 8), price: p.base_price,
            image: p.image_url || `https://picsum.photos/seed/${p.id}/400/400`,
            mainCategory: p.category, subCategory: p.category, description: p.description || 'Premium quality product.'
          }));
          setProducts(mappedProducts);
        }
        
        if (fetchedInventory) {
          const mappedInventory = fetchedInventory.map((i: any) => ({
            id: i.id, name: i.name || i.item_name, category: i.category, quantity: i.quantity, unit: i.unit || 'pcs',
            status: i.quantity > 50 ? 'In Stock' : (i.quantity > 0 ? 'Low Stock' : 'Out of Stock')
          }));
          setInventory(mappedInventory);
        }

        if (fetchedProductionLines) setProductionLines(fetchedProductionLines.map((l: any) => ({ ...l, efficiency: l.efficiency || 85, output: l.output || 0, target: l.target || 100, operator: l.operator || 'Unassigned' })));
        if (fetchedProductionLog) setProductionLog(fetchedProductionLog.map((l: any) => ({
          id: l.id, itemName: l.product_name || 'Unknown', producedDate: l.date || new Date().toISOString().split('T')[0], deliveredTo: l.delivered_to || 'Warehouse', status: l.status || 'Produced'
        })));
        if (fetchedTransactions) setTransactions(fetchedTransactions);
        
        if (fetchedDeliveryAgents) setDeliveryAgents(fetchedDeliveryAgents.map((a: any) => ({
           id: a.id, name: a.name, role: a.role, activeToday: Math.floor(Math.random() * 5), doneToday: Math.floor(Math.random() * 10), currentClient: 'None', efficiency: a.accuracy || '98%', status: a.status || 'Available', reportsTo: a.reports_to || null
        })));

        if (fetchedAccountants) setAccountants(fetchedAccountants.map((a: any) => {
           const metrics = a.accountant_metrics?.[0] || {};
           return {
               id: a.id, name: a.name, role: a.role, processedInvoices: metrics.processed_invoices || 0, pendingApprovals: metrics.pending_approvals || 0, accuracy: metrics.accuracy || '100%', status: a.status || 'Online', reportsTo: a.reports_to || null
           };
        }));

        if (fetchedOrders) {
           const active = fetchedOrders.filter((o: any) => o.status !== 'Draft' && o.status !== 'Closed').map((o: any) => {
               const org = fetchedClients?.find((c: any) => c.id === o.org_id);
               const totalUnits = o.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
               return {
                 orderId: o.id, customer: o.customer_name || org?.name || 'Unknown', totalUnits, completedUnits: 0, tracking_mode: o.tracking_mode || 'Order Level', overallStage: o.status, value: o.total_amount || 0, expectedDelivery: o.expected_delivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], items: o.order_items || []
               };
           });
           setActiveOrders(active);
        }

      } catch (e) {
        console.error("Error fetching inventory data:", e);
      }
    };
    if (profile) fetchInvData();
  }, [profile]);

  return (
    <InventoryContext.Provider value={{
      inventory, setInventory, products, setProducts, transactions, setTransactions,
      productionLines, setProductionLines, productionLog, setProductionLog, deliveryAgents, setDeliveryAgents,
      accountants, setAccountants, supervisorTab, setSupervisorTab, deliveryViewMode, setDeliveryViewMode,
      selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile,
      deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext,
      selectedAdminOrderDetails, setSelectedAdminOrderDetails, activeOrdersStatusFilter, setActiveOrdersStatusFilter,
      selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeOrders, setActiveOrders
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
