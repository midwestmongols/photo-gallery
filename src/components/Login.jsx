import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();

    const googleLogin = useGoogleLogin({
        onSuccess: login,
        onError: () => console.log('Login Failed'),
        scope: [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/spreadsheets'
        ].join(' '),
        flow: 'implicit' // or 'auth-code' if we needed server, but we are client-only so implicit gives access_token
    });

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}
            >
                <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Midwest Mongolian Hub
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Community Memories
                </p>

                <button onClick={() => googleLogin()} className="glass-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    <LogIn size={20} />
                    Sign in with Google
                </button>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>No Google Setup?</p>
                    <button
                        onClick={() => login()}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Enter Demo Mode
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
