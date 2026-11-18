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

// Default guest session - no login required
const defaultUser: User = {
  id: 'usr-signal-01',
  username: 'Operator',
  email: 'operator@heartcode.io',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const cachedUser = localStorage.getItem('hc_user');
const cachedAccessToken = localStorage.getItem('hc_access_token');
const cachedRefreshToken = localStorage.getItem('hc_refresh_token');

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: cachedUser ? JSON.parse(cachedUser) : defaultUser,
  accessToken: cachedAccessToken || 'guest-token-access',
  refreshToken: cachedRefreshToken || 'guest-token-refresh',
  isAuthenticated: true,

  setSession: (accessToken, refreshToken, user) => {
    localStorage.setItem('hc_user', JSON.stringify(user));
    localStorage.setItem('hc_access_token', accessToken);
    localStorage.setItem('hc_refresh_token', refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  logoutAction: () => {
    // Reset to default guest session instead of locking out
    set({ user: defaultUser, accessToken: 'guest-token-access', refreshToken: 'guest-token-refresh', isAuthenticated: true });
  },
}));

export default useAuthStore;
