import crypto from 'crypto';
import {
  User,
  Organization,
  Asset,
  Advisory,
  PhpInstallation,
  TlsCertificate,
  Finding,
  RemediationTask,
  RehearsalPlan,
  Incident,
  BackupRecord,
  SecurityPolicy,
  AuditEvent,
} from '../types';

class CyberverseStore {
  public organizations: Organization[] = [
    {
      id: 'org-eket-1',
      name: 'Heartcode Technologies HQ',
      slug: 'heartcode-technologies',
      tier: 'enterprise',
      createdAt: '2026-01-15T08:00:00Z',
    },
    {
      id: 'org-isolated-2',
      name: 'Eket Public Infrastructure Corp',
      slug: 'eket-infrastructure',
      tier: 'enterprise',
      createdAt: '2026-02-10T11:30:00Z',
    },
  ];

  public users: User[] = [
    {
      id: 'usr-admin-1',
      email: 'admin@eket-cyberverse.org',
      fullName: 'Security Lead (Chief Operator)',
      role: 'admin',
      organizationId: 'org-eket-1',
      createdAt: '2026-01-15T08:05:00Z',
    },
    {
      id: 'usr-engineer-1',
      email: 'engineer@eket-cyberverse.org',
      fullName: 'DevSecOps Specialist',
      role: 'security_engineer',
      organizationId: 'org-eket-1',
      createdAt: '2026-01-20T09:15:00Z',
    },
    {
      id: 'usr-auditor-2',
      email: 'external-auditor@eket-corp.gov',
      fullName: 'External Regulatory Auditor',
      role: 'auditor',
      organizationId: 'org-isolated-2',
      createdAt: '2026-02-12T14:00:00Z',
    },
  ];

  public assets: Asset[] = [
    {
      id: 'ast-101',
      organizationId: 'org-eket-1',
      name: 'Production Core API Gateway',
      assetType: 'server',
      target: '196.220.14.88 (api.heartcode.internal)',
      environment: 'production',
      criticality: 'critical',
      owner: 'Platform Infrastructure Team',
      tags: ['nginx', 'php8.1', 'pci-dss', 'dmz'],
      lastObservedAt: '2026-10-24T12:00:00Z',
      evidenceSource: 'Authorized Telemetry Agent 4.8.1',
      metadata: { os: 'Ubuntu 22.04.4 LTS', kernel: '5.15.0-107-generic' },
      createdAt: '2026-01-18T10:00:00Z',
    },
    {
      id: 'ast-102',
      organizationId: 'org-eket-1',
      name: 'Public Enterprise Portal',
      assetType: 'website',
      target: 'https://sentinel.heartcode.tech',
      environment: 'production',
      criticality: 'high',
      owner: 'Web Operations',
      tags: ['tls1.3', 'cloudflare', 'frontend'],
      lastObservedAt: '2026-10-24T12:15:00Z',
      evidenceSource: 'External Surface Probe Probe-Eket-1',
      metadata: { serverHeader: 'cloudflare', httpVersion: 'h2' },
      createdAt: '2026-01-22T14:30:00Z',
    },
    {
      id: 'ast-103',
      organizationId: 'org-eket-1',
      name: 'Internal Legacy Billing Node',
      assetType: 'runtime',
      target: 'app-billing-prod-02',
      environment: 'production',
      criticality: 'critical',
      owner: 'Enterprise Financial Systems',
      tags: ['php7.4', 'legacy', 'isolated-vlan'],
      lastObservedAt: '2026-10-24T11:45:00Z',
      evidenceSource: 'Inventory Manifest SHA256:d8a2...3e',
      metadata: { runtime: 'php-fpm', phpVersion: '7.4.33' },
      createdAt: '2026-02-01T09:00:00Z',
    },
    {
      id: 'ast-201',
      organizationId: 'org-isolated-2',
      name: 'Municipal Telemetry Service',
      assetType: 'server',
      target: 'telemetry.eket.gov.ng',
      environment: 'production',
      criticality: 'critical',
      owner: 'Civil Infrastructure Systems',
      tags: ['scada', 'telemetry'],
      lastObservedAt: '2026-10-24T10:00:00Z',
      evidenceSource: 'GovNet Discovery Audit',
      metadata: { zone: 'Akwa-Ibom-East' },
      createdAt: '2026-02-15T12:00:00Z',
    },
  ];

