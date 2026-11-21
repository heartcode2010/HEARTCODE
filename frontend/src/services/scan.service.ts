/**
 * scan.service.ts
 * Typed API wrappers for the /api/scans/* endpoints.
 */
import api from './api';
import type { Scan, VulnerabilityFinding, AIAnalysisResult, TechStackFinding } from '../types';

export interface InspectPayload {
  url: string;
}

export interface InspectResponse {
  success: boolean;
  scan: Scan;
}

export interface VulnerabilityResponse {
  success: boolean;
  findings: VulnerabilityFinding[];
}

export interface AIDetectResponse {
  success: boolean;
  aiAnalysis: AIAnalysisResult;
}

export interface TechStackResponse {
  success: boolean;
  techStack: TechStackFinding[];
}

export interface HistoryItem {
  id: string;
  url: string;
  createdAt: string;
  findingsCount: number;
}

const scanService = {
  /** Fetch and store the HTML source for a target URL */
  async inspect(payload: InspectPayload): Promise<InspectResponse> {
    const res = await api.post<InspectResponse>('/scans/inspect', payload);
    return res.data;
  },

  /** Run vulnerability analysis on a stored scan */
  async runVulnerability(scanId: string): Promise<VulnerabilityResponse> {
    const res = await api.post<VulnerabilityResponse>('/scans/vulnerability', { scanId });
    return res.data;
  },

  /** Run AI content-detection on a stored scan */
  async runAIDetect(scanId: string): Promise<AIDetectResponse> {
    const res = await api.post<AIDetectResponse>('/scans/ai-detect', { scanId });
    return res.data;
  },

  /** Run tech-stack fingerprinting on a stored scan */
  async runTechStack(scanId: string): Promise<TechStackResponse> {
    const res = await api.post<TechStackResponse>('/scans/tech-stack', { scanId });
    return res.data;
  },

  /** Retrieve the authenticated user's scan history */
  async getHistory(): Promise<HistoryItem[]> {
    const res = await api.get<{ success: boolean; scans: HistoryItem[] }>('/scans/history');
    return res.data.scans;
  },

  /** Delete a scan by ID */
  async deleteScan(scanId: string): Promise<void> {
    await api.delete(`/scans/${scanId}`);
  },
};

export default scanService;
