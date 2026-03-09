import axiosInstance from './axiosInstance';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const login = (data: LoginRequest) =>
  axiosInstance.post<AuthResponse>('/api/auth/login', data);

export const register = (data: RegisterRequest) =>
  axiosInstance.post<AuthResponse>('/api/auth/register', data);

export const guest = () =>
  axiosInstance.post<AuthResponse>('/api/auth/guest');