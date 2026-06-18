import { create } from 'zustand';
import type {
  OperationMode,
  ScanPhase,
  InfrastructureMap,
  WebsiteDNAProfile,
  NetworkRequest,
  MemorySnapshot,
  DiscoveredEndpoint,
  SecretFinding,
  BehavioralProfile,
  AIForensicsResult,
  DOMSurveillanceResult,
  ObfuscationResult,
  ShadowAsset,
  SecurityIntelResult,
  ExecutionTraceResult,
  TimelineEvent,
  ReputationScores,
  ThreatRadarData,
  DesignSystemResult,
  MissionTelemetry,
  CodeClassification,
} from '../types';

// ══════════════════════════════════════════════════════════════════════════════
// Intelligence OS Store — manages all new cyber-intelligence state
// Completely independent from the existing scanStore
// ══════════════════════════════════════════════════════════════════════════════

interface IntelligenceState {
  // ── Operation Mode ──
  operationMode: OperationMode;
  scanPhase: ScanPhase;
  activePanels: Set<string>;
  isIntelligenceActive: boolean;

  // ── Mission Control ──
  telemetry: MissionTelemetry;

  // ── Analysis Results ──
  infrastructureMap: InfrastructureMap | null;
  dnaProfile: WebsiteDNAProfile | null;
  networkLog: NetworkRequest[];
  memorySnapshot: MemorySnapshot | null;
  endpoints: DiscoveredEndpoint[];
  secretFindings: SecretFinding[];
  behavioralProfile: BehavioralProfile | null;
  aiForensics: AIForensicsResult | null;
  codeClassifications: CodeClassification[];
  domSurveillance: DOMSurveillanceResult | null;
  obfuscation: ObfuscationResult | null;
  shadowAssets: ShadowAsset[];
  securityIntel: SecurityIntelResult | null;
  executionTrace: ExecutionTraceResult | null;
  timelineEvents: TimelineEvent[];
  reputationScores: ReputationScores | null;
  threatRadar: ThreatRadarData | null;
  designSystem: DesignSystemResult | null;

  // ── UI State ──
  isBlackboxMode: boolean;
  isXRayMode: boolean;
  blackboxStage: number;
  missionControlExpanded: boolean;

  // ── Mutators ──
  setOperationMode: (mode: OperationMode) => void;
  setScanPhase: (phase: ScanPhase) => void;
  togglePanel: (panelId: string) => void;
  setPanelOpen: (panelId: string, open: boolean) => void;
  setIntelligenceActive: (active: boolean) => void;

  // Mission
  updateTelemetry: (partial: Partial<MissionTelemetry>) => void;

  // Results
  setInfrastructureMap: (map: InfrastructureMap) => void;
  setDNAProfile: (profile: WebsiteDNAProfile) => void;
  addNetworkRequest: (req: NetworkRequest) => void;
  setNetworkLog: (log: NetworkRequest[]) => void;
  setMemorySnapshot: (snapshot: MemorySnapshot) => void;
  setEndpoints: (endpoints: DiscoveredEndpoint[]) => void;
  setSecretFindings: (findings: SecretFinding[]) => void;
  setBehavioralProfile: (profile: BehavioralProfile) => void;
  setAIForensics: (result: AIForensicsResult) => void;
  setCodeClassifications: (classifications: CodeClassification[]) => void;
  setDOMSurveillance: (result: DOMSurveillanceResult) => void;
  setObfuscation: (result: ObfuscationResult) => void;
  setShadowAssets: (assets: ShadowAsset[]) => void;
  setSecurityIntel: (result: SecurityIntelResult) => void;
  setExecutionTrace: (result: ExecutionTraceResult) => void;
  setTimelineEvents: (events: TimelineEvent[]) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  setReputationScores: (scores: ReputationScores) => void;
  setThreatRadar: (data: ThreatRadarData) => void;
  setDesignSystem: (result: DesignSystemResult) => void;

  // UI
  setBlackboxMode: (active: boolean) => void;
  setXRayMode: (active: boolean) => void;
  setBlackboxStage: (stage: number) => void;
  setMissionControlExpanded: (expanded: boolean) => void;

  // Reset
  clearIntelligence: () => void;
}

const DEFAULT_TELEMETRY: MissionTelemetry = {
  activeScans: 0,
  completedScans: 0,
  totalFindings: 0,
  criticalFindings: 0,
  scanProgress: 0,
  currentPhase: 'idle',
  uptime: 0,
  modulesLoaded: 19, // existing 12 + 7 new
};

