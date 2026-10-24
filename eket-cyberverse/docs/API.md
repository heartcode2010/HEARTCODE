# Eket Cyberverse - API Documentation

Base URL: `/api/v1`

## Authentication & Identity
* `POST /api/v1/auth/login` - Authenticate and obtain JWT token
* `POST /api/v1/auth/register` - Create user within an organization
* `GET /api/v1/auth/me` - Get current authenticated user and organization context

## Assets & Inventory
* `GET /api/v1/assets` - List digital assets (websites, servers, runtimes, domains)
* `POST /api/v1/assets` - Register a new digital asset with ownership & environment
* `GET /api/v1/assets/:id` - Detailed asset profile with evidence history
* `DELETE /api/v1/assets/:id` - Remove asset

## Global Vulnerability Intelligence & Advisories
* `GET /api/v1/advisories` - Ingested CVEs and vendor advisories (PHP, OpenSSL, Apache, Nginx, CISA KEV)
* `POST /api/v1/advisories/sync` - Trigger authoritative upstream sync

## PHP Runtime Security
* `GET /api/v1/php-security/inventory` - Active PHP runtime installations across servers
* `POST /api/v1/php-security/evaluate` - Evaluate PHP version against known vulnerabilities and support EOL status

## TLS Trust Guardian
* `GET /api/v1/tls/certificates` - Monitored TLS certificates, expiration status, chains, and trust health
* `POST /api/v1/tls/inspect` - Perform live certificate inspection for an endpoint

## Risk Prioritization & Findings
* `GET /api/v1/findings` - Prioritized findings with explainable risk scores
* `GET /api/v1/findings/:id` - Finding detail with evidence provenance and timeline

## Verified Remediation Engine
* `GET /api/v1/remediation/tasks` - Remediation lifecycle tasks
* `POST /api/v1/remediation/tasks` - Create remediation task from finding
* `POST /api/v1/remediation/tasks/:id/approve` - Approve remediation plan (requires authorization)
* `POST /api/v1/remediation/tasks/:id/verify` - Submit evidence and verify resolution (enforces proof requirement)

## Security Change Rehearsal
* `POST /api/v1/rehearsal/plan` - Generate pre-flight impact assessment, compatibility check, and rollback plan

## Incident Management
* `GET /api/v1/incidents` - Incident records with timeline and containment status
* `POST /api/v1/incidents` - File new incident

## Backup & Recovery Assurance
* `GET /api/v1/backups` - Backup records, recovery objectives, and restore test history

## AI Security Copilot
* `POST /api/v1/copilot/query` - Contextual AI query with verifiable evidence citations

## Audit Trail & Security Reports
* `GET /api/v1/audit/events` - Immutable security event log
* `GET /api/v1/reports/posture` - Posture assessment report export
