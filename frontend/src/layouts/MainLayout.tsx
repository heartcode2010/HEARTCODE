/**
 * MainLayout
 * Standard authenticated app shell — Header + main slot + Footer.
 * Import this instead of repeating layout boilerplate in every page.
 */
import React, { Suspense } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen" style={{ display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main className="flex-1 flex flex-col min-h-0" style={{ flex: '1 1 0%' }}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center flex-1 text-cyber-ash2 font-mono text-sm">
            Loading…
          </div>
        }
      >
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
);

export default MainLayout;
