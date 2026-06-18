/**
 * intelligence.service.ts
 * Typed API wrappers for the /api/intelligence/* endpoints.
 */
import api from './api';
import type {
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
} from '../types';

export interface IntelligenceAnalysisResult {
  scanId: string;
  infrastructureMap: InfrastructureMap;
  dnaProfile: WebsiteDNAProfile;
  networkLog: NetworkRequest[];
  memorySnapshot: MemorySnapshot;
  endpoints: DiscoveredEndpoint[];
  secretFindings: SecretFinding[];
  behavioralProfile: BehavioralProfile;
  aiForensics: AIForensicsResult;
  codeClassifications: any[];
  domSurveillance: DOMSurveillanceResult;
  obfuscation: ObfuscationResult;
  shadowAssets: ShadowAsset[];
  securityIntel: SecurityIntelResult;
  executionTrace: ExecutionTraceResult;
  timelineEvents: TimelineEvent[];
  reputationScores: ReputationScores;
  threatRadar: ThreatRadarData;
  designSystem: DesignSystemResult;
}

export interface IntelligenceFullScanResponse {
  success: boolean;
  analysis: IntelligenceAnalysisResult;
}

export interface TimelineEventsResponse {
  success: boolean;
  timelineEvents: TimelineEvent[];
}

export interface IntelligenceReportDetailsResponse {
  success: boolean;
  report: IntelligenceAnalysisResult;
}

const intelligenceService = {
  /** Trigger and retrieve full intelligence analysis for a scan */
  async runFullScan(scanId: string): Promise<IntelligenceFullScanResponse> {
    const res = await api.post<IntelligenceFullScanResponse>('/intelligence/full-scan', { scanId });
    return res.data;
  },

  /** Get timeline logs */
  async getTimeline(scanId: string): Promise<TimelineEvent[]> {
    const res = await api.get<TimelineEventsResponse>(`/intelligence/timeline/${scanId}`);
    return res.data.timelineEvents;
  },

  /** Get full report data */
  async getReport(scanId: string): Promise<IntelligenceAnalysisResult> {
    const res = await api.get<IntelligenceReportDetailsResponse>(`/intelligence/report/${scanId}`);
    return res.data.report;
  },
};

export default intelligenceService;
