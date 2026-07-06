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

## 🚀 Local Development Setup

### 1. Prerequisites
Make sure you have the following installed:
- Node.js 18+ or 20+
- npm
- MongoDB (local or Atlas)
- Git

### 2. Clone and install
```bash
git clone https://github.com/your-username/HEARTCODE.git
cd HEARTCODE
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 3. Configure environment variables
Create a `.env` file in the project root and configure the required variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/heartcode
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
VITE_URL=http://localhost:5173
```

You can also copy the example file if present:
```bash
cp .env.example .env
```

### 4. Start the backend
```bash
cd backend
npm run dev
```

### 5. Start the frontend
In a separate terminal:
```bash
cd frontend
npm run dev
```

The frontend will run at:
- http://localhost:5173

The backend will run at:
- http://localhost:5000

### 6. Verify the app
Open the frontend in your browser and confirm the app loads correctly.

### 7. Production build check
```bash
cd frontend
npm run build
```

---

## ☁️ Deployment on Vercel

The frontend is Vite-based and is well suited for deployment on Vercel.

### Vercel steps
1. Push the project to GitHub.
2. Create a new Vercel project.
3. Import the repository.
4. Set the project root to the `frontend` folder.
5. Set the build command:
   ```bash
   npm run build
   ```
6. Set the output directory:
   ```bash
   dist
   ```
7. Add environment variables in Vercel if needed:
   - `VITE_URL`
   - any public frontend variables

### Notes
- Vercel hosts the frontend only.
- The backend must still be deployed separately.

---

## 🚂 Deployment on Railway

The backend can be deployed on Railway as a Node.js service.

### Railway steps
1. Create a Railway account.
2. Create a new project in Railway.
3. Connect the GitHub repository.
4. Select the backend service.
5. Set the root directory to `backend`.
6. Use the start command:
   ```bash
   npm run start
   ```
7. Add environment variables in Railway:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `VITE_URL`

### Important deployment note
- Railway should host the backend and its MongoDB connection.
- If you use MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string.

---

## 💸 Affiliate System & AI Credit Economy

### Overview
The affiliate system is intended to become one of the primary growth and monetization engines of the platform.

Every user should be able to:
- earn recurring commissions by inviting others
- purchase AI Credits for premium services
- access premium AI-powered experiences
- grow a referral network over time

### AI Credit System
TECHNOVA OS uses an AI Credit economy for premium AI tools.

AI Credits can be used for:
- AI Security Copilot
- AI Assignment Inspector
- AI Research Assistant
- AI Medical Report Analyzer
- AI Blockchain Mentor
- AI Tech Mentor
- AI Resume Analyzer
- AI Business Partner
- AI Startup Validator
- Future AI-powered services

Users should be able to purchase credit packages such as:
- Starter Pack
- Standard Pack
- Professional Pack
- Enterprise Pack

The pricing and amounts should be configurable by the administrator.

### Affiliate Commission Model
Every user automatically becomes an affiliate after creating an account.

Each affiliate receives:
- Unique Referral Link
- Referral Code
- QR Code

When someone joins HEARTCODE through an affiliate link, that person becomes that affiliate’s referral.

### Recurring Commission
When a referred user purchases any eligible product or service, the affiliate earns a commission.

Eligible purchases may include:
- AI Credits
- Premium Membership
- Courses
- Quizzes
- Digital Products
- Certifications
- Marketplace Products
- Other eligible services

Default commission rate:
- 20%

The rate should be configurable from the admin dashboard.

### Example
If John refers Sarah and Sarah buys AI Credits worth $50 at a 20% commission rate:
- Sarah receives the credits
- John earns $10
- HEARTCODE keeps $40

### Lifetime Referral Model
Once a user signs up using a referral link, they remain linked to that affiliate unless changed by an administrator.

Future eligible purchases by that referred user continue to generate commissions.

### Affiliate Wallet & Dashboard
Each affiliate should have access to:
- Available Balance
- Pending Earnings
- Lifetime Earnings
- Monthly Earnings
- Commission History
- Withdrawal History
- Referral Count
- Conversion Rate

The affiliate dashboard should include:
- Referral Link
- Referral QR Code
- Total Clicks
- Registered Referrals
- Active Referrals
- Premium Referrals
- AI Credit Purchases
- Marketplace Purchases
- Course Purchases
- Quiz Purchases
- Certification Purchases
- Commission Earned
- Pending Earnings
- Available Balance
- Withdrawal Requests
- Leaderboard Position

### Withdrawal & Admin Controls
Affiliates should be able to request withdrawals once they meet the minimum threshold configured by the administrator.

Admin controls should include:
- Configure commission percentages
- Enable or disable recurring commissions
- Set minimum withdrawal amounts
- Approve or reject withdrawals
- Monitor affiliate fraud alerts
- View transaction history
- Generate affiliate reports
- Export commission reports

### Anti-Fraud Protection
The system should protect itself against:
- self-referrals
- duplicate accounts
- fake registrations
- bot traffic
- artificial purchases
- suspicious referral patterns

Administrators should be able to suspend or investigate affiliate accounts when unusual activity is detected.

---

## 🧠 QuizVerse Ecosystem

The app should also support a complete QuizVerse ecosystem for educational assessment and monetization.

### Quiz Creator Tools
Creators should be able to:
- create quizzes
- publish quizzes
- share quizzes
- monetize quizzes
- sell assessments

### Quiz Builder Features
The quiz builder should support:
- Multiple Choice
- True/False
- Fill in the Blank
- Essay
- Code Challenges
- Image Questions
- Video Questions
- Audio Questions
- Drag and Drop Questions

### Question Bank
Creators should be able to build reusable question libraries organized by:
- subject
- difficulty
- topic
- language
- tags

### AI Quiz Generator
Users should be able to generate quizzes from:
- PDF files
- Text
- PowerPoint files
- Word Documents
- Web Pages
- Topics
- Books
- Lecture Notes

### Quiz Store
Buyers should be able to browse quizzes by:
- category
- price
- popularity
- ratings
- newest
- difficulty

### Live Quizzes
The platform should support real-time competition features such as:
- countdown timer
- live scoreboard
- leaderboards
- prizes
- certificates

### Monetization & Institutions
Creators should be able to choose access modes such as:
- free
- paid
- subscription only
- institution only

Schools and organizations should be able to:
- create private exams
- assign quizzes
- monitor performance
- export results
- generate reports

### Community Features
The ecosystem should also support:
- quiz ratings
- quiz reviews
- creator following
- sharing
- bookmarking
- challenge friends

---

## 📞 Creator Profile & Support Details

Ambassador Heartcode actively maintains TECHNOVA OS:
*   **Lead Architect:** Ambassador Heartcode
*   **WhatsApp Contact:** [+234 814 047 3040](https://wa.me/2348140473040)
*   **Primary Email:** [aniebietabasienobong@gmail.com](mailto:aniebietabasienobong@gmail.com)
*   **Public Repository:** `c:/Users/user/Desktop/HEARTCODE`
