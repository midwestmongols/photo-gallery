import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

import logo from '../assets/logo.svg';

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
        flow: 'implicit'
    });

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}
            >
                <img src={logo} alt="MMH Logo" style={{
                    width: '120px',
                    height: '120px',
                    marginBottom: '1.5rem',
                    filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))'
                }} />
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


            </motion.div>
        </div>
    );
};

export default Login;
