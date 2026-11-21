# TECHNOVA OS — Unified Architecture & Delivery Plan

Status: Proposed architecture baseline
Repository: heartcode2010/HEARTCODE
Strategy: Modular monolith with independently bounded Verses and shared platform services.

## 1. Product architecture

TECHNOVA OS is one product, one account system, one primary workspace and six first-class Verses:

- CyberVerse — existing vulnerability scanner and Cyber Academy.
- BlockchainVerse — Web3 academy, Solidity practice workspace and trading simulator.
- Nexora — AI creator studio, brand builder and studio/rental workflows.
- TechVerse — developer academy and career pathways.
- EduVerse — WAEC/JAMB CBT, notes, flashcards and school learning.
- TechLabs — isolated code playground, preview, export and deployment workflows.

QuizVerse is a cross-platform assessment product. It should be usable from EduVerse, TechVerse, CyberVerse and by independent quiz creators, rather than being buried inside only one Verse.

Shared platform capabilities:
- Identity, sessions, profiles, roles and permissions.
- Organisations, memberships, invitations and tenant-scoped data.
- Wallet ledger, payment orchestration, AI credit ledger and entitlements.
- Affiliate attribution, commissions, withdrawal requests and fraud review.
- Notifications, audit trail, file/document processing and AI provider routing.
- Admin control centre, reporting and feature/plan configuration.

## 2. Architecture shape

Start as a modular monolith. Keep one frontend and one API deployment while enforcing module ownership in code and data.

Frontend:
- React + TypeScript + Vite.
- React Router route groups: /workspace, /cyberverse, /blockchainverse, /nexora, /techverse, /eduverse, /techlabs, /quizverse, /marketplace, /affiliate, /wallet, /admin.
- Shared app shell, navigation, identity and notification surfaces.
- Verse-specific layouts and design systems; do not force one visual theme onto every Verse.
- TanStack Query for server state; Zustand only for client/session state and small local workflows.
- Feature flags and entitlement checks must be reflected in the UI, but never replace server-side authorization.

