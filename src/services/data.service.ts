import { supabase } from '../lib/supabase';

export const dataService = {
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
