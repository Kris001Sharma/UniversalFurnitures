import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import { UserProfile } from '../types/database';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// Create the context to hold our authentication state globally
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * This component wraps the application and provides the current authentication state
 * (session, user, and custom user profile) to all child components.
 * 
 * It listens to Supabase's auth state changes (login, logout, token refresh) and
 * automatically fetches the user's profile from the `user_profiles` table to determine
 * their role and permissions.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get the initial session when the app first loads
    authService.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // If a user is logged in, fetch their profile (role, name, etc.)
        fetchProfile(session.user.id);
      } else {
        // If no user, stop loading immediately
        setIsLoading(false);
      }
    }).catch(err => {
      console.error('Failed to get session:', err);
      setIsLoading(false);
    });

    // 2. Set up a listener for any future auth changes (e.g., user logs in or out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsLoading(true);
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Fetches the custom user profile from the database.
   * This is crucial because Supabase's default auth.users table doesn't store
   * our custom roles (ADMIN, SALES, etc.). We store those in `user_profiles`.
   */
  const fetchProfile = async (userId: string) => {
    try {
      const userProfile = await authService.getProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.logout();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to easily access the authentication context from any component.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