Backend:
- Express + TypeScript, MongoDB/Mongoose initially.
- Version new APIs under /api/v1/platform, /api/v1/verses/*, /api/v1/quizverse, /api/v1/commerce, /api/v1/affiliate and /api/v1/admin.
- Keep existing scanner and Academy endpoints stable during migration. Do not move, rename or proxy scanner endpoints as part of the initial OS shell.
- Each module owns routes/controllers, application services, schemas/repositories, validators and tests.
- Shared kernel owns identity, authorization, tenant context, audit, payments, ledger, entitlements, notifications, file storage and AI provider adapters.
- Use background jobs for document ingestion, quiz generation, video/creator workloads, reports, email and webhook retries. Do not hold long jobs inside normal HTTP requests.

Suggested backend structure (additive; adapt to current repo):
backend/src/
  platform/{identity,authorization,organizations,audit,notifications,files,ai,commerce,ledger,entitlements}/
  modules/{cyberverse,blockchainverse,nexora,techverse,eduverse,techlabs,quizverse,affiliate,marketplace,admin}/
  shared/{config,db,http,queue,observability,security}/
Existing scanner and Academy folders remain where they are until a separately reviewed migration is approved.

## 3. Scanner protection contract — non-negotiable

The existing vulnerability scanner is a protected product boundary. This plan does not authorize edits to its code, styles, colors, layout, scanning engine, modules, routes, response formats or behavior.

Protected area includes at minimum:
- frontend scanner-facing components, panels, hooks, scan stores, scan services, scan visualizers and scanner styling.
- backend scan controllers/routes/services, ScannerEngine, scanner modules, reporting/risk scoring and scan models.
- existing scanner API contracts and persisted scan/report data.

Before any future integration:
1. Capture a baseline of protected paths, route definitions, API request/response fixtures and representative scan outputs.
2. Add regression tests/contract fixtures around existing scanner behavior without changing the scanner implementation.
3. Keep new OS navigation and shared services outside the scanner surface.
4. Do not import new global styles into scanner components or alter shared CSS variables that affect the scanner.
5. Reject changes touching protected paths in the OS workstream unless the owner explicitly authorizes a separate scanner task.
6. Run scanner regression checks after every OS integration deployment.

The Cyber Academy remains a flagship CyberVerse product and should receive its own product-quality learning experience, with practical paths, scenario exercises, feedback, progress, instructor/institution tools and honest AI capability indicators.

## 4. Identity, organisations and permissions

Extend the existing user identity additively; do not break current login or JWT consumers.

Core concepts:
- User: profile, status, preferences and security settings.
- Organization: school, business, training centre or creator team.
- Membership: user, organization, role, status and scoped permissions.
- Role/permission: learner, instructor, creator, organization_admin, support, finance_admin, platform_admin.
- Entitlement: product/feature access granted by plan, purchase, institution or promotion.

Every organisation-owned record must carry an organizationId and enforce membership/role checks server-side. Never trust a client-supplied userId, role, price, commission or balance.

## 5. Money, wallet, payments and AI credits

Use an immutable, auditable ledger. A displayed balance is a derived view, not a mutable number that can be arbitrarily overwritten.

Core records:
- PaymentIntent / PaymentTransaction: provider, reference, amount, currency, status, user, purpose and verified timestamps.
- WebhookEvent: provider event ID, signature verification result, processing status and idempotency key.
- LedgerAccount and LedgerEntry: debit/credit postings, currency, source transaction and immutable references.
- Wallet balance projection: derived from ledger entries.
- AICreditAccount and AICreditEntry: grants, purchases, usage, expiry/refund adjustments and idempotency.
- Product, Price, Subscription and Entitlement.

Payment rules:
- Integrate provider adapters for Paystack and Flutterwave first for Nigerian use cases; add Stripe for international availability. OPay should only be offered through a supported provider/approved integration, not represented as a direct integration until verified.
- Verify webhook signatures and independently verify transaction status with the provider before crediting.
- Enforce unique provider transaction/event references and idempotent webhook processing.
- Never trust browser redirects as proof of payment.
- Handle pending, success, failure, reversal, refund and chargeback states.
- Reconcile provider settlements against the internal ledger.
- Keep secret keys server-side and separate sandbox from production credentials.

AI credits:
- Admin-configurable packages and service costs.
- Reserve/deduct credits atomically before or at job acceptance; settle actual usage and release unused reservations.
- Log model/provider, task, usage, cost estimate, final charge and outcome.
- Fail safely when provider keys, quotas or services are unavailable; clearly label fallback behavior.

## 6. Affiliate engine

Core records:
- ReferralCode and ReferralClick.
- ReferralAttribution: referred user, affiliate, capturedAt, attribution source and status.
- CommissionRule: eligible product types, rate, effective dates and admin actor.
- Commission: source payment, net eligible amount, rate, amount, currency and status.
- WithdrawalRequest and FraudCase.

Rules:
- Create a referral code/link for every eligible account.
- Bind attribution at registration under a documented attribution policy; keep it immutable except for audited administrator correction.
- Block self-referrals and flag duplicate identity/payment patterns.
- Generate commissions only from verified, settled, eligible net payments.
- Use a unique source-payment constraint so retries cannot pay commissions twice.
- Reverse or adjust commissions on refunds/chargebacks.
- Keep pending, available, paid, reversed and disputed amounts distinct.
- Enforce minimum withdrawal, KYC/identity checks where required, admin review and payout reconciliation.
- Configurable 20% default is a business rule, not a hard-coded promise; admins control rates and eligible categories.

## 7. QuizVerse

QuizVerse is a shared assessment service with creator and institution workspaces.

Capabilities:
- Quiz, QuizVersion, Question, QuestionBank, Attempt, Answer, Rubric, Assignment, LiveSession, Leaderboard, Review and Certificate.
- Question types: multiple choice, true/false, fill blank, essay, code, image, video, audio and drag/drop.
- Version published quizzes so edits do not corrupt existing attempts or reports.
- Support free, paid, subscription and institution-only access modes.
- AI generation pipeline: upload -> secure file validation -> extraction/OCR -> chunking -> draft questions -> human review -> publish.
- Support PDF, DOCX, PPTX, text and permitted web content after validating parser and copyright/usage constraints.
- Timed attempts, autosave, server-authoritative scoring, essay rubrics, accessibility and accommodations.
- Live events require server-authoritative timers and scoring; do not trust client clocks.
- School tools: private exams, assignments, performance reports and CSV exports.
- Marketplace ratings/reviews must be tied to verified purchases or attempts where appropriate.

## 8. Verse-specific delivery boundaries

CyberVerse:
- Preserve scanner unchanged.
- Improve Cyber Academy independently.
- New security learning tools must use safe, intentionally vulnerable training targets and isolated sandboxes.

BlockchainVerse:
- Start with learning content and simulated ledger/trading.
- Solidity workspace must compile/test in an isolated sandbox.
- Do not connect real wallets or deploy real contracts in the first release.

Nexora:
- Begin with AI Director and brand guideline generation.
- Treat rentals/studios as inventory + booking + payment workflows.
- Copyright Hunter must use lawful, permitted sources and present matches as leads, not definitive legal conclusions.

TechVerse:
- Structured programming paths, projects, assessment, portfolio and milestones.
- Reuse QuizVerse assessment and platform entitlements.

EduVerse:
- CBT question banks, exam simulation, notes and flashcards.
- Establish source provenance, review workflows and subject/topic metadata.
- Do not claim official WAEC/JAMB affiliation unless authorized.

TechLabs:
- Run user code in disposable, isolated environments with CPU/memory/time/network limits.
- Never execute arbitrary submitted code in the API process.
- Preview domains, storage and deployment tokens must be isolated and short-lived.
- Start with HTML/CSS/JS static previews; expand runtimes only after sandbox security review.

## 9. Security and anti-abuse

- Deny by default for private APIs; enforce object-level and organization-level authorization.
- Validate inputs with schemas, rate-limit by identity/IP/route and apply upload size/type limits.
- Use secure headers, restrictive CORS allowlists, CSRF strategy where cookie auth is used, secure refresh-token rotation and session revocation.
- Store passwords with modern password hashing; keep secrets in deployment secret storage.
- Audit admin, financial, permission and attribution changes.
- Bot defenses should rate-limit, challenge or block abusive traffic; do not return fabricated API results that look like successful business data.
- Protect source maps, secrets, private files and internal routes at the deployment boundary.
- Add dependency scanning, secret scanning, backups, restore drills and incident procedures.

## 10. Delivery sequence and acceptance gates

Phase 0 — Baseline and safety:
- Map current routes, schemas, deployments and environment variables without exposing secret values.
- Freeze scanner paths and capture scanner contract fixtures.
- Add architecture decision records and a feature inventory.
Acceptance: existing scanner build and representative scan contracts unchanged.

Phase 1 — Unified OS shell:
- TECHNOVA naming/brand transition outside the scanner.
- Unified workspace dashboard, Verse navigation, responsive app shell and route-level feature flags.
- Keep current sign-in and Academy entry working.
Acceptance: users can enter each enabled Verse; disabled sectors are honestly marked as coming soon, not fake tools.

Phase 2 — Platform foundation:
- Identity/roles, organizations/memberships, audit, notifications, file service, AI provider router and entitlement checks.
Acceptance: tenant isolation and permission tests pass.

Phase 3 — Commerce foundation:
- Provider sandbox integration, verified webhooks, immutable ledger, wallet, AI credit packages and admin pricing.
Acceptance: idempotency, refund, reversal and reconciliation tests pass in sandbox.

Phase 4 — Affiliate:
- Referral capture, lifetime attribution, commission rules, fraud review, withdrawals and reports.
Acceptance: self-referral, duplicate callback, refund and chargeback scenarios are covered.

Phase 5 — QuizVerse + EduVerse:
- Quiz authoring, question bank, AI draft generation with human review, CBT and institution reporting.
Acceptance: timed attempts, scoring, privacy and exports pass end-to-end tests.

Phase 6 — TechVerse + TechLabs + BlockchainVerse:
- Learning paths, isolated coding environments and Web3 simulation.
Acceptance: sandbox escape tests and resource limits pass before public code execution.

Phase 7 — Nexora + marketplace:
- Creator tools, listings, bookings, copyright leads and creator payouts.
Acceptance: licensing, consent, inventory, refund and payout flows are tested.

Phase 8 — Scale and launch:
- Load tests, observability, backup/restore, security review, accessibility, mobile QA, support operations and launch readiness.
Acceptance: no critical/high unresolved security findings; documented rollback and incident response.

## 11. Engineering rules

- No fake metrics, fabricated threat feeds, fake payment states or unverified AI outputs.
- Every visible action must have a working backend or be clearly labelled as a prototype.
- Use migrations/backfills for schema changes; avoid destructive changes to existing user/scan data.
- Write unit, integration, API contract and browser end-to-end tests for each phase.
- Feature-flag unfinished modules and release progressively.
- Keep scanner changes out of scope and separately reviewed.
- Do not expose credentials in source, logs, screenshots or client bundles.

## 12. Immediate next engineering tasks

1. Create a scanner-protection baseline and CI path guard before adding OS navigation.
2. Inventory all existing route contracts and auth behavior; fix platform-wide auth/CORS defaults only in separately tested platform code, not scanner code.
3. Design the additive user/organization/permission schema.
4. Build the unified workspace shell with six Verse entry points and clear availability states.
5. Implement shared entitlements and audit trail before paid feature gating.
6. Implement payment ledger and webhook verification before affiliate commissions or AI credit sales.
7. Ship QuizVerse as a reusable assessment service, then connect EduVerse and the Cyber Academy.
