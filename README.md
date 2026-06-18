# 🛡️ HEARTCODE Full-Stack Cyber-Intelligence OS & Cyber Academy

Welcome to **HEARTCODE**, an enterprise-grade, hybrid Cyber Intelligence Suite and Cyber Academy platform. Built using a robust full-stack TypeScript architecture, HEARTCODE provides deep security scanning, vulnerability detection, and a comprehensive, AI-powered cybersecurity education ecosystem.

---

## 🏗️ Architecture & Core Technology Stack

HEARTCODE is structured as a decoupled monorepo containing a React client and an Express/Node.js server.

```
HEARTCODE/
├── backend/                 # Express, Node.js & TypeScript Server
│   ├── src/
│   │   ├── config/          # DB connections and third-party setups
│   │   ├── controllers/     # API request routers
│   │   ├── middleware/      # Auth guards, errors, validators, and logger
│   │   ├── models/          # Mongoose database schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Scan analysis, LLM tutor, and report generation
│   │   └── server.ts        # App bootstrapper
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Vite, React & TypeScript Client
│   ├── src/
│   │   ├── components/      # UI Panels, scan visualizers, Academy pages
│   │   ├── store/           # Zustand global state (auth, scan, academy)
│   │   ├── services/        # Axios interceptors and API integrations
│   │   ├── index.css        # Cyberpunk design system styles
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── vercel.json              # Frontend routing & Vercel deployment setup
├── railway.json             # Backend build & Railway deployment setup
└── package.json             # Root scripts orchestrator
```

### 💻 Frontend Tech Stack (`/frontend`)
*   **Framework:** React 19, TypeScript, Vite
*   **Styling:** CSS variables integrated with Tailwind CSS (v4) for deep cyberpunk aesthetics, scanlines, micro-animations, and glow effects.
*   **State Management:** Zustand (decoupled stores with `localStorage` persistence for authentication and academy progress).
*   **Routing:** React Router v6 (lazy-loaded modules with React `Suspense`).
*   **Network Client:** Axios with dynamic request/response interceptors to handle automated JWT token rotation.

### ⚙️ Backend Tech Stack (`/backend`)
*   **Runtime & Server:** Node.js, Express, TypeScript
*   **Database:** MongoDB via Mongoose object modeling
*   **Security Headers:** Helmet.js
*   **Protection Layer:** CORS origin validation & Express Rate Limit (DDoS prevention)
*   **Payload Support:** Express JSON parser configured with a `15mb` ceiling to support deep source-code scans
*   **Authentication:** JWT Access Token (15m expiry) + Refresh Token (7d expiry) with Role-Based Access Control (RBAC)

---

## 🗺️ Monolithic Refactoring Map

HEARTCODE has been modularized from its original monolithic prototype (`HEARTCODE.html`) into a structured, maintainable architecture:

