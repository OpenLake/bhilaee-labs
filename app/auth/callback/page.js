'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * OAuth Callback Page (Client-Side)
 * 
 * Supabase's implicit OAuth flow returns tokens in the URL hash fragment (#access_token=...).
 * Hash fragments are never sent to the server, so this must be a client-side page.
 * The Supabase client library automatically detects and processes the hash fragment
 * via onAuthStateChange, then we redirect to the home page.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // The Supabase client (via AuthContext's onAuthStateChange listener)
    // automatically picks up the hash fragment tokens and establishes the session.
    // We just need to wait for it, then redirect.

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Session established, redirect to home
        router.replace('/');
      }
    });

    // Fallback: if the session is already set (race condition), redirect immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/');
      }
    });

    // Safety timeout — if nothing happens in 8 seconds, redirect to login
    const timeout = setTimeout(() => {
      router.replace('/login?error=auth_callback_failed');
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#4285F4',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ opacity: 0.7, fontSize: '14px' }}>Completing sign in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
