/**
 * routes/index.tsx
 * Route definitions using React Router v6.
 * Direct access with no login required.
 */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MusicPlayer from '../components/Shared/MusicPlayer';

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
    <div className="font-mono text-[#6e6868] text-sm animate-pulse">Loading workspace…</div>
  </div>
);

// ── Direct Route Access (No Login Requirement) ──────────────────────────────
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

// ── App Router ────────────────────────────────────────────────────────────────
const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Redirect login directly to dashboard */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Core routes */}
        <Route path="/" element={<Dashboard />} />

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
          path="/learning"
          element={
            <ProtectedRoute>
              <LearningDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id"
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
          element={<AcademyLanding />}
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


## TECHNOVA foundation

An additive TECHNOVA workspace is available at `/technova`. It introduces a Corporate Editorial shell while leaving the existing vulnerability scanner and Cyber Academy routes/components untouched.

### NOVA / Dark Obsydia AI connection

Configure these **server-side** variables (never expose the API key through a `VITE_*` variable):

- `OBSYDIA_BASE_URL`: base URL of your deployed Dark Obsydia AI instance, without a trailing slash (for example, `https://ai.example.com`).
- `OBSYDIA_API_KEY`: a developer API key created in the Obsydia API dashboard.
- `OBSYDIA_MODEL`: optional model name, e.g. `qwen3:4b`.

The TECHNOVA backend proxies chat requests to Obsydia's `POST /api/v1/chat` endpoint. Until the URL and key are configured, NOVA reports itself as unconfigured and does not fabricate responses.

The first TECHNOVA foundation includes a working EVM wallet connection request, browser-local project/opportunity notes, workspace navigation, and the NOVA API bridge. Wallet balances, signing, Solana, smart-contract compilation/deployment, persistent user accounts, credentials, payments and opportunity feeds require additional provider/backend integrations and are not represented as live in this foundation.
