import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        // Hardcoded credentials for testing
        if (email === 'nhientran@gmail.com' && password === '1111') {
            const userData: User = {
                email: email,
                name: 'Nhiên',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

