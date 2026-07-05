# 🌌 TECHNOVA OS — Next-Gen Cyber-Intelligence OS & Multi-Verse Ecosystem

Welcome to **TECHNOVA OS** (formerly HEARTCODE), a premium, next-generation security, educational, content creation, blockchain, and creator operating system. Engineered with a decoupled monorepo full-stack TypeScript architecture, this platform is optimized for performance, security, and developer monetization.

Created by **Ambassador Heartcode** under the **Technova** brand, this platform enables users to:
*   **Learn:** Interactive programming, DeFi, and cybersecurity academies.
*   **Build:** Spawns isolated browser sandbox containers to test code.
*   **Earn:** Sell digital templates, design packages, and apply for freelance gigs.
*   **Collaborate:** Multi-channel community messaging spaces and direct chat logs.
*   **Receive Payments:** Wired inline checkout supporting OPay, local cards, bank transfers, and Stripe.

---

## 🗺️ Multi-Verse Structure & Core Features

TECHNOVA OS is divided into 6 distinct virtual sectors ("Verses") and workspace modules:

### 1. ⚡ CyberVerse (Flagship Scanner Engine)
*   **Target Inspector:** Input any remote site URL to fetch raw client-side HTML and response headers.
*   **Advanced Scanner Engine:** Features 19 parallel analysis modules (SSL, HTTP headers, session cookies, information disclosure, exposed API endpoints, authentication gaps, obfuscation signatures, and design system templates).
*   **Vulnerability Detection:** Identifies critical risks and OWASP gaps, scanning across millions of combinations rather than basic static string matches.
*   **AI Signal Forensics:** Examines source markers across millions of possibilities to determine if code blocks were generated with AI assistants (GPT-Engineer, Lovable, Bolt, Cursor, Copilot).
*   **AI Deep Analysis:** Queries configured LLM endpoints to generate a full secure code audit reports with technical explanation, business impact, and remediation code blocks.
*   **Self-Scanning Protection Protocol:** The target inspector detects if it is scanning its own system domain (containing `heartcode`, `technova`, or local loops). If detected, it aborts the scan immediately with the alert: `Security Restriction: Can't scan internal system node. Access Denied.`

### 2. 🪙 BlockchainVerse (Web3 Forge)
*   **Academy:** Interactive curriculums explaining decentralized finance, smart contract architecture, gas optimizations, and consensus engines.
*   **Solidity Workspace:** Step-by-step smart contract builders to deploy mock tokens or NFT templates.
*   **Crypto Trading Sandbox:** Simulated ledger trading graphs and asset allocations.

### 3. 🎨 Nexora (AI Creator Studio)
*   **AI Director:** Input ideas to automatically generate video shot lists, estimated timestamps, optimized script copy, camera angles, and ambient lighting layouts.
*   **AI Brand Builder:** Instantly generates brand guidelines including primary/secondary color schemes, accent marks, and typography settings.
*   **Rentals & Studios:** Reserve recording rooms (green screens, acoustic podcast studios) or rent professional cameras and sound hardware.
*   **Copyright Hunter:** Monitors public domains, YouTube links, and scrapers to detect unauthorized reuploads or logo matches.

### 4. 💻 TechVerse (Developer Academy)
*   **Programming Paths:** Structured roads for Web Development (React, Next.js, TypeScript), Database Systems (Node.js, Postgres, Redis), Cybersecurity audits, and Machine Learning models.
*   **Syllabus XP:** Earn Hallmark XP and unlock progression milestones as you complete curriculum chapters.

### 5. 📚 EduVerse (WAEC & JAMB CBT Companion)
*   **CBT Simulator:** Interactive computer-based testing containing WAEC mathematics, physics, and English mock practice questions.
*   **AI Notes Generator:** Input any academic topic to generate lecture summaries, key takeaways, and flashcard sets.

### 6. 🏗️ TechLabs (Vite-style App Sandbox)
*   **Live Playground:** Edit HTML/CSS/JS with instant preview rendering in an isolated browser preview pane.
*   **One-Click Deploy:** Spawns a mock production web server node, outputting a public URL for peer review.
*   **Static Exporter:** Compile and download the raw sandbox codebase directly.

---

## 🛡️ Anti-Scan & Reconnaissance Obfuscation Firewall

To protect intellectual properties and shield internal directories from unwanted external surveillance:
1.  **Crawler & Scraper Interceptor:** A global Express middleware intercepts all incoming requests to backend API pathways and frontend static folders.
2.  **Fingerprint Detection:** Detects automated crawlers, security scanners, or scrapers by mapping user-agent headers against known scanner signatures (`sqlmap`, `nmap`, `googlebot`, `semrush`, `ahrefs`, `python-requests`, `curl`, `wget`, `axios`, `headlesschrome`).
3.  **Active Obfuscation Response:**
    *   **For Frontend routes:** Returns a simplified flat HTML wrapper showing only basic tech stack tags. No javascript code blocks or internal folder hierarchies are exposed.
    *   **For Backend APIs:** Blocks access to database collections, returning a sanitized tech stack manifest (HTML5, React, Node.js, Express, Zustand) while reporting the AI detection levels as `NOT DISCLOSED` and vulnerabilities as empty.
    *   **Scan Limit Cap:** Free daily scan limits are restricted to 5. Once reached, requests are blocked until midnight.

---

## 💳 Payment Integrations & Wallet System

1.  **Dynamic Checkout Router:**
    *   *Stripe (Global):* Handles subscriptions and purchases for international users.
    *   *Paystack & Flutterwave (Africa):* Supports card payments, USSD, direct bank transfers, and OPay wallets inside Nigeria and other African regions.
2.  **Administrative Payout Ledger:** Users can check their earned balances, request withdrawals to Nigerian banks or OPay, and track payment review statuses. Admins can approve and pay directly from the control panel.

---

## 📞 Creator Profile & Support Details

Ambassador Heartcode actively maintains TECHNOVA OS:
*   **Lead Architect:** Ambassador Heartcode
*   **WhatsApp Contact:** [+234 814 047 3040](https://wa.me/2348140473040)
*   **Primary Email:** [aniebietabasienobong@gmail.com](mailto:aniebietabasienobong@gmail.com)
*   **Public Repository:** `c:/Users/user/Desktop/HEARTCODE`

---

## 🚀 Dev Setup & Deployment

1.  **Install dependencies concurrently:**
    ```bash
    npm run install:all
    ```
2.  **Add environment variables:** Customize public and secret checkout keys inside `.env`.
3.  **Start concurrent dev servers:**
    ```bash
    npm run dev
    ```
4.  **Production build verification:**
    ```bash
    npm run build --prefix frontend
    ```
