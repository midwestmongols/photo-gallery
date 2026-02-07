import React, { createContext, useState, useContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
        setAccessToken(null);
        setUser(null);
    };

    if (!CLIENT_ID) {
        return (
            <AuthContext.Provider value={{
                user: { loggedIn: true, isDemo: true, name: 'Demo User' },
                accessToken: 'DEMO_TOKEN',
                login: () => { },
                logout: () => setUser(null)
            }}>
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <AuthContext.Provider value={{ user, accessToken, login, logout }}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};
