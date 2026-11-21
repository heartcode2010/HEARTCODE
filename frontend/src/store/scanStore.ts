import { create } from 'zustand';
import { Scan, VulnerabilityFinding, AIAnalysisResult, TechStackFinding, RiskBreakdown } from '../types';

interface ScanStoreState {
  url: string;
  scanId: string | null;
  htmlSource: string;
  activeView: 'raw' | 'highlighted' | 'stripped';
  status: 'idle' | 'working' | 'ok' | 'fail';
  statusLabel: string;
  
  // Stats Strip
  size: string;
  lines: number | null;
  tagsCount: number | null;
  scriptsCount: number | null;
  stylesCount: number | null;
  imagesCount: number | null;
  timestamp: string;

  // Findings list
  findings: VulnerabilityFinding[];
  aiAnalysis: AIAnalysisResult | null;
  techStack: TechStackFinding[];
  deepReport: string | null;
  overallScore: number | null;
  riskBreakdown: RiskBreakdown | null;

  // Modal / Preview Overlay states
  previewState: 'closed' | 'open' | 'minimized' | 'maximized';
  isHistoryOpen: boolean;
  isPasteOpen: boolean;
  isCopyOpen: boolean;
  isAiOpen: boolean;
  toast: { icon: string; msg: string; show: boolean } | null;

  // Mutators
  setUrl: (url: string) => void;
  setView: (view: 'raw' | 'highlighted' | 'stripped') => void;
  setStatus: (status: 'idle' | 'working' | 'ok' | 'fail', label: string) => void;
  setScanResult: (scan: Scan) => void;
  setFindings: (findings: VulnerabilityFinding[], aiAnalysis: AIAnalysisResult | null, overallScore?: number, riskBreakdown?: RiskBreakdown) => void;
  setTechStack: (techs: TechStackFinding[]) => void;
  setDeepReport: (report: string) => void;
  clearScan: () => void;
  
  // UI Mutators
  setPreviewState: (state: 'closed' | 'open' | 'minimized' | 'maximized') => void;
  setHistoryOpen: (open: boolean) => void;
  setPasteOpen: (open: boolean) => void;
  setCopyOpen: (open: boolean) => void;
  setAiOpen: (open: boolean) => void;
  showToast: (icon: string, msg: string) => void;
  hideToast: () => void;
}

export const useScanStore = create<ScanStoreState>((set) => ({
  url: '',
  scanId: null,
  htmlSource: '',
  activeView: 'highlighted',
  status: 'idle',
  statusLabel: 'Ready',

  size: '—',
  lines: null,
  tagsCount: null,
  scriptsCount: null,
  stylesCount: null,
  imagesCount: null,
  timestamp: '',

  findings: [],
  aiAnalysis: null,
  techStack: [],
  deepReport: null,
  overallScore: null,
  riskBreakdown: null,

  previewState: 'closed',
  isHistoryOpen: false,
  isPasteOpen: false,
  isCopyOpen: false,
  isAiOpen: false,
  toast: null,

  setUrl: (url) => set({ url }),
  setView: (activeView) => set({ activeView }),
  setStatus: (status, statusLabel) => set({ status, statusLabel }),
  
  setScanResult: (scan) => set({
    scanId: scan.id,
    url: scan.url,
    htmlSource: scan.htmlSource,
    size: scan.size,
    lines: scan.lines,
    tagsCount: scan.tagsCount,
    scriptsCount: scan.scriptsCount,
    stylesCount: scan.stylesCount,
    imagesCount: scan.imagesCount,
    timestamp: new Date().toLocaleTimeString(),
    findings: [], // Reset older analysis on inspect
    aiAnalysis: null,
    techStack: [],
    deepReport: null,
    overallScore: null,
    riskBreakdown: null,
  }),

  setFindings: (findings, aiAnalysis, overallScore, riskBreakdown) => set({ 
    findings, 
    aiAnalysis, 
    ...(overallScore !== undefined ? { overallScore } : {}), 
    ...(riskBreakdown !== undefined ? { riskBreakdown } : {}) 
  }),
  setTechStack: (techStack) => set({ techStack }),
  setDeepReport: (deepReport) => set({ deepReport }),

  clearScan: () => set({
    scanId: null,
    htmlSource: '',
    size: '—',
    lines: null,
    tagsCount: null,
    scriptsCount: null,
    stylesCount: null,
    imagesCount: null,
    timestamp: '',
    findings: [],
    aiAnalysis: null,
    techStack: [],
    deepReport: null,
    overallScore: null,
    riskBreakdown: null,
    previewState: 'closed',
  }),

  setPreviewState: (previewState) => set({ previewState }),
  setHistoryOpen: (isHistoryOpen) => set({ isHistoryOpen }),
  setPasteOpen: (isPasteOpen) => set({ isPasteOpen }),
  setCopyOpen: (isCopyOpen) => set({ isCopyOpen }),
  setAiOpen: (isAiOpen) => set({ isAiOpen }),

  showToast: (icon, msg) => {
    set({ toast: { icon, msg, show: true } });
  },
  hideToast: () => set((state) => ({
    toast: state.toast ? { ...state.toast, show: false } : null
  })),
}));

export default useScanStore;
