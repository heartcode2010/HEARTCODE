# TECHNOVA OS — implementation status

This status sheet separates working code from simulations and integrations that still need configuration or engineering. A screen or button is not evidence that an external service is live.

## Unified entry point

- `/os` — TECHNOVA OS launch hub.
- `/` — existing CyberVerse vulnerability scanner. It remains the scanner's original route and was not modified by this work.
- `/academy` — existing Cyber Academy.

## Verse status

| Verse | Current implementation | Important limitation |
|---|---|---|
| CyberVerse | Existing vulnerability scanner and Cyber Academy | Scanner is protected; do not modify its interface, colours, routes or engine in OS work |
| BlockchainVerse | Solidity examples, paper trading, token and contract simulations | No real wallet connection, market data, token deployment or on-chain transactions |
| Nexora | Provider-backed AI script generation and brand-strategy briefs | Studio/equipment bookings and Copyright Hunter monitoring are not connected |
| TechVerse | Frontend, backend, cybersecurity and AI learning tracks | Curriculum and progress features still need full lesson content, assessment and account sync |
| EduVerse | Provider-backed revision-note generation with WAEC/JAMB/NECO context; QuizVerse link | Official exam question banks, full CBT engine, flashcards and school reporting are not complete |
| TechLabs | Sandboxed local HTML preview and static HTML export | No remote execution, persistent cloud projects or real one-click deployment |

## Shared services

### QuizVerse
- Create and publish multiple-choice quizzes.
- Browse published quizzes and quizzes owned by the current account.
- Submit attempts; the backend calculates scores and stores results.
- Correct answers are withheld from non-owners until the attempt is scored.
- Current limits: no timed server-authoritative exams, question-bank imports, essay/code grading, live sessions, marketplace payments or AI quiz generation.

### Wallet
- Account-scoped NGN ledger.
- Paystack checkout initialization and server-side transaction verification.
- A unique payment reference prevents a successful top-up being credited twice.
- Required backend variables: `PAYSTACK_SECRET_KEY`, `PAYSTACK_CALLBACK_URL`.
- Withdrawals, signed asynchronous webhooks, refunds, chargebacks, settlement reconciliation and bank payouts are not enabled. Until a valid Paystack key and HTTPS callback are configured, top-ups will return a clear configuration error.

### Affiliate Network
- Referral profile and referral link creation.
- Referral visit tracking.
- One-time account attribution, blocked for self-referrals and accounts older than 24 hours.
- Payout requests are balance-checked and queued for manual review.
- The default displayed commission rate is 20%, but commission posting is not yet connected to verified marketplace/subscription purchases. Do not promise affiliate earnings until that integration is complete.

### AI generation
- Nexora script and brand brief generation.
- EduVerse revision notes and original practice questions.
- Requires at least one backend provider key: `GROQ_API_KEY`, `OPENAI_API_KEY` or `GEMINI_API_KEY`.
- If no provider is configured, the API returns an explicit configuration error instead of fabricating AI output.
- AI credit metering, package sales, per-user quotas and cost reconciliation are not yet enabled.

### Other shared modules
- Marketplace purchases and wallet interactions still use client-side demo state and must not be treated as real payments.
- Subscription tiers are currently client-side configuration; paid checkout is not enabled.
- The current Admin Dashboard uses local demo data; it is not yet a production platform administration console.
- Messaging, bot marketplace and several creator tools still need their persistence, access control and operational integrations completed.

## Required production configuration

- `MONGODB_URI`
- `JWT_SECRET` and `JWT_REFRESH_SECRET` (long, unique, random secrets)
- `PAYSTACK_SECRET_KEY` (backend only)
- `PAYSTACK_CALLBACK_URL` (full HTTPS URL ending in `/wallet`)
- At least one of `GROQ_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`
- `PUBLIC_APP_URL` or `VITE_URL` for referral-link generation

Never expose provider secrets through frontend `VITE_*` variables.

## Validation and release gates

1. GitHub Actions must pass the backend deployment transpilation and frontend build.
2. Scanner-protection CI must pass.
3. The full backend TypeScript typecheck currently reports a pre-existing `urlObj` reference error in the protected `backend/src/services/scanner/modules/SSLScanner.ts`. This workstream does not edit that scanner file; the deployment build uses esbuild transpilation without changing scanner source. A separate scanner-owner-approved fix is required to restore a clean full typecheck.
4. Test sign-up, login and refresh-token behaviour against the deployed API.
5. Test QuizVerse with separate accounts, including attempts and answer secrecy.
6. Test Paystack in test mode: pending, success, failed and repeated verification.
7. Add signed Paystack webhooks and reconciliation before production wallet launch.
8. Connect marketplace/subscription payments to the immutable ledger before calculating affiliate commissions.
9. Complete mobile, accessibility, security and tenant-isolation QA before calling every Verse production-ready.

## Scanner protection

The scanner is an immutable boundary for this workstream. Its protected paths are listed in [SCANNER-PROTECTED-PATHS.md](SCANNER-PROTECTED-PATHS.md) and checked by GitHub Actions. Any scanner changes require separate explicit approval.
