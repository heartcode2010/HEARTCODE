import { SecurityReport } from '../types';

export class ReportGenerator {
  generateJson(report: SecurityReport): string {
    return JSON.stringify(report, null, 2);
  }

  // Placeholder for future PDF generation, likely using a library like pdfkit or puppeteer
  async generatePdf(report: SecurityReport): Promise<Buffer> {
    throw new Error('PDF generation not yet implemented');
  }
}
