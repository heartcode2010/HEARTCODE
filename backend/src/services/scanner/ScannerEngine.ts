import { ScannerModule, ScanTarget, VulnerabilityFinding, SecurityReport } from './types';
import { RiskScorer } from './reporting/RiskScorer';
import { ReportGenerator } from './reporting/ReportGenerator';

export class ScannerEngine {
  private modules: ScannerModule[] = [];

  registerModule(module: ScannerModule) {
    this.modules.push(module);
  }

  async runScan(target: ScanTarget): Promise<SecurityReport> {
    const allFindings: VulnerabilityFinding[] = [];

    // Run all modules concurrently
    const results = await Promise.allSettled(
      this.modules.map((module) => module.scan(target))
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allFindings.push(...result.value);
      } else {
        console.error(`ScannerModule ${this.modules[index].moduleName} failed:`, result.reason);
      }
    });

    const scorer = new RiskScorer();
    const { overallScore, riskBreakdown } = scorer.calculate(allFindings);

    const report: SecurityReport = {
      targetUrl: target.url,
      scanDate: new Date(),
      overallScore,
      riskBreakdown,
      findings: allFindings,
    };

    return report;
  }
}
