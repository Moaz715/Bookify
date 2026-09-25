import { createContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../utils/api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initialLoad, setInititialLoad] = useState(true);

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const res = await api.post('/api/users/refresh');
                setAccessToken(res.data.accessToken);
                setUser(res.data);
            }
            catch (err) {
            } finally {
                setInititialLoad(false);
            }
        }
        
        initializeAuth();
    }, []); 

    if (initialLoad) {
        return <div style={{ textAlign: 'center', marginTop: '20vh' }}>Loading secure session...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;