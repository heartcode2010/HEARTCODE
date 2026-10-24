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
  isAuthenticated: true,

  setSession: (accessToken, refreshToken, user) => {
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  logoutAction: () => {
    // Reset to default operator in no-auth mode
    set({ user: defaultOperator, accessToken: 'local-operator-session', refreshToken: 'local-operator-refresh', isAuthenticated: true });
  },
}));

export default useAuthStore;

