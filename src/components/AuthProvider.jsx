import React, { createContext, useState, useContext } from 'react';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const login = (tokenResponse) => {
        if (!tokenResponse) {
            setAccessToken('DEMO_TOKEN');
            setUser({ loggedIn: true, isDemo: true, name: 'Demo User' });
            return;
        }
        setAccessToken(tokenResponse.access_token);

        // Fetch user details
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        })
            .then(res => res.json())
            .then(data => {
                setUser({
                    loggedIn: true,
                    ...data
                });
            })
            .catch(err => {
                console.error("Failed to fetch user profile", err);
                setUser({ loggedIn: true }); // Fallback
            });
    };

    const logout = () => {
        googleLogout();
        setAccessToken(null);
        setUser(null);
    };

    const revokeAccess = () => {
        if (accessToken && accessToken !== 'DEMO_TOKEN') {
            if (window.google?.accounts?.oauth2) {
                window.google.accounts.oauth2.revoke(accessToken, () => {
                    console.log('Access token revoked');
                    logout();
                });
            } else {
                // Fallback if API not ready
                logout();
            }
        } else {
            logout();
        }
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID || 'dummy-id'}>
            <AuthContext.Provider value={{ user, accessToken, login, logout, revokeAccess }}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};
