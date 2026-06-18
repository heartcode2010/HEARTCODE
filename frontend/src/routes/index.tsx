/**
 * routes/index.tsx
 * Centralised route definitions using React Router v6.
 * All pages are lazy-loaded via React.lazy + Suspense for code splitting.
 */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

// ── Academy Pages (lazy-loaded) ──
const AcademyLanding = lazy(() => import('../pages/academy/AcademyLanding'));

// ── Fallback while lazy chunk loads ──────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
    <div className="font-mono text-cyber-ash2 text-sm animate-pulse">LOADING SYSTEM…</div>
  </div>
);

// ── Protected Route Guard ─────────────────────────────────────────────────────
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ── App Router ────────────────────────────────────────────────────────────────
const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Academy routes */}
        <Route
          path="/academy/*"
          element={
            <ProtectedRoute>
              <AcademyLanding />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
