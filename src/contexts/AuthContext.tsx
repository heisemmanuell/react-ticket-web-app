import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const session = localStorage.getItem('ticketapp_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('ticketapp_session');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API request
    const users = JSON.parse(localStorage.getItem('ticketapp_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };
      setUser(userData);
      localStorage.setItem('ticketapp_session', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API request
    const users = JSON.parse(localStorage.getItem('ticketapp_users') || '[]');

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, this would be hashed
    };

    users.push(newUser);
    localStorage.setItem('ticketapp_users', JSON.stringify(users));

    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
    setUser(userData);
    localStorage.setItem('ticketapp_session', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ticketapp_session');
    window.location.href = "/";
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};