  public advisories: Advisory[] = [
    {
      id: 'CVE-2024-4577',
      title: 'PHP CGI Argument Injection Remote Code Execution Vulnerability',
      vendor: 'PHP Group',
      product: 'PHP (Windows/Apache CGI deployment)',
      affectedVersionRange: '>= 8.1.0, < 8.1.29 || >= 8.2.0, < 8.2.20 || >= 8.3.0, < 8.3.8',
      fixedVersion: '8.1.29, 8.2.20, 8.3.8',
      severity: 'CRITICAL',
      cvssScore: 9.8,
      publishedAt: '2024-06-09T00:00:00Z',
      updatedAt: '2026-04-12T00:00:00Z',
      sourceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-4577',
      provenance: 'National Vulnerability Database (NVD) & CISA KEV Catalog',
      isKnownExploited: true,
      mitigation: 'Update to patched versions immediately. If running on legacy Windows/Apache, disable RewriteRule routing to php-cgi.',
    },
    {
      id: 'CVE-2024-5458',
      title: 'PHP filter_var URL Validation Bypass and Null Byte Truncation',
      vendor: 'PHP Group',
      product: 'PHP Core Filter Extension',
      affectedVersionRange: '>= 8.1.0, < 8.1.29 || >= 8.2.0, < 8.2.20 || >= 8.3.0, < 8.3.8',
      fixedVersion: '8.1.29, 8.2.20, 8.3.8',
      severity: 'HIGH',
      cvssScore: 7.5,
      publishedAt: '2024-06-12T00:00:00Z',
      updatedAt: '2026-01-08T00:00:00Z',
      sourceUrl: 'https://github.com/php/php-src/security/advisories/GHSA-9w8r-397f-prfh',
      provenance: 'PHP Security Advisory Team',
      isKnownExploited: false,
      mitigation: 'Apply updated PHP runtime packages with normalized null-byte filter sanitization.',
    },
    {
      id: 'CVE-2023-3824',
      title: 'PHP PHAR Buffer Underflow Memory Corruption in phar_dir_read()',
      vendor: 'PHP Group',
      product: 'PHP PHAR Extension',
      affectedVersionRange: '< 8.0.30 || >= 8.1.0, < 8.1.22 || >= 8.2.0, < 8.2.9',
      fixedVersion: '8.0.30, 8.1.22, 8.2.9',
      severity: 'CRITICAL',
      cvssScore: 9.8,
      publishedAt: '2023-08-04T00:00:00Z',
      updatedAt: '2025-11-20T00:00:00Z',
      sourceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2023-3824',
      provenance: 'NVD & Open Source Vulnerability Database',
      isKnownExploited: true,
      mitigation: 'Upgrade to fixed PHP patch levels and disable phar execution in php.ini where unnecessary.',
    },
    {
      id: 'CVE-2024-0001-TLS',
      title: 'Deprecation and Trust Revocation of Insecure Certificate Authority Root',
      vendor: 'Global Trust Baseline',
      product: 'X.509 Trust Store Baseline',
      affectedVersionRange: 'Legacy CA Root Certificates signed prior to 2016',
      fixedVersion: 'Trust Store 2026.2',
      severity: 'MEDIUM',
      cvssScore: 6.5,
      publishedAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-07-15T00:00:00Z',
      sourceUrl: 'https://trust.mozilla.org/advisories',
      provenance: 'Mozilla CA Certificate Program & CCADB',
      isKnownExploited: false,
      mitigation: 'Reissue leaf certificates via modern, authenticated ACME providers using ECDSA P-256 or RSA-4096.',
    },
  ];

