import { create } from 'zustand';
import { User } from '../types';

interface AuthStoreState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  logoutAction: () => void;
}

// Read initial state from localStorage
const cachedUser = localStorage.getItem('hc_user');
const cachedAccessToken = localStorage.getItem('hc_access_token');
const cachedRefreshToken = localStorage.getItem('hc_refresh_token');

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: cachedUser ? JSON.parse(cachedUser) : null,
  accessToken: cachedAccessToken || null,
  refreshToken: cachedRefreshToken || null,
  isAuthenticated: !!cachedAccessToken,

  setSession: (accessToken, refreshToken, user) => {
    localStorage.setItem('hc_user', JSON.stringify(user));
    localStorage.setItem('hc_access_token', accessToken);
    localStorage.setItem('hc_refresh_token', refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  logoutAction: () => {
    localStorage.removeItem('hc_user');
    localStorage.removeItem('hc_access_token');
    localStorage.removeItem('hc_refresh_token');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
