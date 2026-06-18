import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useScanStore from '../../store/scanStore';
import useAuthStore from '../../store/authStore';

export const Header = () => {
  const { status, statusLabel, setHistoryOpen } = useScanStore();
  const { user, logoutAction } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sessionTime, setSessionTime] = useState('00:00');
  const [isGlitching, setIsGlitching] = useState(false);

  const isAcademy = location.pathname.startsWith('/academy');

  // Periodic Glitch Logo Loop
  useEffect(() => {
    let timeoutId: any;
    
    const runGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
      
      const delay = 800 + Math.random() * 1700;
      timeoutId = setTimeout(runGlitch, delay);
    };

    timeoutId = setTimeout(runGlitch, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Session timer hook
  useEffect(() => {
    const sessionStart = Date.now();
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - sessionStart) / 1000);
      const min = String(Math.floor(diff / 60)).padStart(2, '0');
      const sec = String(diff % 60).padStart(2, '0');
      setSessionTime(`${min}:${sec}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Map status styles
  const dotColor = 
    status === 'working' ? 'bg-cyber-amber shadow-[0_0_7px_var(--amber)] animate-[blink_0.6s_infinite]' :
    status === 'ok' ? 'bg-cyber-green shadow-[0_0_7px_var(--green)]' :
    status === 'fail' ? 'bg-cyber-red shadow-[0_0_7px_var(--red)]' :
    'bg-cyber-ash3';

  const pillBorder = 
    status === 'working' ? 'border-cyber-amber text-cyber-amber' :
    status === 'ok' ? 'border-cyber-green text-cyber-green' :
    status === 'fail' ? 'border-cyber-red text-cyber-red' :
    'border-cyber-border text-cyber-ash2';

  return (
    <header className="sticky top-0 z-[200] bg-cyber-bg/96 backdrop-blur-[20px] border-b border-cyber-border-red px-5 py-3.5 flex items-center justify-between gap-4 flex-shrink-0 shadow-[0_1px_24px_rgba(224,40,64,0.08)]">
      <div className="logo-group flex items-baseline gap-2.5">
        <div 
          className={`logo select-none cursor-default ${isGlitching ? 'glitch' : ''}`} 
          data-text="CODED"
        >
          HEARTCODE
        </div>
        <div className="logo-tag text-[0.58rem] text-cyber-red-deep tracking-[0.22em] uppercase border border-cyber-border-red px-2 py-0.5 rounded">
          DOMAIN
        </div>

        {/* ═══ Mode Toggle ═══ */}
        <nav className="hdr-nav flex items-center gap-1 ml-4">
          <button
            onClick={() => navigate('/')}
            className={`hdr-nav-btn font-mono text-[0.62rem] tracking-[0.18em] uppercase px-3 py-1 rounded border transition-all duration-200 cursor-pointer ${
              !isAcademy
                ? 'bg-cyber-red/15 border-cyber-red text-cyber-red shadow-[0_0_12px_rgba(224,40,64,0.2)]'
                : 'bg-transparent border-cyber-border text-cyber-ash3 hover:text-cyber-ash hover:border-cyber-ash2'
            }`}
          >
            ⚡ INTEL
          </button>
          <button
            onClick={() => navigate('/academy')}
            className={`hdr-nav-btn font-mono text-[0.62rem] tracking-[0.18em] uppercase px-3 py-1 rounded border transition-all duration-200 cursor-pointer ${
              isAcademy
                ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-[0_0_12px_rgba(0,245,255,0.2)]'
                : 'bg-transparent border-cyber-border text-cyber-ash3 hover:text-cyber-ash hover:border-cyber-ash2'
            }`}
          >
            🎓 ACADEMY
          </button>
        </nav>
      </div>

      <div className="hdr-right flex items-center gap-3 flex-shrink-0">
        <button 
          onClick={() => setHistoryOpen(true)}
          className="act-btn flex items-center gap-1.5 px-3 py-1 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red rounded text-[0.68rem] text-cyber-ash hover:text-white font-sans cursor-pointer transition-all duration-150 active:scale-[0.97]"
          title="Scan History"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="hidden sm:inline">History</span>
        </button>

        <div className={`status-pill flex items-center gap-2 bg-cyber-surface border rounded-[100px] px-3.5 py-1 text-[0.68rem] font-mono whitespace-nowrap transition-colors duration-300 ${pillBorder}`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${dotColor}`} />
          <span>{statusLabel}</span>
        </div>

        <div className="session-clock font-mono text-[0.66rem] text-cyber-ash3 whitespace-nowrap hidden sm:block">
          Session <b className="text-cyber-ash2 font-normal">{sessionTime}</b>
        </div>

        {user && (
          <div className="flex items-center gap-2 border-l border-cyber-border pl-3">
            <span className="font-mono text-[0.68rem] text-cyber-ash2 hidden md:inline">
              [{user.username.toUpperCase()}]
            </span>
            <button
              onClick={logoutAction}
              className="act-btn flex items-center gap-1 px-2.5 py-1 border border-cyber-border hover:border-cyber-red bg-cyber-surface2 hover:bg-cyber-red-dim rounded text-[0.66rem] text-cyber-red font-mono cursor-pointer transition-all duration-150 active:scale-[0.97]"
              title="Log Out Security Session"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
