# Eket Cyberverse - Architectural Specification

**Brand Owner:** Heartcode Technologies  
**Tagline:** "From Security Intelligence to Verified Resilience."  
**Category:** Global Cybersecurity Intelligence, Exposure Management, Defensive Automation, and Digital Resilience Platform.

---

## 1. System Vision & The Verified Resilience Loop

Unlike superficial scanners that claim vulnerabilities exist without validating exposure or declare them fixed because someone clicked a button, **Eket Cyberverse** enforces the end-to-end Verified Resilience lifecycle:

```
[ DISCOVER ] 
    ↓
[ COLLECT EVIDENCE ] 
    ↓
[ IDENTIFY AFFECTED ASSETS ] 
    ↓
[ ASSESS EXPLAINABLE RISK ] 
    ↓
[ PRIORITISE ] 
    ↓
[ RECOMMEND REMEDIATION ] 
    ↓
[ OBTAIN AUTHORISATION ] 
    ↓
[ EXECUTE APPROVED ACTION ] 
    ↓
[ VERIFY THE RESULT ] (Evidence Required)
    ↓
[ MONITOR FOR RECURRENCE ] 
    ↓
[ DOCUMENT IN AUDIT TRAIL ]
```

### Core Differentiator: The Verified Remediation Engine
A finding in Eket Cyberverse is **never** marked `VERIFIED RESOLVED` without verifiable evidence. Supporting evidence includes:
* Direct observation re-checks (e.g. verified software version strings, hash checks, TLS certificate fingerprints).
* Cryptographic signature / checksum comparisons.
* Isolated integration verification checks.
* Immutable audit log records with actor, timestamp, and verification evidence payload.

---

## 2. Decoupled Monorepo Structure

```
eket-cyberverse/
├── apps/
│   ├── api/                      # Node.js + Express + TypeScript Core Backend
│   │   ├── src/
│   │   │   ├── modules/          # Domain services (Assets, Advisories, PHP, TLS, Risk, Remediation, etc.)
│   │   │   ├── database/         # Relational database models, migrations & seeds
│   │   │   ├── middleware/       # Auth guards, Tenant isolation, Security logging, Rate limiters
│   │   │   └── server.ts         # Bootstrapper
│   │   └── tests/                # Automated unit and integration tests
│   └── web/                      # React 19 + TypeScript + Vite + Tailwind CSS Frontend
│       ├── src/
│       │   ├── components/       # High-contrast accessible cyber-console components
│       │   ├── pages/            # 16 connected operational pages
│       │   ├── services/         # Typed API clients
│       │   └── store/            # State management
├── packages/
│   ├── shared-types/             # Unified TypeScript domain interfaces
│   ├── security-rules/           # PHP & vulnerability matching heuristics
│   └── validation/               # Zod validation schemas
├── docs/                         # Technical & security documentation
├── .env.example
└── package.json
```

---

## 3. Strict Multi-Tenant Isolation
Every asset, observation, finding, remediation task, certificate, and incident is keyed by an `organizationId`. Server-side middleware verifies and guarantees that cross-tenant access is impossible even if an adversary alters an identifier in an API call.
