import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types/auth.types';
import { setAuthToken } from '../api/axiosInstance';

interface AuthContextType {
  user: User | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (u: User, token: string) => {
    setUser(u);
    setAuthToken(token);
  };

  const clearAuth = () => {
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, clearAuth, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
