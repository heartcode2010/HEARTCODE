import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useScanStore from '../../store/scanStore';
import useAuthStore from '../../store/authStore';
import useSubscriptionStore from '../../store/subscriptionStore';
import useHallmarkStore from '../../store/hallmarkStore';
import { ChevronDown, Crown, Trophy, Wallet, Cpu, Sparkles } from 'lucide-react';

export const Header = () => {
  const { status } = useScanStore();
  const { user } = useAuthStore();
  const { tier } = useSubscriptionStore();
  const { getOverallLevel } = useHallmarkStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [sessionTime, setSessionTime] = useState('00:00');
  const [showDropdown, setShowDropdown] = useState(false);

  const currentPath = location.pathname;
  const overallLevel = getOverallLevel();

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

  const verses = [
    { name: 'CyberVerse', path: '/' },
    { name: 'BlockchainVerse', path: '/blockchainverse' },
    { name: 'Nexora Studio', path: '/nexora' },
    { name: 'TechVerse Academy', path: '/techverse' },
    { name: 'EduVerse Portal', path: '/eduverse' },
    { name: 'TechLabs App Studio', path: '/techlabs' },
  ];

  const tools = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Affiliate Hub', path: '/affiliate' },
    { name: 'QuizVerse', path: '/quizverse' },
    { name: 'Opportunity Engine', path: '/opportunities' },
    { name: 'News Feed', path: '/feed' },
    { name: 'Discussions', path: '/messages' },
    { name: 'Smart Assistant', path: '/ai-chat' },
    { name: 'Focus Mode', path: '/focus-mode' },
  ];

  const statusTone =
    status === 'working' ? 'text-amber-300 border-amber-400/30 bg-amber-400/10' :
    status === 'ok' ? 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10' :
    status === 'fail' ? 'text-rose-300 border-rose-400/30 bg-rose-400/10' :
    'text-slate-300 border-slate-400/20 bg-slate-400/10';

  return (
    <header className="sticky top-0 z-[200] border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-indigo-400/40 hover:bg-white/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
              H
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold tracking-[0.24em] text-white">HEARTCODE</div>
              <div className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">Signal OS</div>
            </div>
          </button>

          <div className="relative hidden md:block">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-white/10"
            >
              Explore
              <ChevronDown size={15} className={`transition ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute left-0 top-12 z-[300] grid w-[28rem] max-w-[90vw] grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/40">
                <div>
                  <div className="section-title mb-2">Core Verses</div>
                  <div className="space-y-1.5">
                    {verses.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); setShowDropdown(false); }}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${currentPath === item.path ? 'bg-indigo-500/15 text-indigo-200' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="section-title mb-2">Modules</div>
                  <div className="space-y-1.5">
                    {tools.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); setShowDropdown(false); }}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${currentPath === item.path ? 'bg-indigo-500/15 text-indigo-200' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`hidden rounded-full border px-3 py-2 text-xs font-medium sm:flex sm:items-center sm:gap-2 ${statusTone}`}>
            <span className="h-2.5 w-2.5 rounded-full bg-current" />
            {status === 'working' ? 'Scanning' : status === 'ok' ? 'Ready' : status === 'fail' ? 'Attention' : 'Idle'}
          </div>
          <button onClick={() => navigate('/wallet')} className="btn-secondary hidden h-10 px-3 text-sm sm:flex">
            <Wallet size={15} /> Wallet
          </button>
          <button onClick={() => navigate('/affiliate')} className="btn-secondary hidden h-10 px-3 text-sm sm:flex">
            <Sparkles size={15} /> Affiliates
          </button>
          <button onClick={() => navigate('/quizverse')} className="btn-secondary hidden h-10 px-3 text-sm sm:flex">
            <Trophy size={15} /> QuizVerse
          </button>
          <button onClick={() => navigate('/hallmark')} className="btn-secondary h-10 px-3 text-sm">
            <Trophy size={15} /> Lvl {overallLevel}
          </button>
          <button onClick={() => navigate('/subscription-plans')} className="btn-secondary hidden h-10 px-3 text-sm sm:flex">
            <Crown size={15} /> {tier}
          </button>
          <button onClick={() => navigate('/admin')} className="btn-secondary h-10 px-3 text-sm">
            <Cpu size={15} />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[0.68rem] text-slate-300">
              {user ? `Operator: ${user.username}` : 'Operator Workspace'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