  public phpInstallations: PhpInstallation[] = [
    {
      id: 'php-inst-01',
      organizationId: 'org-eket-1',
      assetId: 'ast-101',
      serverHostname: 'api.heartcode.internal',
      version: '8.1.18',
      sapi: 'fpm-fcgi',
      supportStatus: 'end-of-life',
      eolDate: '2025-12-31',
      relevantAdvisories: ['CVE-2024-4577', 'CVE-2024-5458', 'CVE-2023-3824'],
      lastVerifiedAt: '2026-10-24T12:00:00Z',
      verificationProof: 'Output of `php-fpm8.1 -v` recorded in agent telemetry hash: 7c4b...9a',
    },
    {
      id: 'php-inst-02',
      organizationId: 'org-eket-1',
      assetId: 'ast-103',
      serverHostname: 'app-billing-prod-02',
      version: '7.4.33',
      sapi: 'apache2handler',
      supportStatus: 'end-of-life',
      eolDate: '2022-11-28',
      relevantAdvisories: ['CVE-2023-3824'],
      lastVerifiedAt: '2026-10-24T11:45:00Z',
      verificationProof: 'Direct manifest audit of /etc/php/7.4/fpm/php.ini',
    },
  ];

  public tlsCertificates: TlsCertificate[] = [
    {
      id: 'cert-101',
      organizationId: 'org-eket-1',
      domain: 'sentinel.heartcode.tech',
      issuer: "Let's Encrypt Authority X3 (ISRG Root X1)",
      validFrom: '2026-08-15T00:00:00Z',
      validTo: '2026-11-13T23:59:59Z',
      daysRemaining: 20,
      isExpired: false,
      chainValid: true,
      hostnameMatches: true,
      sha256Fingerprint: '9B:4C:E2:81:AA:10:99:FF:33:14:55:67:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB',
      keyStrength: 'ECDSA 256-bit (prime256v1)',
      trustStatus: 'warning', // Expiring in 20 days
    },
    {
      id: 'cert-102',
      organizationId: 'org-eket-1',
      domain: 'api.heartcode.internal',
      issuer: 'Heartcode Internal Private Enterprise CA',
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2027-01-01T23:59:59Z',
      daysRemaining: 69,
      isExpired: false,
      chainValid: true,
      hostnameMatches: true,
      sha256Fingerprint: '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00',
      keyStrength: 'RSA 4096-bit',
      trustStatus: 'trusted',
    },
  ];

  public findings: Finding[] = [
    {
      id: 'fnd-101',
      organizationId: 'org-eket-1',
      assetId: 'ast-101',
      assetName: 'Production Core API Gateway',
      title: 'Critical PHP CGI Argument Injection RCE (CVE-2024-4577) on API Gateway',
      category: 'PHP Runtime',
      severity: 'CRITICAL',
      riskScore: 96,
      riskExplanation: [
        'Advisory is cataloged in CISA Known Exploited Vulnerabilities (Active in-the-wild weaponization)',
        'Host is internet-exposed on public edge port 443 with critical business classification',
        'Asset is running unpatched PHP 8.1.18 (Patched in 8.1.29+)',
      ],
      status: 'confirmed',
      advisoryId: 'CVE-2024-4577',
      evidence: {
        observedAt: '2026-10-24T12:00:00Z',
        source: 'Agent Telemetry inspection of libphp8.1.so symbol table',
        rawPayload: 'PHP 8.1.18 (fpm-fcgi) (built: Mar 14 2023 18:22:11) ZTS',
        sha256: crypto.createHash('sha256').update('PHP 8.1.18 on ast-101').digest('hex'),
      },
      remediationTaskId: 'rem-101',
      createdAt: '2026-10-24T12:05:00Z',
    },
    {
      id: 'fnd-102',
      organizationId: 'org-eket-1',
      assetId: 'ast-102',
      assetName: 'Public Enterprise Portal',
      title: 'TLS Certificate Approaching Expiration (< 30 Days)',
      category: 'TLS Certificate',
      severity: 'MEDIUM',
      riskScore: 54,
      riskExplanation: [
        'Certificate for sentinel.heartcode.tech expires in 20 days',
        'Automated ACME renewal token requires manual validation check',
        'Failure to rotate will trigger browser security warnings for all external users',
      ],
      status: 'new',
      evidence: {
        observedAt: '2026-10-24T12:15:00Z',
        source: 'Direct TLS Handshake Inspection to 104.21.72.18:443',
        rawPayload: 'ValidTo: 2026-11-13T23:59:59Z, Subject: CN=sentinel.heartcode.tech',
        sha256: crypto.createHash('sha256').update('Cert cert-101 expiring').digest('hex'),
      },
      createdAt: '2026-10-24T12:20:00Z',
    },
  ];

