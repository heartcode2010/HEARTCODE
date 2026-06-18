import { SecretFinding } from '../types';

export const secretScanner = {
  getSeverityColor(severity: 'Critical' | 'High' | 'Medium'): string {
    switch (severity) {
      case 'Critical': return '#ff0055';
      case 'High': return '#ff7700';
      case 'Medium': return '#ffcc00';
      default: return '#00ffcc';
    }
  },

  getStats(findings: SecretFinding[]) {
    return {
      criticalCount: findings.filter(f => f.severity === 'Critical').length,
      highCount: findings.filter(f => f.severity === 'High').length,
      mediumCount: findings.filter(f => f.severity === 'Medium').length,
    };
  }
};

export default secretScanner;
