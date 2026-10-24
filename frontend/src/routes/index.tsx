/**
 * routes/index.tsx
 * Route definitions using React Router v6.
 * Direct access with no login required.
 */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const AcademyLanding = lazy(() => import('../pages/academy/AcademyLanding'));

// ── Fallback while lazy chunk loads ──────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
    <div className="font-mono text-cyber-ash2 text-sm animate-pulse">LOADING SYSTEM…</div>
  </div>
);

// ── App Router ────────────────────────────────────────────────────────────────
const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/academy/*" element={<AcademyLanding />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;

