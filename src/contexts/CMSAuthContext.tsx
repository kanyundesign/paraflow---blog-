import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface CMSUser {
  id: string;
  email: string;
  name: string;
  role?: 'admin' | 'editor' | null;
}

interface CMSAuthContextType {
  user: CMSUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const CMSAuthContext = createContext<CMSAuthContextType | undefined>(undefined);

export function CMSAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CMSUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async (userId: string): Promise<'admin' | 'editor' | null> => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    return data?.role ?? null;
  };

  const buildCMSUser = async (supabaseUser: User): Promise<CMSUser> => {
    const role = await fetchUserRole(supabaseUser.id);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: supabaseUser.user_metadata?.display_name ?? supabaseUser.email?.split('@')[0] ?? 'User',
      role,
    };
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to avoid deadlock
          setTimeout(async () => {
            const cmsUser = await buildCMSUser(session.user);
            setUser(cmsUser);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const cmsUser = await buildCMSUser(session.user);
        setUser(cmsUser);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signup = async (email: string, password: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
    const redirectUrl = `${window.location.origin}/admin`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <CMSAuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
      {children}
    </CMSAuthContext.Provider>
  );
}

export function useCMSAuth() {
  const context = useContext(CMSAuthContext);
  if (context === undefined) {
    throw new Error('useCMSAuth must be used within a CMSAuthProvider');
  }
  return context;
}