const DEFAULT_PANELS = new Set([
  'mission-control',
  'dna-profile',
  'infrastructure',
  'threat-radar',
  'reputation',
]);

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  // ── Defaults ──
  operationMode: 'recon',
  scanPhase: 'idle',
  activePanels: new Set(DEFAULT_PANELS),
  isIntelligenceActive: false,

  telemetry: { ...DEFAULT_TELEMETRY },

  infrastructureMap: null,
  dnaProfile: null,
  networkLog: [],
  memorySnapshot: null,
  endpoints: [],
  secretFindings: [],
  behavioralProfile: null,
  aiForensics: null,
  codeClassifications: [],
  domSurveillance: null,
  obfuscation: null,
  shadowAssets: [],
  securityIntel: null,
  executionTrace: null,
  timelineEvents: [],
  reputationScores: null,
  threatRadar: null,
  designSystem: null,

  isBlackboxMode: false,
  isXRayMode: false,
  blackboxStage: 0,
  missionControlExpanded: true,

  // ── Mode & Phase ──
  setOperationMode: (mode) => {
    const panelMap: Record<OperationMode, string[]> = {
      'recon': ['mission-control', 'dna-profile', 'infrastructure', 'threat-radar', 'reputation', 'network-console', 'endpoints'],
      'stealth': ['network-console', 'memory-inspector', 'behavioral'],
      'ai-forensics': ['mission-control', 'ai-forensics', 'dna-profile', 'execution-trace'],
      'threat-hunt': ['mission-control', 'threat-radar', 'secret-leak', 'obfuscation', 'dom-surveillance', 'security-intel'],
      'deep-trace': ['mission-control', 'network-console', 'memory-inspector', 'timeline', 'execution-trace', 'shadow-assets'],
      'blackbox': ['mission-control'],
    };
    set({
      operationMode: mode,
      activePanels: new Set(panelMap[mode] || DEFAULT_PANELS),
      isBlackboxMode: mode === 'blackbox',
    });
  },

  setScanPhase: (phase) => set({ scanPhase: phase }),

  togglePanel: (panelId) => {
    const panels = new Set(get().activePanels);
    if (panels.has(panelId)) panels.delete(panelId);
    else panels.add(panelId);
    set({ activePanels: panels });
  },

  setPanelOpen: (panelId, open) => {
    const panels = new Set(get().activePanels);
    if (open) panels.add(panelId);
    else panels.delete(panelId);
    set({ activePanels: panels });
  },

  setIntelligenceActive: (active) => set({ isIntelligenceActive: active }),

  // ── Telemetry ──
  updateTelemetry: (partial) => set((state) => ({
    telemetry: { ...state.telemetry, ...partial },
  })),

  // ── Result Setters ──
  setInfrastructureMap: (map) => set({ infrastructureMap: map }),
  setDNAProfile: (profile) => set({ dnaProfile: profile }),
  addNetworkRequest: (req) => set((state) => ({
    networkLog: [...state.networkLog.slice(-499), req], // cap at 500
  })),
  setNetworkLog: (log) => set({ networkLog: log }),
  setMemorySnapshot: (snapshot) => set({ memorySnapshot: snapshot }),
  setEndpoints: (endpoints) => set({ endpoints }),
  setSecretFindings: (findings) => set({ secretFindings: findings }),
  setBehavioralProfile: (profile) => set({ behavioralProfile: profile }),
  setAIForensics: (result) => set({ aiForensics: result }),
  setCodeClassifications: (classifications) => set({ codeClassifications: classifications }),
  setDOMSurveillance: (result) => set({ domSurveillance: result }),
  setObfuscation: (result) => set({ obfuscation: result }),
  setShadowAssets: (assets) => set({ shadowAssets: assets }),
  setSecurityIntel: (result) => set({ securityIntel: result }),
  setExecutionTrace: (result) => set({ executionTrace: result }),
  setTimelineEvents: (events) => set({ timelineEvents: events }),
  addTimelineEvent: (event) => set((state) => ({
    timelineEvents: [...state.timelineEvents, event].sort((a, b) => a.timestamp - b.timestamp),
  })),
  setReputationScores: (scores) => set({ reputationScores: scores }),
  setThreatRadar: (data) => set({ threatRadar: data }),
  setDesignSystem: (result) => set({ designSystem: result }),

  // ── UI ──
  setBlackboxMode: (active) => set({ isBlackboxMode: active }),
  setXRayMode: (active) => set({ isXRayMode: active }),
  setBlackboxStage: (stage) => set({ blackboxStage: stage }),
  setMissionControlExpanded: (expanded) => set({ missionControlExpanded: expanded }),

  // ── Reset ──
  clearIntelligence: () => set({
    scanPhase: 'idle',
    isIntelligenceActive: false,
    telemetry: { ...DEFAULT_TELEMETRY },
    infrastructureMap: null,
    dnaProfile: null,
    networkLog: [],
    memorySnapshot: null,
    endpoints: [],
    secretFindings: [],
    behavioralProfile: null,
    aiForensics: null,
    codeClassifications: [],
    domSurveillance: null,
    obfuscation: null,
    shadowAssets: [],
    securityIntel: null,
    executionTrace: null,
    timelineEvents: [],
    reputationScores: null,
    threatRadar: null,
    designSystem: null,
    isBlackboxMode: false,
    isXRayMode: false,
    blackboxStage: 0,
  }),
}));

export default useIntelligenceStore;
