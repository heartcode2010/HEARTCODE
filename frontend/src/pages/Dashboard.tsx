import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Scanner } from '../components/Scanner';
import { SourcePanel } from '../components/SourcePanel';
import { VulnerabilityPanel } from '../components/VulnerabilityPanel';
import { AIDetectionPanel } from '../components/AIDetectionPanel';
import { TechStackPanel } from '../components/TechStackPanel';
import { PreviewFloat } from '../components/Shared/PreviewFloat';
import { Modals } from '../components/Shared/Modals';
import { SplashScreen } from '../components/SplashScreen';
import useScanStore from '../store/scanStore';
import useSubscriptionStore from '../store/subscriptionStore';
import useWalletStore from '../store/walletStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useScan } from '../hooks/useScan';
import { useScrollTop } from '../hooks/useScrollTop';

import {
  Trophy, Shield, ShieldCheck, Heart, Award, ArrowUpRight, DollarSign,
  MessageSquare, Sparkles, Mic, MicOff, Star, HelpCircle, Laptop, Download, Lock, Check
} from 'lucide-react';

// ── Lazy-loaded Intelligence Panels (CyberVerse) ──
const OperationModes = lazy(() => import('../components/OperationModes'));
const MissionControl = lazy(() => import('../components/MissionControl'));
const ScanLayers = lazy(() => import('../components/ScanLayers'));
const WebsiteDNAPanel = lazy(() => import('../components/WebsiteDNAPanel'));
const InfrastructurePanel = lazy(() => import('../components/InfrastructurePanel'));
const NetworkConsole = lazy(() => import('../components/NetworkConsole'));
const MemoryInspector = lazy(() => import('../components/MemoryInspector'));
const EndpointPanel = lazy(() => import('../components/EndpointPanel'));
const SecretLeakPanel = lazy(() => import('../components/SecretLeakPanel'));
const BehavioralPanel = lazy(() => import('../components/BehavioralPanel'));
const AIForensicsPanel = lazy(() => import('../components/AIForensicsPanel'));
const ThreatRadar = lazy(() => import('../components/ThreatRadar'));
const ReputationPanel = lazy(() => import('../components/ReputationPanel'));
const ForensicsTimeline = lazy(() => import('../components/ForensicsTimeline'));
const DOMSurveillance = lazy(() => import('../components/DOMSurveillance'));
const ObfuscationPanel = lazy(() => import('../components/ObfuscationPanel'));
const ShadowAssetPanel = lazy(() => import('../components/ShadowAssetPanel'));
const SecurityIntelPanel = lazy(() => import('../components/SecurityIntelPanel'));
const ExecutionTrace = lazy(() => import('../components/ExecutionTrace'));
const BlackboxMode = lazy(() => import('../components/BlackboxMode'));
const XRayOverlay = lazy(() => import('../components/XRayOverlay'));
const ReportExport = lazy(() => import('../components/ReportExport'));
const AIAssistant = lazy(() => import('../components/AIAssistant'));

const PanelLoader: React.FC = () => (
  <div className="intel-panel-loader h-1.5 bg-cyber-surface overflow-hidden">
    <div className="intel-panel-loader-bar h-full bg-[#8b5cf6] w-1/3 animate-bounce" />
  </div>
);

const CyberVerseWorkspace: React.FC = () => {
  const { activePanels } = useIntelligenceStore();
  const { htmlSource } = useScanStore();

  if (!htmlSource) return null;
  const visiblePanels = Object.entries({
    'dna-profile': WebsiteDNAPanel,
    'infrastructure': InfrastructurePanel,
    'network-console': NetworkConsole,
    'memory-inspector': MemoryInspector,
    'endpoints': EndpointPanel,
    'secret-leak': SecretLeakPanel,
    'behavioral': BehavioralPanel,
    'ai-forensics': AIForensicsPanel,
    'threat-radar': ThreatRadar,
    'reputation': ReputationPanel,
    'timeline': ForensicsTimeline,
    'dom-surveillance': DOMSurveillance,
    'obfuscation': ObfuscationPanel,
    'shadow-assets': ShadowAssetPanel,
    'security-intel': SecurityIntelPanel,
    'execution-trace': ExecutionTrace,
  }).filter(([id]) => activePanels.has(id));

  return (
    <div className="intelligence-workspace p-6 space-y-6">
      <Suspense fallback={<PanelLoader />}><OperationModes /></Suspense>
      <Suspense fallback={<PanelLoader />}><ScanLayers /></Suspense>
      <Suspense fallback={<PanelLoader />}><XRayOverlay /></Suspense>

      {activePanels.has('mission-control') && (
        <Suspense fallback={<PanelLoader />}><MissionControl /></Suspense>
      )}
      <Suspense fallback={<PanelLoader />}><BlackboxMode /></Suspense>

      {visiblePanels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePanels.map(([id, PanelComponent]) => (
            <div key={id} className="bg-[#111114] border border-[#2a2a2e] p-5 rounded-2xl">
              <Suspense fallback={<PanelLoader />}><PanelComponent /></Suspense>
            </div>
          ))}
        </div>
      )}
      <Suspense fallback={<PanelLoader />}><ReportExport /></Suspense>
    </div>
  );
};

