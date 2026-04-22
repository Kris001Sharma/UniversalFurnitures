import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/database';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Logout current user
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Check if email exists and return its role
   */
  async checkEmailRole(email: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('user_profiles') // Notice we query 'user_profiles' table directly
      .select('role')
      .eq('email', email)
      .limit(1);
    
    if (error) {
      console.error('Error checking email role:', error);
      return null;
    }
    return data && data.length > 0 ? data[0].role : null;
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as UserProfile;
  },

  /**
   * Admin only: Create a new user (Signup is disabled for public)
   */
  async adminCreateUser(email: string, password: string, fullName: string, role: UserRole) {
    // Note: In a real production app, creating users securely often requires 
    // a Supabase Edge Function using the service_role key to bypass RLS,
    // or using the admin API. For this frontend abstraction, we assume 
    // the current user has admin privileges and RLS allows this, or we call an Edge Function.
    
    // For demonstration, we'll use a standard signUp which might be restricted by Supabase settings.
    // If "Enable signup" is false in Supabase, this will fail unless called via service_role.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });
    
    if (error) throw error;
    return data;
  }
};
