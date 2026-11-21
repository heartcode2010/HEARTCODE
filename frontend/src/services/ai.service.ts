/**
 * ai.service.ts
 * Typed API wrappers for the /api/ai-detection/* endpoints.
 */
import api from './api';
import type { AIAnalysisResult } from '../types';

export interface DeepReportResponse {
  success: boolean;
  report: string;
}

const aiService = {
  /** Request a GPT-style deep analysis report for a scan */
  async getDeepReport(scanId: string): Promise<DeepReportResponse> {
    const res = await api.post<DeepReportResponse>('/ai-detection/deep-report', { scanId });
    return res.data;
  },

  /** Retrieve a previously generated AI analysis for a scan */
  async getAnalysis(scanId: string): Promise<AIAnalysisResult> {
    const res = await api.get<{ success: boolean; analysis: AIAnalysisResult }>(
      `/ai-detection/${scanId}`
    );
    return res.data.analysis;
  },
};

export default aiService;
