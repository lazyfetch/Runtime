import axiosInstance from './axiosInstance';
import type { LoginRequest, SignupRequest, AuthResponse } from '../types/auth.types';

export const login = (data: LoginRequest) =>
  axiosInstance.post<AuthResponse>('/api/auth/login', data);

export const signup = (data: SignupRequest) =>
  axiosInstance.post<AuthResponse>('/api/auth/signup', data);

export const logout = () =>
  axiosInstance.post('/api/auth/logout');
