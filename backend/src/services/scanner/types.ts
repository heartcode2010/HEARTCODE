export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
export type Confidence = 'Certain' | 'Firm' | 'Tentative';

export interface VulnerabilityFinding {
  id: string; // e.g. "SSL-001"
  category: string; // e.g. "SSL/TLS ANALYSIS"
  severity: Severity;
  confidence: Confidence;
  name: string;
  description: string;
  technicalExplanation: string;
  businessImpact: string;
  remediation: string;
  evidence: string;
  references?: string[];
}

export interface ScanTarget {
  url: string;
  html: string;
  headers?: Record<string, string>;
  ip?: string;
}

export interface ScannerModule {
  moduleName: string;
  category: string;
  scan(target: ScanTarget): Promise<VulnerabilityFinding[]>;
}

export interface SecurityReport {
  targetUrl: string;
  scanDate: Date;
  overallScore: number;
  riskBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
  findings: VulnerabilityFinding[];
}
