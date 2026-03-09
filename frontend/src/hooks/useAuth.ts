import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { login, register, guest, logoutApi } from '../api/auth.api';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

export const useAuth = () => {
  const { setAuth, clearAuth } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginRequest) => {
    setLoading(true); setError(null);
    try {
      const res = await login(data);
      // Backend sets HttpOnly cookie. Use name/email from response body for display.
      setAuth({ email: res.data.email, name: res.data.name });
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally { setLoading(false); }
  };

  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true); setError(null);
    try {
      const res = await register(data);
      setAuth({ email: res.data.email, name: res.data.name });
      navigate('/dashboard');
    } catch {
      setError('Email already in use or registration failed.');
    } finally { setLoading(false); }
  };

  const handleGuest = async () => {
    setLoading(true); setError(null);
    try {
      await guest();
      setAuth({ email: 'guest', name: 'Guest' });
      navigate('/editor/new');
    } catch {
      setError('Could not continue as guest. Try again.');
    } finally { setLoading(false); }
  };

  const handleLogout = async () => {
    try { await logoutApi(); } catch { /* ignore — clear client state regardless */ }
    clearAuth();
    navigate('/login');
  };

  return { handleLogin, handleRegister, handleGuest, handleLogout, loading, error };
};