| Monolithic Logic | Modern Refactored Destination | Architectural Purpose |
| :--- | :--- | :--- |
| **CSS Variables & Custom Reset** | [`frontend/src/index.css`](file:///c:/Users/user/Desktop/HEARTCODE/frontend/src/index.css) | Core variables (`--color-cyber-*`) and keyframe animations preserved for the CRT styling. |
| **Splash Screen (`#splash`)** | [`frontend/src/components/SplashScreen`](file:///c:/Users/user/Desktop/HEARTCODE/frontend/src/components/SplashScreen) | Separated into a clean CSS/React splash screen module. |
| **Security Scanning Rules** | [`backend/src/services/ScanService.ts`](file:///c:/Users/user/Desktop/HEARTCODE/backend/src/services/ScanService.ts) | Scanning patterns moved to server-side rules to protect proprietary heuristics. |
| **AI Evaluation Algorithms** | [`backend/src/services/AIService.ts`](file:///c:/Users/user/Desktop/HEARTCODE/backend/src/services/AIService.ts) | Safe processing of source layouts and LLM boilerplate patterns. |
| **Reports Exporter** | [`backend/src/controllers/report.controller.ts`](file:///c:/Users/user/Desktop/HEARTCODE/backend/src/controllers/report.controller.ts) | Relocated to the backend to natively render PDF, HTML, MD, JSON, and CSV. |

---

## 🛠️ Local Installation & Development

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) running locally (default: `mongodb://localhost:27017/heartcode`) or Docker.

### 2. Startup using Docker (Optional)
To run a MongoDB database container instantly:
```bash
docker-compose up -d
```

### 3. Install Workspace Dependencies
Install dependencies concurrently for the root, frontend, and backend packages:
```bash
npm run install:all
```

### 4. Configure Local Environment
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

Ensure the values in `.env` match your local setup:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heartcode
JWT_SECRET=supersecretjwtkeyforheartcodenotproductionready123!
JWT_REFRESH_SECRET=supersecretjwtrefreshkeyforheartcodenotproductionready456!

# LLM Providers (Required for AI features, e.g. Cyber Tutor, Scam Detector)
GEMINI_API_KEY=your_gemini_api_key_here
ACADEMY_AI_MODEL=gemini-1.5-flash
CERTIFICATE_SECRET=heartcode_academy_cryptographic_verification_key_hash_salt
ACADEMY_STORAGE_PATH=./data/academy
```

### 5. Launch Local Dev Servers
Start the client and server concurrently:
```bash
npm run dev
```
*   **Frontend Client:** `http://localhost:3000` (Vite dev server)
*   **Backend Server:** `http://localhost:5000` (Express JSON REST API)

---

## 🎓 Cyber Academy Modules Reference

The Cyber Academy is a dedicated module offering 17 interactive security training panels:

1.  **Training Center:** Curated learning paths for Individuals, Businesses, and Schools.
2.  **AI Cyber Tutor:** Terminal-based chatbot explaining cybersecurity concepts based on learner level.
3.  **Phishing Lab:** Simulated email/SMS inspection exercises with scorecard feedback.
4.  **Learning Labs:** Hands-on sandboxes for XSS concepts, Cookie privacy, and Port mapping.
5.  **Cyber Challenges:** Gamified quizzes with customizable questions, badges, and XP trackers.
6.  **Certification Center:** Generate and verify signed completion credentials for academy pathways.
7.  **Scam Detector:** Input messages to evaluate social engineering triggers and validation cues.
8.  **Safety Scorecard:** Answer threat-modeling questions to generate an SVG Security Radar Chart.
9.  **SME Toolkit:** SME checklists, risk calculators, and customizable template policy generators.
10. **Incident Response:** Walkthrough recovery playbooks for accounts, leaks, and devices.
11. **Career Pathways:** Roles, certificates, and home lab project blueprints.
12. **Curriculum Generator:** Build structured cybersecurity lesson plans for school settings.
13. **Knowledge Center:** Combined community wiki and fraud pattern registry.
14. **Campaign Builder:** Generate copy, banners, and social posts for public safety marketing.
15. **Threat Feed:** live security ticker displaying global and local Nigerian threat alerts.
16. **Organization Dashboard:** Admin tools to track employee completion rates and risk scorecards.

---

## 🌐 Production Deployment Guide

HEARTCODE is pre-configured to be deployed instantly: the frontend to **Vercel** and the backend to **Railway**.

### Step 1: Deploy Backend on Railway

1.  Sign in to [Railway](https://railway.app) and create a new project.
2.  Select **Deploy from GitHub repository** and select your cloned HEARTCODE repository.
3.  Add a **MongoDB database** service to your Railway project.
4.  In the Railway service settings for your backend application, define the following variables:
    *   `PORT`: `5000` (Railway automatically provides and maps this value)
    *   `MONGODB_URI`: Link it to your Railway MongoDB instance URL (e.g. `${{MongoDB.MONGODB_URL}}` or raw string connection URL)
    *   `JWT_SECRET`: Generate a strong secret string.
    *   `JWT_REFRESH_SECRET`: Generate a second strong secret string.
    *   `GEMINI_API_KEY`: Your Google AI API key.
    *   `ACADEMY_AI_MODEL`: `gemini-1.5-flash`
    *   `CERTIFICATE_SECRET`: Generate a cryptographic salt.
5.  Railway will detect the root-level `railway.json` configuration, trigger typescript compilation (`tsc`), and deploy the app successfully.
6.  Once deployed, copy your Railway service public domain URL (e.g., `https://heartcode-backend.up.railway.app`).

### Step 2: Configure & Deploy Frontend on Vercel

1.  Open the root-level [`vercel.json`](file:///c:/Users/user/Desktop/HEARTCODE/vercel.json) file.
2.  Locate the `/api/:path*` rewrite mapping:
    ```json
    {
      "source": "/api/:path*",
      "destination": "https://heartcode-backend.up.railway.app/api/:path*"
    }
    ```
3.  Replace `https://heartcode-backend.up.railway.app` with the actual public URL of your backend on Railway (make sure you preserve the `/api/:path*` ending).
4.  Commit and push the change to your GitHub repository.
5.  Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
6.  Import the repository.
7.  Vercel automatically reads the `vercel.json` file in the root directory. It will install frontend dependencies (`npm install --prefix frontend --legacy-peer-deps`), trigger Vite's production build (`npm run build --prefix frontend`), and deploy the build outputs.
8.  Open your deployed Vercel URL (e.g. `https://your-project.vercel.app`) to start utilizing the full platform in production!
