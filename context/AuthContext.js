'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    // 1. Get initial session
    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);
        
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id, initialSession.user);
        }
      } catch (error) {
        console.error('AuthContext: Session init error', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      try {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id, currentSession.user);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('AuthContext: Auth change error', error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId, user) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // maybeSingle() avoids the single() error when 0 rows

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!data) {
        console.info('Profile missing, creating on-demand for:', userId);
        // Profile was likely deleted manually but Auth user remains. 
        // Let's recreate it to heal the state.
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: userId, full_name: user?.email?.split('@')[0] || 'User' }])
          .select()
          .maybeSingle();
        
        if (createError) {
          console.error('Failed to auto-create profile:', createError);
        } else {
          setProfile(newProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error('Unexpected profile fetch error:', e);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
