import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
import { useIntelligenceStore } from '../store/intelligenceStore';
import api from '../services/api';

import { useScrollTop } from '../hooks/useScrollTop';
import { useScan } from '../hooks/useScan';

// ── Lazy-loaded Intelligence Components ──
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

// ── Lazy Loading Fallback
const PanelLoader: React.FC = () => (
  <div className="intel-panel-loader">
    <div className="intel-panel-loader-bar" />
  </div>
);

// ── Scroll-to-top button
const ScrollTopBtn: React.FC = () => {
  const show = useScrollTop(120);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      aria-label="Scroll to top"
      className={`scroll-top-btn fixed bottom-6 left-6 w-[42px] h-[42px] rounded-full bg-cyber-red border-none text-white cursor-pointer flex items-center justify-center z-[4001] shadow-[0_4px_20px_rgba(224,40,64,0.5)] transition-all duration-250
        hover:bg-cyber-red-hi hover:shadow-[0_6px_28px_rgba(224,40,64,0.7)] hover:-translate-y-0.5 hover:scale-[1.06]
        active:scale-[0.94]
        ${show ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-3 scale-[0.85] pointer-events-none'}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

// ── Toast notification
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
      className={`toast fixed bottom-5 left-1/2 -translate-x-1/2 bg-cyber-surface3 border border-cyber-border-red text-white text-[0.8rem] font-medium px-4 py-2.5 rounded-[100px] z-[9500] pointer-events-none whitespace-nowrap flex items-center gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-[220ms]
        ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <span>{toast.icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
};

// ── Intelligence Workspace Panel Registry
const PANEL_MAP: Record<string, { component: React.LazyExoticComponent<any>; label: string }> = {
  'dna-profile':        { component: WebsiteDNAPanel,    label: 'Website DNA' },
  'infrastructure':     { component: InfrastructurePanel, label: 'Infrastructure' },
  'network-console':    { component: NetworkConsole,      label: 'Network Console' },
  'memory-inspector':   { component: MemoryInspector,     label: 'Memory Inspector' },
  'endpoints':          { component: EndpointPanel,       label: 'Endpoints' },
  'secret-leak':        { component: SecretLeakPanel,     label: 'Secret Leaks' },
  'behavioral':         { component: BehavioralPanel,     label: 'Behavioral' },
  'ai-forensics':       { component: AIForensicsPanel,    label: 'AI Forensics' },
  'threat-radar':       { component: ThreatRadar,         label: 'Threat Radar' },
  'reputation':         { component: ReputationPanel,     label: 'Reputation' },
  'timeline':           { component: ForensicsTimeline,   label: 'Timeline' },
  'dom-surveillance':   { component: DOMSurveillance,     label: 'DOM Surveillance' },
  'obfuscation':        { component: ObfuscationPanel,    label: 'Obfuscation' },
  'shadow-assets':      { component: ShadowAssetPanel,    label: 'Shadow Assets' },
  'security-intel':     { component: SecurityIntelPanel,  label: 'Security Intel' },
  'execution-trace':    { component: ExecutionTrace,      label: 'Execution Trace' },
};

// ── Intelligence Workspace
const IntelligenceWorkspace: React.FC = () => {
  const { activePanels, isIntelligenceActive, missionControlExpanded } = useIntelligenceStore();
  const { htmlSource } = useScanStore();

  if (!htmlSource) return null;

  const visiblePanels = Object.entries(PANEL_MAP).filter(([id]) => activePanels.has(id));

  return (
    <div className="intelligence-workspace" id="intelligence-workspace">
      {/* Operation Mode Bar */}
      <Suspense fallback={<PanelLoader />}>
        <OperationModes />
      </Suspense>

      {/* Scan Layers */}
      <Suspense fallback={<PanelLoader />}>
        <ScanLayers />
      </Suspense>

      {/* X-Ray Overlay Controls */}
      <Suspense fallback={<PanelLoader />}>
        <XRayOverlay />
      </Suspense>

      {/* Mission Control (collapsible) */}
      {activePanels.has('mission-control') && (
        <Suspense fallback={<PanelLoader />}>
          <MissionControl />
        </Suspense>
      )}

      {/* Blackbox Mode (when active) */}
      <Suspense fallback={<PanelLoader />}>
        <BlackboxMode />
      </Suspense>

      {/* Intelligence Panels Grid */}
      {visiblePanels.length > 0 && (
        <div className="intel-panels-grid">
          {visiblePanels.map(([id, config]) => {
            const PanelComponent = config.component;
            return (
              <div key={id} className="intel-panel-wrapper" data-panel-id={id}>
                <Suspense fallback={<PanelLoader />}>
                  <PanelComponent />
                </Suspense>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Export */}
      <Suspense fallback={<PanelLoader />}>
        <ReportExport />
      </Suspense>
    </div>
  );
};

// ── Main Dashboard
const Dashboard: React.FC = () => {
  const [splashDone, setSplashDone] = useState(false);
  const { triggerScan } = useScan();


  return (
    <>
      {/* Splash screen */}
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      {/* Main layout */}
      <div className="flex flex-col min-h-screen" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Sticky header */}
        <Header />

        {/* Scanner control zone */}
        <Scanner onTriggerScan={triggerScan} />

        {/* Workspace — source + right panels */}
        <main
          className="workspace flex-1 flex min-h-0 overflow-hidden"
          style={{ flex: '1 1 0%', display: 'flex', minHeight: 0, overflow: 'hidden' }}
        >
          {/* Source code panel */}
          <SourcePanel />

          {/* Right side panels */}
          <div
            className="flex"
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {/* Vulnerability findings */}
            <VulnerabilityPanel />

            {/* Tech stack */}
            <TechStackPanel />

            {/* AI detection */}
            <AIDetectionPanel />
          </div>
        </main>

        {/* ═══ Intelligence Workspace (NEW — appended below existing workspace) ═══ */}
        <IntelligenceWorkspace />

        {/* Footer ticker */}
        <Footer />
      </div>

      {/* Floating preview window */}
      <PreviewFloat />

      {/* All modals (Copy, Paste, History, AI Analysis) */}
      <Modals />

      {/* Toast notification */}
      <Toast />

      {/* Scroll-to-top */}
      <ScrollTopBtn />

      {/* ═══ Floating AI Assistant (NEW) ═══ */}
      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>
    </>
  );
};

export default Dashboard;
