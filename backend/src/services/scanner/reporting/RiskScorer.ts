import { VulnerabilityFinding, SecurityReport } from '../types';

export class RiskScorer {
  calculate(findings: VulnerabilityFinding[]): { overallScore: number; riskBreakdown: SecurityReport['riskBreakdown'] } {
    const riskBreakdown = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      informational: 0,
    };

    findings.forEach((finding) => {
      const key = finding.severity.toLowerCase() as keyof typeof riskBreakdown;
      if (riskBreakdown[key] !== undefined) {
        riskBreakdown[key]++;
      }
    });

    // Simple scoring algorithm: Start with 100, deduct points based on severity
    let score = 100;
    score -= riskBreakdown.critical * 25;
    score -= riskBreakdown.high * 10;
    score -= riskBreakdown.medium * 5;
    score -= riskBreakdown.low * 2;
    // Informational does not deduct points

    overallScore: Math.max(0, score);

    return {
      overallScore: Math.max(0, score),
      riskBreakdown,
    };
  }
}
