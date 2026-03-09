import axiosInstance from './axiosInstance';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';
import type { User } from '../types/auth.types';

export const login = (data: LoginRequest) =>
  axiosInstance.post<AuthResponse>('/api/auth/login', data);

export const register = (data: RegisterRequest) =>
  axiosInstance.post<AuthResponse>('/api/auth/register', data);

export const guest = () =>
  axiosInstance.post<AuthResponse>('/api/auth/guest');

// Validates the HttpOnly cookie and returns the current user's info.
// Called on every app mount to restore session across page refreshes.
export const getMe = () =>
  axiosInstance.get<User>('/api/auth/me');

// Asks the backend to clear the HttpOnly cookie.
export const logoutApi = () =>
  axiosInstance.post('/api/auth/logout');