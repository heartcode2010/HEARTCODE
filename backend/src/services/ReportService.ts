/**
 * backend/src/services/ReportService.ts
 * Generates human-readable vulnerability reports in different formats.
 */
import Report from '../models/Report';
import Scan from '../models/Scan';
import Vulnerability from '../models/Vulnerability';
import AIAnalysis from '../models/AIAnalysis';

class ReportService {
  /**
   * Generate a structured JSON report for a scan.
   * Aggregates: scan metadata, vulnerability findings, and AI analysis.
   */
  async generate(scanId: string, userId: string, format: 'json' | 'html' | 'pdf' = 'json') {
    const scan = await Scan.findById(scanId);
    if (!scan) throw new Error('Scan not found');

    const findings = await Vulnerability.find({ scanId }).sort({ createdAt: -1 });
    const aiAnalysis = await AIAnalysis.findOne({ scanId });

    const reportData = {
      generatedAt: new Date().toISOString(),
      scan: {
        id: scan._id,
        url: scan.url,
        size: scan.size,
        lines: scan.lines,
        createdAt: scan.createdAt,
      },
      summary: {
        totalFindings: findings.length,
        critical: findings.filter((f) => f.severity === 'Critical').length,
        high:     findings.filter((f) => f.severity === 'High').length,
        medium:   findings.filter((f) => f.severity === 'Medium').length,
        low:      findings.filter((f) => f.severity === 'Low').length,
        info:     findings.filter((f) => f.severity === 'Informational').length,
        aiScore:  aiAnalysis?.score ?? null,
      },
      findings,
      aiAnalysis: aiAnalysis ?? null,
    };

    // Persist report record to the database
    const report = await Report.create({
      scanId,
      userId,
      format,
      data: JSON.stringify(reportData),
    });

    return { report, reportData };
  }

  /** Retrieve all reports for a user */
  async listForUser(userId: string) {
    return Report.find({ userId }).sort({ createdAt: -1 }).select('-data');
  }

  /** Retrieve a single report's full data */
  async getOne(reportId: string) {
    const report = await Report.findById(reportId);
    if (!report) throw new Error('Report not found');
    return report;
  }

  /** Delete a report */
  async delete(reportId: string) {
    await Report.findByIdAndDelete(reportId);
  }
}

export default new ReportService();
