import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load users from Electron storage
    useEffect(() => {
        const loadUsers = async () => {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                const loadedUsers = await ipcRenderer.invoke('get-users');
                setUsers(loadedUsers);

                // Check if there's a saved session
                const savedSession = localStorage.getItem('currentUser');
                if (savedSession) {
                    const user = JSON.parse(savedSession);
                    setCurrentUser(user);
                }
            }
            setIsLoading(false);
        };

        loadUsers();
    }, []);

    const register = async (username, password) => {
        // Check if username already exists
        if (users.find(u => u.username === username)) {
            throw new Error('Usuário já existe');
        }

        // Simple hash (in production, use bcrypt)
        const passwordHash = btoa(password); // Base64 encoding for now

        const newUser = {
            id: Date.now().toString(),
            username,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        // Save to Electron
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('save-users', updatedUsers);
        }

        return newUser;
    };

    const login = async (username, password) => {
        const user = users.find(u => u.username === username);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verify password
        const passwordHash = btoa(password);
        if (user.passwordHash !== passwordHash) {
            throw new Error('Senha incorreta');
        }

        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const value = {
        currentUser,
        users,
        register,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
