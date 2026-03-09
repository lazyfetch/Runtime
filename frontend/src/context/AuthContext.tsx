import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/auth.types';
import { getMe } from '../api/auth.api';

interface AuthContextType {
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
  authLoading: boolean; // true while the initial /api/auth/me check is in flight
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Start as loading — we must check the cookie before rendering protected routes
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // On every app load, ask the backend to validate the HttpOnly cookie and return user info.
    // This is the ONLY way auth state is restored — no localStorage, no parsing tokens in JS.
    getMe()
      .then((res) => setUser({ email: res.data.email, name: res.data.name }))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const setAuth = (u: User) => setUser(u);
  const clearAuth = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setAuth, clearAuth, isAuthenticated: !!user, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
