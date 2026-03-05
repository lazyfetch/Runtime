import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { login, signup, logout } from '../api/auth.api';
import type { LoginRequest, SignupRequest } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { setAuth, clearAuth } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(data);
      setAuth(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signup(data);
      setAuth(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    clearAuth();
    navigate('/login');
  };

  return { handleLogin, handleSignup, handleLogout, loading, error };
};
