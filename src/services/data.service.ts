import { supabase } from '../lib/supabase';

export const dataService = {
  async getClients(agentId?: string) {
    let query = supabase.from('clients').select('*, client_contacts(*)');
    if (agentId) {
      query = query.eq('sales_agent_id', agentId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createClient(clientData: any) {
    const { data, error } = await supabase.from('clients').insert([clientData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateClient(clientId: string, updates: any) {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', clientId).select().single();
    if (error) throw error;
    return data;
  },

  async deleteClient(clientId: string) {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) throw error;
  },

  async getOrders() {
    const { data, error } = await supabase.from('orders').select('*, order_items(*)');
    if (error) throw error;
    return data;
  },

  async getTransactions() {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) throw error;
    return data;
  },

  async createTransaction(txnData: any) {
    const { data, error } = await supabase.from('transactions').insert([txnData]).select().single();
    if (error) throw error;
    return data;
  },

  async createOrder(orderData: any, orderItems: any[]) {
    // Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw orderError;

    if (newOrder) {
      // Insert order items
      const itemsToInsert = orderItems.map(item => ({
        ...item,
        order_id: newOrder.id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
    }

    return newOrder;
  },

  async updateOrder(orderId: string, updates: any) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getClientContacts(clientId: string) {
    const { data, error } = await supabase.from('client_contacts').select('*').eq('client_id', clientId);
    if (error) throw error;
    return data;
  },

  async getInventory() {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) throw error;
    return data;
  },

  async createClientContact(contactData: any) {
    const { data, error } = await supabase.from('client_contacts').insert([contactData]).select().single();
    if (error) throw error;
    return data;
  },

  async getProductionLines() {
    const { data, error } = await supabase.from('production_lines').select('*');
    if (error) throw error;
    return data;
  },

  async getProductionLog() {
    const { data, error } = await supabase.from('production_log').select('*');
    if (error) throw error;
    return data;
  },

  async getDeliveryTasks() {
    const { data, error } = await supabase.from('delivery_tasks').select('*');
    if (error) throw error;
    return data;
  },

  async updateDeliveryTask(taskId: string, updates: any) {
    const { data, error } = await supabase
      .from('delivery_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getSalesAgents() {
    const { data, error } = await supabase.from('user_profiles').select('*, sales_agent_metrics(*)').eq('role', 'SALES');
    if (error) throw error;
    return data;
  },

  async getDeliveryAgents() {
    const { data, error } = await supabase.from('user_profiles').select('*').eq('role', 'DELIVERY');
    if (error) throw error;
    return data;
  },

  async getAccountants() {
    const { data, error } = await supabase.from('user_profiles').select('*, accountant_metrics(*)').eq('role', 'ACCOUNTS');
    if (error) throw error;
    return data;
  },

  async getProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  },

  async createProduct(productData: any) {
    const { data, error } = await supabase.from('products').insert([productData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateProduct(productId: string, updates: any) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', productId).select().single();
    if (error) throw error;
    return data;
  },

  async deleteProduct(productId: string) {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
  },

  /**
   * Fetch records older than X days from a specific table
   */
  async getOldRecords(tableName: string, daysOld: number) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysOld);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .lt('created_at', dateThreshold.toISOString());

    if (error) throw error;
    return data;
  },

  /**
   * Delete records by IDs
   */
  async deleteRecords(tableName: string, ids: string[]) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .in('id', ids);

    if (error) throw error;
  },

  /**
   * Bulk insert records
   */
  async insertRecords(tableName: string, records: any[]) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(records)
      .select();

    if (error) throw error;
    return data;
  }
};
