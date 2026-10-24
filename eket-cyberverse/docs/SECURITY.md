# Eket Cyberverse - Security Architecture & Threat Model

## 1. Core Security Principles

1. **Evidence-Based Remediation:**
   No vulnerability or exposure status can transition to `VERIFIED_RESOLVED` without cryptographically stamped evidence or direct technical inspection proof.

2. **Least Privilege & Server-Side Enforcement:**
   Authorization checks are executed strictly on the backend API layer. UI hiding is strictly for ergonomics; every API route enforces Role-Based Access Control (`admin`, `security_engineer`, `auditor`, `operator`).

3. **Strict Tenant Segregation:**
   All queries to findings, assets, policies, and audit logs mandate `organizationId` scoping. Cross-tenant leakage is tested and prevented by default middleware.

4. **Deterministic Security Matching:**
   AI is never relied upon for fundamental vulnerability matching, version-range evaluation, or cryptographic checks. AI is utilized solely as an advisory copilot with transparent provenance and citations.

5. **Server-Side Secret Isolation:**
   API keys (Gemini, external advisory sources, DB credentials) remain exclusively on the server and are never exposed to browser clients.

6. **Immutable Audit History:**
   All security-sensitive operations (policy overrides, remediation verifications, certificate revocations, and user role modifications) append to an append-only audit trail with actor details, timestamps, and evidence hashes.
