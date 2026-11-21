/**
 * AuthContext
 * A thin React Context wrapper that exposes a convenience `useAuth()` hook.
 * The actual auth state lives in the Zustand `authStore` — this context
 * simply provides a familiar React-idiomatic API without prop-drilling.
 */
import React, { createContext, useContext } from 'react';
import useAuthStore from '../store/authStore';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, accessToken, setSession, logoutAction } = useAuthStore();

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        setSession,
        logout: logoutAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