// ── Toast notification ──
const Toast: React.FC = () => {
  const { toast, hideToast } = useScanStore();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (toast?.show) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hideToast, 2800);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast?.show]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#111114] border border-[#2a2a2e] text-white text-[0.8rem] font-medium px-4 py-2.5 rounded-full z-[9500] pointer-events-none whitespace-nowrap flex items-center gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-200
        ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <span>{toast.icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
};

// ── Scroll-to-top button ──
const ScrollTopBtn: React.FC = () => {
  const show = useScrollTop(120);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      aria-label="Scroll to top"
      className={`fixed bottom-6 left-6 w-[42px] h-[42px] rounded-full bg-[#8b5cf6] border-none text-white cursor-pointer flex items-center justify-center z-[4001] shadow-[0_4px_20px_rgba(139,92,246,0.5)] transition-all duration-250
        hover:shadow-[0_6px_28px_rgba(139,92,246,0.7)] hover:-translate-y-0.5
        active:scale-[0.94]
        ${show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [splashDone, setSplashDone] = useState(false);
  const { triggerScan } = useScan();
  const { htmlSource } = useScanStore();
  const { tier } = useSubscriptionStore();
  const { balance } = useWalletStore();

  // Voice Recognition State (Speech to Text)
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const recognitionRef = useRef<any>(null);

  // Check if viewing CyberVerse scanner
  const viewMode = searchParams.get('verse') || 'universe';

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new Speech();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setVoiceText(text);
        setIsListening(false);
        alert(`Speech detected: "${text}"`);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const wallpapers = [
    { id: 'wp1', title: 'Cyberpunk Alleyway Neo-Tokyo', isPremium: false, url: '🏙️' },
    { id: 'wp2', title: 'Cybernetic Heart Core System', isPremium: false, url: '❤️' },
    { id: 'wp3', title: 'Netrunner Terminal Hologram', isPremium: true, url: '🌌' },
    { id: 'wp4', title: 'Synthwave Skyline Sunset Grid', isPremium: true, url: '🌅' },
  ];

  const featuredModules = [
    { title: 'Affiliate Engine', description: 'Track referrals, manage commissions, and request payouts.', action: () => navigate('/affiliate') },
    { title: 'QuizVerse Studio', description: 'Create and publish educational quizzes with flexible access.', action: () => navigate('/quizverse') },
    { title: 'AI Credit Wallet', description: 'Manage premium credits and monetization flows.', action: () => navigate('/wallet') },
  ];

  const handleDownloadWallpaper = (wp: typeof wallpapers[0]) => {
    if (wp.isPremium && tier === 'free') {
      alert('This ultra-cool cyberpunk wallpaper is exclusive to Pro and Premium members.');
      return;
    }
    alert(`Downloading Wallpaper "${wp.title}" bundle...`);
  };

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      <div className="flex flex-col min-h-screen bg-[#0a0a0b] text-white">
        <Header />

        {viewMode === 'cyberverse' ? (
          <>
            <Scanner onTriggerScan={triggerScan} />
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden border-t border-[#1a1a20]">
              <SourcePanel />
              <div className="flex flex-col md:flex-row flex-1">
                <VulnerabilityPanel />
                <TechStackPanel />
                <AIDetectionPanel />
              </div>
            </main>
            <CyberVerseWorkspace />
          </>
        ) : (
          <main className="mx-auto flex w-full max-w-7xl flex-1 select-none flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,124,255,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.14),transparent_24%)]" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-200">
                    <Sparkles size={14} /> System core active
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your operations hub is ready for the next move.</h1>
                  <p className="mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
                    Monitor your workflow, move quickly through high-value actions, and stay focused on the signals that matter most.
                  </p>
                </div>
                <button onClick={toggleVoiceListen} className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition ${isListening ? 'border-rose-400/40 bg-rose-500/15 text-rose-200' : 'border-white/10 bg-white/5 text-slate-200 hover:border-indigo-400/40 hover:bg-white/10'}`} title="Voice controls">
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>

              <div className="relative mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                {[
                  { name: 'Learning score', value: '820 XP', icon: Trophy, accent: 'text-amber-300' },
                  { name: 'Cyber score', value: '940 / 1000', icon: Shield, accent: 'text-rose-300' },
                  { name: 'Health score', value: '720 HP', icon: Heart, accent: 'text-emerald-300' },
                  { name: 'Career sync', value: '880 Match', icon: Award, accent: 'text-cyan-300' },
                  { name: 'Income', value: `₦${balance.toLocaleString()}`, icon: DollarSign, accent: 'text-emerald-300' },
                  { name: 'Project rating', value: '650', icon: Laptop, accent: 'text-fuchsia-300' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="section-title mb-2">{item.name}</div>
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={item.accent} />
                        <span className="text-sm font-semibold text-white">{item.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {featuredModules.map((module) => (
                <button key={module.title} onClick={module.action} className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left shadow-lg shadow-black/20 transition hover:border-indigo-400/40 hover:bg-white/10">
                  <div className="text-sm font-semibold text-white">{module.title}</div>
                  <div className="mt-2 text-sm text-slate-400">{module.description}</div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-200">
                    Open module <ArrowUpRight size={14} />
                  </div>
                </button>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="surface-card p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="section-title">Momentum</div>
                    <h2 className="mt-2 text-xl font-semibold text-white">Your next best actions</h2>
                  </div>
                  <button onClick={() => navigate('/subscription-plans')} className="btn-secondary h-10 px-3 text-sm">Upgrade</button>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { title: 'Complete the Solidity module', detail: 'A high-signal lesson that strengthens your blockchain workflow.', meta: '+120 XP', tone: 'border-amber-400/20 bg-amber-400/10 text-amber-200' },
                    { title: 'Open the AI detection panel', detail: 'Inspect the latest target and compare signal confidence.', meta: 'New insight', tone: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' },
                    { title: 'Review your security posture', detail: 'Prioritize exposed endpoints and recent findings.', meta: 'Priority', tone: 'border-rose-400/20 bg-rose-400/10 text-rose-200' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-400">{item.detail}</div>
                      </div>
                      <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${item.tone}`}>{item.meta}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-card p-6">
                  <div className="section-title">Workspace health</div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">Signal coverage</div>
                        <div className="mt-1 text-sm text-slate-400">Your stack remains well balanced.</div>
                      </div>
                      <div className="text-2xl font-semibold text-white">92%</div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                    </div>
                  </div>
                </div>

                <div className="surface-card-soft p-6">
                  <div className="section-title">Quick links</div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'Open academy', path: '/academy', icon: Sparkles },
                      { label: 'Review messages', path: '/messages', icon: MessageSquare },
                      { label: 'Manage wallet', path: '/wallet', icon: DollarSign },
                    ].map((link) => {
                      const Icon = link.icon;
                      return (
                        <button key={link.label} onClick={() => navigate(link.path)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-indigo-400/40 hover:bg-white/10">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-indigo-500/10 p-2 text-indigo-200"><Icon size={15} /></div>
                            <span className="text-sm font-medium text-white">{link.label}</span>
                          </div>
                          <ArrowUpRight size={15} className="text-slate-500" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="surface-card p-6">
                <div className="section-title">Recommended next steps</div>
                <div className="mt-4 space-y-3">
                  {[
                    { title: 'Launch a vulnerability scan', description: 'Inspect a fresh target and open the evidence panel.', action: 'Start scan' },
                    { title: 'Run code forensics', description: 'Surface structural patterns that traditional inspection misses.', action: 'Open forensics' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-400">{item.description}</div>
                      </div>
                      <button className="btn-secondary h-10 px-3 text-sm">{item.action}</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card p-6">
                <div className="section-title">Creator & support</div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                  <div className="flex items-center gap-4">
                    <img src="/media/images/ambassador-heartcode.jpg" alt="Ambassador Heartcode" className="h-16 w-16 rounded-2xl object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-white">Ambassador Heartcode</div>
                      <div className="mt-1 text-sm text-slate-400">Founder of the Signal OS experience.</div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href="https://wa.me/2348140473040" target="_blank" rel="noopener noreferrer" className="btn-primary h-10 px-3 text-sm">Contact via WhatsApp</a>
                    <a href="mailto:aniebietabasienobong@gmail.com" className="btn-secondary h-10 px-3 text-sm">Email creator</a>
                  </div>
                </div>
              </div>
            </section>
          </main>
        )}

        <Footer />
      </div>

      <PreviewFloat />
      <Modals />
      <Toast />
      <ScrollTopBtn />

      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>
    </>
  );
};

export default Dashboard;
