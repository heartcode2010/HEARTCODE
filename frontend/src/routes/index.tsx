/**
 * routes/index.tsx
 * Centralised route definitions using React Router v6.
 * All pages are lazy-loaded via React.lazy + Suspense for code splitting.
 */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import MusicPlayer from '../components/Shared/MusicPlayer';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

// ── Academy Pages ──
const AcademyLanding = lazy(() => import('../pages/academy/AcademyLanding'));

// ── Megastructure Module Pages ──
const SubscriptionPlans = lazy(() => import('../pages/SubscriptionPlans'));
const HallmarkPage = lazy(() => import('../pages/HallmarkPage'));
const MessagingPage = lazy(() => import('../pages/MessagingPage'));
const AIChatPage = lazy(() => import('../pages/AIChatPage'));
const BotMarketplace = lazy(() => import('../pages/BotMarketplace'));
const BotCreator = lazy(() => import('../pages/BotCreator'));
const NewsFeedPage = lazy(() => import('../pages/NewsFeedPage'));
const LearningDashboard = lazy(() => import('../pages/LearningDashboard'));
const CoursePage = lazy(() => import('../pages/CoursePage'));
const FocusMode = lazy(() => import('../pages/FocusMode'));
const WalletPage = lazy(() => import('../pages/WalletPage'));
const AffiliatePage = lazy(() => import('../pages/AffiliatePage'));
const QuizVersePage = lazy(() => import('../pages/QuizVersePage'));
const MarketplacePage = lazy(() => import('../pages/MarketplacePage'));
const OpportunitiesPage = lazy(() => import('../pages/OpportunitiesPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

// ── Verse Sub-Homes ──
const BlockchainHome = lazy(() => import('../pages/blockchainverse/BlockchainHome'));
const NexoraHome = lazy(() => import('../pages/nexora/NexoraHome'));
const TechVerseHome = lazy(() => import('../pages/techverse/TechVerseHome'));
const EduVerseHome = lazy(() => import('../pages/eduverse/EduVerseHome'));
const TechLabsHome = lazy(() => import('../pages/techlabs/TechLabsHome'));

// ── Fallback while lazy chunk loads ──────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
    <div className="font-mono text-[#6e6868] text-sm animate-pulse">LOADING TECHNOVA OS SECURE ENDPOINT…</div>
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

        {/* Megastructure routes */}
        <Route
          path="/subscription-plans"
          element={
            <ProtectedRoute>
              <SubscriptionPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hallmark"
          element={
            <ProtectedRoute>
              <HallmarkPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <AIChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bot-marketplace"
          element={
            <ProtectedRoute>
              <BotMarketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bot-creator"
          element={
            <ProtectedRoute>
              <BotCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <NewsFeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning-dashboard"
          element={
            <ProtectedRoute>
              <LearningDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/focus-mode"
          element={
            <ProtectedRoute>
              <FocusMode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/affiliate"
          element={
            <ProtectedRoute>
              <AffiliatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizverse"
          element={
            <ProtectedRoute>
              <QuizVersePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <OpportunitiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Verse-specific routes */}
        <Route
          path="/blockchainverse"
          element={
            <ProtectedRoute>
              <BlockchainHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nexora"
          element={
            <ProtectedRoute>
              <NexoraHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/techverse"
          element={
            <ProtectedRoute>
              <TechVerseHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eduverse"
          element={
            <ProtectedRoute>
              <EduVerseHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/techlabs"
          element={
            <ProtectedRoute>
              <TechLabsHome />
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
      {/* Mounted globally for continuous play across navigation loops */}
      <MusicPlayer />
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
