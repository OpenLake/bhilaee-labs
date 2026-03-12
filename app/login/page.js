'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setError(error.message);
        else router.push('/');
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: email.split('@')[0], // Default name
                }
            }
        });

        if (error) setError(error.message);
        else setMessage('Account created successfully! You can now log in.');
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <Link href="/" className={styles.backLink}>← Back to Home</Link>
                    <h1>Authentication</h1>
                    <p>Login or create an account to sync your lab data.</p>
                </div>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="you@email.com"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}
                    {message && <div className={styles.success}>{message}</div>}

                    <div className={styles.actions}>
                        <button 
                            type="submit" 
                            onClick={handleLogin} 
                            disabled={loading}
                            className={styles.loginBtn}
                        >
                            {loading ? 'Processing...' : 'Log In'}
                        </button>
                        
                        <div className={styles.orDivider}>
                            <span>OR</span>
                        </div>

                        <button 
                            type="button" 
                            onClick={handleGoogleLogin} 
                            disabled={loading}
                            className={styles.googleBtn}
                        >
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                <path fill="none" d="M0 0h48v48H0z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <button 
                            type="button" 
                            onClick={handleSignUp} 
                            disabled={loading}
                            className={styles.signupBtn}
                        >
                            Create Free Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
