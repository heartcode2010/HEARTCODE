/**
 * AuthLayout
 * Minimal centred layout for unauthenticated pages (Login / Register).
 * The cyberpunk scanline overlay and corner brackets come from index.css
 * body::before/after, so we just need a flex centred wrapper here.
 */
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="relative min-h-screen bg-cyber-bg flex items-center justify-center p-4">
    {/* Scanline overlay */}
    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.09)_2px,rgba(0,0,0,0.09)_4px)] pointer-events-none z-10" />
    {children}
  </div>
);

export default AuthLayout;
