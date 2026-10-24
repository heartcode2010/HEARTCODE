// ── Domain Types for Eket Cyberverse ──────────────────────────────────────────

export type UserRole = 'admin' | 'security_engineer' | 'auditor' | 'operator';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: 'enterprise' | 'growth' | 'community';
  createdAt: string;
}

// ── Digital Asset Inventory ──
export type AssetType = 'website' | 'domain' | 'server' | 'runtime' | 'database' | 'container' | 'certificate';
export type Environment = 'production' | 'staging' | 'development' | 'dmz';
export type Criticality = 'critical' | 'high' | 'medium' | 'low';

export interface Asset {
  id: string;
  organizationId: string;
  name: string;
  assetType: AssetType;
  target: string; // e.g. https://api.cyberverse.org, 192.168.1.10
  environment: Environment;
  criticality: Criticality;
  owner: string;
  tags: string[];
  lastObservedAt: string;
  evidenceSource: string; // e.g., 'Agent 4.2', 'TLS Probe', 'Inventory Manifest'
  metadata: Record<string, any>;
  createdAt: string;
}

// ── Global Vulnerability Intelligence ──
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Advisory {
  id: string; // e.g., CVE-2024-4577
  title: string;
  vendor: string;
  product: string;
  affectedVersionRange: string;
  fixedVersion: string;
  severity: Severity;
  cvssScore: number;
  publishedAt: string;
  updatedAt: string;
  sourceUrl: string;
  provenance: string; // e.g., 'National Vulnerability Database (NVD)', 'PHP.net Security'
  isKnownExploited: boolean; // CISA KEV
  mitigation: string;
}

// ── PHP Runtime Security ──
export interface PhpInstallation {
  id: string;
  organizationId: string;
  assetId: string;
  serverHostname: string;
  version: string;
  sapi: 'fpm-fcgi' | 'cli' | 'apache2handler';
  supportStatus: 'active' | 'security-only' | 'end-of-life';
  eolDate: string;
  relevantAdvisories: string[];
  lastVerifiedAt: string;
  verificationProof: string;
}

// ── TLS Trust Guardian ──
export interface TlsCertificate {
  id: string;
  organizationId: string;
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isExpired: boolean;
  chainValid: boolean;
  hostnameMatches: boolean;
  sha256Fingerprint: string;
  keyStrength: string;
  trustStatus: 'trusted' | 'warning' | 'distrusted' | 'unverified';
}

// ── Findings & Explainable Risk ──
export type FindingStatus = 'new' | 'confirmed' | 'remediating' | 'verified_resolved' | 'risk_accepted';

export interface Finding {
  id: string;
  organizationId: string;
  assetId: string;
  assetName: string;
  title: string;
  category: 'PHP Runtime' | 'TLS Certificate' | 'Supply Chain' | 'Exposure' | 'Configuration';
  severity: Severity;
  riskScore: number; // 0-100 explainable score
  riskExplanation: string[];
  status: FindingStatus;
  advisoryId?: string;
  evidence: {
    observedAt: string;
    source: string;
    rawPayload: string;
    sha256: string;
  };
  remediationTaskId?: string;
  createdAt: string;
}

// ── Verified Remediation Engine ──
export type RemediationState =
  | 'NEW'
  | 'AWAITING_VALIDATION'
  | 'CONFIRMED'
  | 'REMEDIATION_REQUIRED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'AWAITING_VERIFICATION'
  | 'VERIFIED_RESOLVED'
  | 'VERIFICATION_FAILED'
  | 'CLOSED';

export interface RemediationTask {
  id: string;
  organizationId: string;
  findingId: string;
  title: string;
  state: RemediationState;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
  dueDate: string;
  remediationPlan: string;
  approvedBy?: string;
  approvedAt?: string;
  executionLogs: Array<{
    timestamp: string;
    actor: string;
    action: string;
    outputSummary: string;
  }>;
  verificationEvidence?: {
    verifiedAt: string;
    verifiedBy: string;
    method: 're-probe' | 'package-query' | 'cert-handshake' | 'hash-check';
    evidenceText: string;
    evidenceHash: string;
    verifiedTrue: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// ── Security Change Rehearsal ──
export interface RehearsalPlan {
  id: string;
  targetAsset: string;
  proposedAction: string; // e.g. "Upgrade PHP 8.1.2 to 8.3.12"
  compatibilityWarnings: string[];
  prerequisites: string[];
  backupVerified: boolean;
  rollbackPlan: string;
  estimatedDowntimeSeconds: number;
  readinessScore: number; // 0-100
}

// ── Incidents ──
export interface Incident {
  id: string;
  organizationId: string;
  title: string;
  severity: Severity;
  status: 'suspected' | 'investigating' | 'contained' | 'recovered' | 'closed';
  affectedAssetIds: string[];
  leadResponder: string;
  timeline: Array<{
    timestamp: string;
    event: string;
    recordedBy: string;
  }>;
  containmentActions: string[];
  createdAt: string;
}

// ── Backup Assurance ──
export interface BackupRecord {
  id: string;
  organizationId: string;
  assetName: string;
  targetResource: string;
  backupType: 'full-snapshot' | 'database-dump' | 'incremental';
  lastBackupAt: string;
  integrityVerified: boolean;
  rpoHours: number;
  rtoMinutes: number;
  lastRestoreDrillAt: string;
  restoreDrillResult: 'PASS' | 'FAIL' | 'UNTESTED';
}

// ── Security Policies ──
export interface SecurityPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  enforcement: 'mandatory' | 'advisory';
  activeViolationsCount: number;
  lastEvaluatedAt: string;
}

// ── Audit History ──
export interface AuditEvent {
  id: string;
  organizationId: string;
  timestamp: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  evidenceHash: string;
}
