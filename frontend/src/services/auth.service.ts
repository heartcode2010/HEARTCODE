/**
 * auth.service.ts
 * Thin wrapper around the /api/auth endpoints.
 * Components should prefer to use the `useAuthStore` Zustand store
 * or the Login page mutation — this file is for direct API calls.
 */
import api from './api';
import type { User } from '../types';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const res = await api.post<RefreshResponse>('/auth/refresh', { refreshToken });
    return res.data;
  },

  async logout(userId: string): Promise<void> {
    await api.post('/auth/logout', { id: userId });
  },

  async getMe(): Promise<User> {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data.user;
  },
};

export default authService;
