import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedData = localStorage.getItem('profile');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setUser(parsedData.user || parsedData); 
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData.user || userData);
        localStorage.setItem('profile', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('profile');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);