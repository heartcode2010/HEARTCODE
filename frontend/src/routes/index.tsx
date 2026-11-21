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
const TechnovaWorkspace = lazy(() => import('../pages/TechnovaWorkspace'));
const QuizVerse = lazy(() => import('../pages/QuizVerseCloud'));
const QuizVerseLocal = lazy(() => import('../pages/QuizVerse'));
const VerseWorkspace = lazy(() => import('../pages/VerseWorkspace'));
const WalletPage = lazy(() => import('../pages/WalletPage'));
const OrganizationsPage = lazy(() => import('../pages/OrganizationsPage'));

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
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Unified TECHNOVA OS workspace. The scanner remains at the existing root route. */}
        <Route path="/os" element={<TechnovaWorkspace />} />
        <Route path="/workspace" element={<Navigate to="/os" replace />} />
        <Route path="/quizverse" element={<QuizVerse />} />
        <Route path="/quizverse/local" element={<QuizVerseLocal />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/blockchainverse" element={<VerseWorkspace />} />
        <Route path="/nexora" element={<VerseWorkspace />} />
        <Route path="/techverse" element={<VerseWorkspace />} />
        <Route path="/eduverse" element={<VerseWorkspace />} />
        <Route path="/techlabs" element={<VerseWorkspace />} />

        {/* Academy routes */}
        <Route
          path="/academy/*"
          element={<AcademyLanding />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