  public remediationTasks: RemediationTask[] = [
    {
      id: 'rem-101',
      organizationId: 'org-eket-1',
      findingId: 'fnd-101',
      title: 'Remediate CVE-2024-4577: Upgrade PHP 8.1.18 to Approved Release 8.3.12 LTS',
      state: 'AWAITING_VERIFICATION',
      priority: 'URGENT',
      assignedTo: 'engineer@eket-cyberverse.org',
      dueDate: '2026-10-26T18:00:00Z',
      remediationPlan:
        '1. Snapshot host VM volume.\n2. Update package repositories to Ondřej Surý PPA.\n3. Install php8.3-fpm, php8.3-cli, php8.3-mbstring.\n4. Re-bind Nginx fastcgi_pass to /run/php/php8.3-fpm.sock.\n5. Execute post-deployment test suite.',
      approvedBy: 'admin@eket-cyberverse.org',
      approvedAt: '2026-10-24T12:30:00Z',
      executionLogs: [
        {
          timestamp: '2026-10-24T13:00:00Z',
          actor: 'engineer@eket-cyberverse.org',
          action: 'Execution Attempt 1',
          outputSummary: 'Installed PHP 8.3.12 binaries. Updated systemd service configuration.',
        },
      ],
      createdAt: '2026-10-24T12:10:00Z',
      updatedAt: '2026-10-24T13:05:00Z',
    },
  ];

  public incidents: Incident[] = [
    {
      id: 'inc-01',
      organizationId: 'org-eket-1',
      title: 'Suspected Automated Exploitation Probing on Edge Gateway',
      severity: 'HIGH',
      status: 'investigating',
      affectedAssetIds: ['ast-101'],
      leadResponder: 'admin@eket-cyberverse.org',
      timeline: [
        {
          timestamp: '2026-10-24T10:14:00Z',
          event: 'WAF detected 142 requests attempting php-cgi argument injection string `%ADd+allow_url_include%3D1`',
          recordedBy: 'WAF Automated Sensor',
        },
        {
          timestamp: '2026-10-24T10:20:00Z',
          event: 'Emergency edge rule deployed dropping all %ADd sequences at Cloudflare perimeter.',
          recordedBy: 'admin@eket-cyberverse.org',
        },
      ],
      containmentActions: [
        'Deploy edge URI normalization drop rule (COMPLETED)',
        'Audit web server access logs for 200 OK responses to probe vectors (IN PROGRESS)',
        'Verify host integrity hash of php-cgi binary (COMPLETED - Unmodified)',
      ],
      createdAt: '2026-10-24T10:15:00Z',
    },
  ];

