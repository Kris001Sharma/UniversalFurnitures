import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/data.service';
import { useAuth } from './AuthContext';
import { Organization, Order, Product, CartItem } from '../types';

export const SalesContext = createContext<any>(null);

export const SalesProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesAgents, setSalesAgents] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'Home' | 'Leads' | 'Catalog' | 'Orders'>('Home');
  const [catalogLevel, setCatalogLevel] = useState<'discover' | 'category' | 'productDetail' | 'cart'>('discover');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Chairs');
  const [view, setView] = useState<'List' | 'Detail' | 'AddLead' | 'LogInteraction' | 'CreateOrder' | 'Priorities' | 'ViewOrder' | 'EditOrder' | 'TrackOrder'>('List');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [leadFilter, setLeadFilter] = useState<string>('All');
  const [orderTab, setOrderTab] = useState<'Open' | 'Active' | 'Closed'>('Active');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartClientId, setCartClientId] = useState<string>('');

  const [salesViewMode, setSalesViewMode] = useState<'list' | 'hierarchy'>('hierarchy');
  const [showSalesProfile, setShowSalesProfile] = useState(false);
  const [selectedAdminSalesAgent, setSelectedAdminSalesAgent] = useState<string | null>(null);
  const [selectedAgentTile, setSelectedAgentTile] = useState<'clients' | 'leads' | 'schedule' | null>(null);
  const [agentDetailTab, setAgentDetailTab] = useState<string>('active');
  const [chatContext, setChatContext] = useState<string>('');

  const [clientsSearchQuery, setClientsSearchQuery] = useState('');
  const [clientsOrdersMainTab, setClientsOrdersMainTab] = useState<'activeOrders' | 'draftOrders' | 'leads' | 'allClients'>('activeOrders');
  const [selectedClientDetails, setSelectedClientDetails] = useState<string | null>(null);
  const [clientDetailTab, setClientDetailTab] = useState<string>('Activity');
  const [allClientsFilter, setAllClientsFilter] = useState<'All' | 'Active Client' | 'Past Client' | 'Active Lead' | 'Inactive Lead'>('All');
  const [clientCategoryFilter, setClientCategoryFilter] = useState<string>('All');
  const [showClientsFilters, setShowClientsFilters] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        let [fetchedClients, fetchedOrders, fetchedSalesAgents] = await Promise.all([
          dataService.getClients(profile?.role === 'SALES' ? profile.id : undefined),
          dataService.getOrders(),
          dataService.getSalesAgents()
        ]);
        
        if (profile?.role === 'SALES') {
           if (fetchedOrders && fetchedClients) {
             const myClientIds = fetchedClients.map((c: any) => c.id);
             fetchedOrders = fetchedOrders.filter((o: any) => myClientIds.includes(o.org_id));
           }
        }
        
        if (fetchedClients) setClients(fetchedClients.filter((c: any) => !c.is_deleted));
        
        if (fetchedSalesAgents) {
           const mappedAgents = fetchedSalesAgents.map((a: any) => {
               const metrics = a.sales_agent_metrics?.[0] || {};
               return {
                   id: a.id, name: a.name, role: a.role,
                   leads: metrics.leads || 0,
                   activeClients: metrics.active_clients || 0,
                   pastClients: metrics.past_clients || 0,
                   revenue: metrics.revenue ? `₹${metrics.revenue.toLocaleString()}` : '₹0',
                   conversion: metrics.conversion ? `${metrics.conversion}%` : '0%',
                   status: a.status || 'Online',
                   reportsTo: a.reports_to || null
               };
           });
           setSalesAgents(mappedAgents);
        }

        if (fetchedOrders) {
          const mappedOrders = fetchedOrders.map((o: any) => {
            const org = fetchedClients?.find((c: any) => c.id === o.org_id);
            return {
              id: o.id, orgId: o.org_id,
              orgName: o.customer_name || org?.name || 'Unknown',
              items: o.order_items?.map((item: any) => ({
                productId: item.product_id, quantity: item.quantity
              })) || [],
              status: o.status === 'Draft' ? 'Received' : o.status,
              category: o.status === 'Draft' ? 'Open' : (o.status === 'Closed' ? 'Closed' : 'Active'),
              paymentStatus: o.payment_status || 'Pending',
              expectedDelivery: o.expected_delivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              createdAt: o.date ? o.date.split('T')[0] : new Date().toISOString().split('T')[0],
              totalAmount: o.total_amount
            };
          });
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    if (profile) fetchSalesData();
  }, [profile]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === productId);
      // We pass dummy product to let the components pick the real one since they load it too, or we can find from products if products is in Context.
      // But products are in Inventory Context conceptually...
      return prev; // We'll re-implement if needed, actually let's pass a function down 
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <SalesContext.Provider value={{
      clients, setClients, orders, setOrders, salesAgents, setSalesAgents,
      activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory,
      view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct,
      searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab,
      cart, setCart, cartClientId, setCartClientId, salesViewMode, setSalesViewMode,
      showSalesProfile, setShowSalesProfile, selectedAdminSalesAgent, setSelectedAdminSalesAgent,
      selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext,
      clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab,
      selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab,
      allClientsFilter, setAllClientsFilter, clientCategoryFilter, setClientCategoryFilter,
      showClientsFilters, setShowClientsFilters, addToCart, updateCartQuantity, cartCount, cartTotal
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
