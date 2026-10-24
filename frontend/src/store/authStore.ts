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

<<<<<<< HEAD
const defaultOperator: User = {
  id: 'local-operator',
  username: 'Operator',
  email: 'operator@heartcode.local',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: defaultOperator,
  accessToken: 'local-operator-session',
  refreshToken: 'local-operator-refresh',
=======
// Default guest session - no login required
const defaultUser: User = {
  id: 'usr-signal-01',
  username: 'Operator',
  email: 'operator@heartcode.io',
  role: 'superadmin',
  tier: 'premium',
  createdAt: new Date().toISOString(),
};

const cachedUser = localStorage.getItem('hc_user');
const cachedAccessToken = localStorage.getItem('hc_access_token');
const cachedRefreshToken = localStorage.getItem('hc_refresh_token');

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: cachedUser ? JSON.parse(cachedUser) : defaultUser,
  accessToken: cachedAccessToken || 'guest-token-access',
  refreshToken: cachedRefreshToken || 'guest-token-refresh',
>>>>>>> b733d8dfa1b6d44921a2fd3fa5658f3ec62e645e
  isAuthenticated: true,

  setSession: (accessToken, refreshToken, user) => {
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  logoutAction: () => {
<<<<<<< HEAD
    // Reset to default operator in no-auth mode
    set({ user: defaultOperator, accessToken: 'local-operator-session', refreshToken: 'local-operator-refresh', isAuthenticated: true });
=======
    // Reset to default guest session instead of locking out
    set({ user: defaultUser, accessToken: 'guest-token-access', refreshToken: 'guest-token-refresh', isAuthenticated: true });
>>>>>>> b733d8dfa1b6d44921a2fd3fa5658f3ec62e645e
  },
}));

export default useAuthStore;