  public backups: BackupRecord[] = [
    {
      id: 'bk-01',
      organizationId: 'org-eket-1',
      assetName: 'Production Core API Gateway',
      targetResource: '/var/www & /etc/nginx & /etc/php',
      backupType: 'full-snapshot',
      lastBackupAt: '2026-10-24T03:00:00Z',
      integrityVerified: true,
      rpoHours: 24,
      rtoMinutes: 30,
      lastRestoreDrillAt: '2026-10-10T14:00:00Z',
      restoreDrillResult: 'PASS',
    },
    {
      id: 'bk-02',
      organizationId: 'org-eket-1',
      assetName: 'Internal Legacy Billing Node',
      targetResource: 'PostgreSQL Database & Billing Data Store',
      backupType: 'database-dump',
      lastBackupAt: '2026-10-24T00:00:00Z',
      integrityVerified: true,
      rpoHours: 4,
      rtoMinutes: 60,
      lastRestoreDrillAt: '2026-08-15T10:00:00Z',
      restoreDrillResult: 'PASS',
    },
  ];

  public policies: SecurityPolicy[] = [
    {
      id: 'pol-01',
      organizationId: 'org-eket-1',
      name: 'Mandatory Evidence Rule for Production Remediation',
      description: 'Findings marked verified resolved must contain cryptographically signed inspection proof.',
      enforcement: 'mandatory',
      activeViolationsCount: 0,
      lastEvaluatedAt: '2026-10-24T12:00:00Z',
    },
    {
      id: 'pol-02',
      organizationId: 'org-eket-1',
      name: 'End-of-Life Runtime Prohibition',
      description: 'No runtime with expired vendor security support may operate in production without an active exception.',
      enforcement: 'mandatory',
      activeViolationsCount: 2,
      lastEvaluatedAt: '2026-10-24T12:00:00Z',
    },
  ];

  public auditEvents: AuditEvent[] = [
    {
      id: 'aud-01',
      organizationId: 'org-eket-1',
      timestamp: '2026-10-24T12:10:00Z',
      actor: 'system:sentinel_engine',
      action: 'FINDING_CREATED',
      resourceType: 'Finding',
      resourceId: 'fnd-101',
      details: 'Evaluated asset ast-101 against Advisory CVE-2024-4577. Matched version 8.1.18.',
      evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'aud-02',
      organizationId: 'org-eket-1',
      timestamp: '2026-10-24T12:30:00Z',
      actor: 'admin@eket-cyberverse.org',
      action: 'REMEDIATION_APPROVED',
      resourceType: 'RemediationTask',
      resourceId: 'rem-101',
      details: 'Authorized PHP 8.3 upgrade plan for Production Core API Gateway.',
      evidenceHash: '8a9c2b1e4f...33',
    },
  ];

  // ── Tenant Scoped Methods ──
  public getAssets(orgId: string): Asset[] {
    return this.assets.filter((a) => a.organizationId === orgId);
  }

  public getFindings(orgId: string): Finding[] {
    return this.findings.filter((f) => f.organizationId === orgId);
  }

  public getRemediationTasks(orgId: string): RemediationTask[] {
    return this.remediationTasks.filter((r) => r.organizationId === orgId);
  }

  public getPhpInstallations(orgId: string): PhpInstallation[] {
    return this.phpInstallations.filter((p) => p.organizationId === orgId);
  }

  public getTlsCertificates(orgId: string): TlsCertificate[] {
    return this.tlsCertificates.filter((c) => c.organizationId === orgId);
  }

  public getIncidents(orgId: string): Incident[] {
    return this.incidents.filter((i) => i.organizationId === orgId);
  }

  public getBackups(orgId: string): BackupRecord[] {
    return this.backups.filter((b) => b.organizationId === orgId);
  }

  public getPolicies(orgId: string): SecurityPolicy[] {
    return this.policies.filter((p) => p.organizationId === orgId);
  }

  public getAuditEvents(orgId: string): AuditEvent[] {
    return this.auditEvents.filter((a) => a.organizationId === orgId);
  }

  public appendAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>) {
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };
    this.auditEvents.unshift(newEvent);
    return newEvent;
  }
}

export const db = new CyberverseStore();
export default db;
