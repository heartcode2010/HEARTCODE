# TECHNOVA OS — implementation status

This document distinguishes shipped code from integrations that still require credentials, deployment configuration or additional engineering. It is not a claim that every planned service is production-complete.

## Current repository baseline

- Unified workspace: `/os`
- Existing CyberVerse scanner: retained at `/`; scanner-facing protected paths are not part of this OS workstream.
- Cyber Academy: retained at `/academy`.
- Account-backed QuizVerse: `/quizverse`, backed by `/api/v1/platform/quizverse/*`.
- Device-local QuizVerse prototype: `/quizverse/local`.
- Verse previews: `/blockchainverse`, `/nexora`, `/techverse`, `/eduverse`, `/techlabs`.
- Wallet: `/wallet`, with Paystack initialization and server-side verification endpoints.
- Platform API: `/api/v1/platform`.

## Implemented in this workstream

### Unified workspace
- Six Verse entry points and a common TECHNOVA OS workspace.
- Live account overview counts for organisations, authored quizzes and submitted attempts.
- Separate visual styling for the OS shell and Verse previews; no TECHNOVA styles are added to the scanner's global stylesheet.

### Platform API foundation
- JWT-authenticated platform routes. Platform endpoints fail closed if `JWT_SECRET` is missing; they do not accept guest sessions.
- Organisation creation and account-scoped organisation listing.
- Quiz creation/listing, server-side answer scoring and account-scoped attempt history.
- Audit events for organisation creation, quiz creation, quiz attempts and wallet credits.

### QuizVerse
- Quizzes are stored in MongoDB and owned by the creating account.
- The server calculates scores; the browser does not submit its own score.
- Attempt history is stored per account.
- The first release supports multiple-choice questions. It does not yet provide question banks, essay/code grading, live sessions, marketplace publishing, institution roles or AI question generation.

### Verse previews
- BlockchainVerse: Solidity learning example; no real wallet or blockchain transactions.
- Nexora: structured brand-brief generator using local templates; not an AI image/design engine.
- TechVerse: learning path checkpoints saved in the current browser.
- EduVerse: original sample practice questions; not official WAEC/JAMB material.
- TechLabs: HTML/CSS/JavaScript editor, sandboxed iframe preview and HTML export. It is not a remote multi-language execution service.
- Verse preview progress is device-local, not yet synced across accounts.

### Wallet and payments
- Paystack checkout initialization for NGN wallet top-ups.
- Server-side Paystack transaction verification before crediting.
- Immutable wallet credit entries with a unique payment reference to prevent duplicate crediting.
- Wallet balance is calculated from ledger entries, not a browser-supplied amount.

Required server environment:
- `PAYSTACK_SECRET_KEY` — Paystack secret key; server-side only.
- `PAYSTACK_CALLBACK_URL` — full HTTPS callback URL, normally the deployed `/wallet` page.
- Existing `JWT_SECRET`, `JWT_REFRESH_SECRET` and `MONGODB_URI` must be set securely.

Do not put Paystack secret keys in frontend variables. The current wallet flow uses a return-to-wallet verification request; signed asynchronous webhook processing, refunds, chargebacks, settlement reconciliation and debit/withdrawal workflows are still outstanding. Until the Paystack key and callback URL are configured, checkout will report that Paystack is unavailable.

## Not yet production-enabled

- AI credit packages, metering, reservations and provider cost reconciliation.
- Affiliate referral capture, lifetime attribution, commission calculation, fraud review and withdrawals.
- Flutterwave and Stripe payment adapters.
- Paystack signed webhooks and refund/chargeback reconciliation.
- Organisation invitations, membership management, granular role/permission controls and institution administration.
- Quiz authoring question banks, exam imports, AI draft generation, timed server-authoritative sessions, live quizzes, marketplace and certificates.
- Full BlockchainVerse Solidity compile/test sandbox and simulated portfolio.
- Nexora AI Director, image generation, brand asset export, studio/rental booking and Copyright Hunter.
- Complete TechVerse course catalogue, assessments, portfolios and credential pathways.
- EduVerse full CBT banks, WAEC/JAMB-aligned content review, flashcards and school reporting.
- TechLabs remote isolated execution, project persistence, deployment and collaboration.
- Platform admin console, notifications, support workflows, analytics, backups and operational monitoring.

## Release gates

1. Run backend and frontend TypeScript builds and scanner-protection CI.
2. Configure production environment variables without exposing secrets.
3. Test account registration/login and the platform JWT against the deployed API.
4. Test organisation and QuizVerse persistence with separate accounts.
5. Run Paystack in test mode; verify successful, failed, pending and repeated verification flows.
6. Add signed webhook processing and financial reconciliation before broad public wallet launch.
7. Complete security review, tenant-isolation tests, accessibility and mobile QA before representing all Verses as production-ready.

## Scanner protection

The scanner remains an immutable boundary for this workstream. Changes to scanner-facing components, global scanner styles, scan stores/services and scanner API routes require separate explicit owner approval. The scanner-protection CI script is intended to reject accidental edits to its protected path list.
