/**
 * report.service.ts
 * Typed API wrappers for the /api/reports/* endpoints.
 */
import api from './api';

export interface Report {
  id: string;
  scanId: string;
  format: 'json' | 'pdf' | 'html';
  url: string;
  createdAt: string;
}

const reportService = {
  /** Generate and retrieve a report for a scan */
  async generate(scanId: string, format: 'json' | 'pdf' | 'html' = 'json'): Promise<Report> {
    const res = await api.post<{ success: boolean; report: Report }>('/reports/generate', {
      scanId,
      format,
    });
    return res.data.report;
  },

  /** List all reports for the authenticated user */
  async list(): Promise<Report[]> {
    const res = await api.get<{ success: boolean; reports: Report[] }>('/reports');
    return res.data.reports;
  },

  /** Delete a report by ID */
  async delete(reportId: string): Promise<void> {
    await api.delete(`/reports/${reportId}`);
  },
};

export default reportService;
