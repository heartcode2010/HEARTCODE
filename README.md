# 🛡️ HEARTCODE — Next-Gen Vulnerability Scanner & Cyber Academy

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**Enterprise-Grade Web Vulnerability Scanner and Interactive Cybersecurity Academy Platform**

[Features](#-core-platforms) • [Architecture](#-architecture) • [Getting Started](#-local-development-setup) • [Cyber Academy](#-cyber-academy-modules) • [Deployment](#-production-deployment-guide) • [Contact](#-lead-architect--support)

</div>

---

## 📌 Executive Overview

**HEARTCODE** is a high-performance cybersecurity platform designed with a decoupled monorepo full-stack TypeScript architecture. It unites two foundational cybersecurity pillars into a cohesive, cyberpunk-styled operations console:

1. **🛡️ The Vulnerability & Reconnaissance Scanner:** Deep client-side and server-side analysis engine with 19+ concurrent inspection modules, AI code forensics, OWASP vulnerability detection, and multi-format report exports.
2. **🎓 The Cyber Academy Ecosystem:** A 17-module interactive cybersecurity training ground featuring hands-on sandboxes, phishing simulation labs, AI-assisted tutoring (powered by Google Gemini), gamified CTF challenges, and cryptographically signed certificate issuance.

---

## 🗺️ Core Platforms

### 🛡️ Platform 1: Web Vulnerability & Intelligence Scanner

Inspect remote domains and URLs in real-time through an interactive cyber defense terminal:

* **Target URL Inspector:** Rapidly fetches remote client-side HTML, response headers, status codes, and network metadata.
* **19+ Concurrent Security Modules:**
  * **SSL/TLS & Transport Security:** Identifies weak ciphers, expired certificates, and missing HSTS configurations.
  * **HTTP Security Headers:** Audits `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
  * **Cookie & Session Hygiene:** Flags missing `Secure`, `HttpOnly`, and `SameSite` flags.
  * **Information Disclosure:** Detects exposed server banners, environment signatures, internal stack traces, and debug keys.
  * **CORS & Endpoint Misconfigurations:** Checks for wildcard access controls (`Access-Control-Allow-Origin: *`) on authenticated endpoints.
  * **Dependency & Library Auditing:** Surfaces outdated front-end JavaScript libraries with known CVE vulnerabilities.
  * **Obfuscation & Malicious JS Detection:** Analyzes client scripts for packed routines, suspicious hex strings, and high-entropy code segments.
* **AI Signal Forensics:** Scans target source code for architectural signatures left by modern AI coding assistants (GPT-Engineer, Lovable, Bolt, Cursor, Copilot).
* **AI-Powered Deep Threat Analysis:** Queries integrated LLMs to generate executive risk summaries, technical impact vectors, and actionable code-level remediation snippets.
* **Multi-Format Report Exporter:** Download findings with one click as structured **PDF**, **HTML**, **Markdown**, **JSON**, or **CSV** reports.
* **Self-Scanning Defense Shield:** Intelligent internal filter detects loopback requests and protects internal infrastructure nodes against self-targeting reconnaissance.

---

### 🎓 Platform 2: Interactive Cyber Academy

An experiential security training ecosystem equipped with 17 specialized modules:

| Module | Purpose & Core Capabilities |
| :--- | :--- |
| **🤖 AI Cyber Tutor** | Interactive AI mentor explaining complex cybersecurity concepts, attack vectors, and defense techniques tailored to the student's level. |
| **🎣 Phishing Simulation Lab** | Hands-on sandbox analyzing real-world deceptive emails, SMS lures, typosquatting domains, and credential harvesters. |
| **🧪 Hands-On Learning Labs** | Guided environments to test Cross-Site Scripting (XSS), insecure cookie handling, port mapping, and SQL injection fundamentals. |
| **🏆 Cyber Challenges & CTF** | Gamified security challenges, skill quizzes, progression milestones, and dynamic XP tracking. |
| **📜 Certification Center** | Generates cryptographically verifiable completion certificates with SHA-256 digital seals and verification tokens. |
| **🕵️ Scam Detector** | Real-time social engineering inspection tool analyzing suspicious SMS, emails, and direct messages for urgency triggers and fraud patterns. |
| **📊 Safety Scorecard** | Interactive organizational and personal security posture evaluator with dynamic SVG Radar Chart visualization. |
| **🧰 SME Security Toolkit** | Tailored risk calculators, operational security checklists, and customizable security policy generators for small businesses. |
| **🚨 Incident Response** | Step-by-step interactive playbooks for compromised accounts, ransomware containment, data leak remediation, and device forensics. |
| **🧭 Career Pathways** | Curated roadmaps for SOC Analysts, Penetration Testers, Cloud Security Engineers, and GRC Specialists. |
| **📚 Knowledge Center** | Searchable glossary, threat actor intelligence profiles, and an updated fraud pattern archive. |
| **📣 Campaign Builder** | Tool for security teams to generate awareness emails, awareness banners, and workplace training collateral. |
| **📡 Threat Feed** | Real-time security intelligence ticker monitoring global threat alerts, active zero-day disclosures, and regional advisories. |
| **🏢 Org Dashboard** | Team administrative console to track member curriculum completion, challenge scores, and group risk ratings. |

---

## 🏗️ Architecture

```
HEARTCODE/
├── backend/                       # Express, Node.js & TypeScript Server
│   ├── src/
│   │   ├── config/                # Database connection & runtime configurations
│   │   ├── controllers/           # REST API route controllers
│   │   │   ├── academy.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   ├── scan.controller.ts
│   │   │   └── vulnerability.controller.ts
│   │   ├── middleware/            # JWT auth, rate limiter, crawler filter, error handling
│   │   ├── models/                # MongoDB Mongoose models (User, Scan, AcademyProgress)
│   │   ├── routes/                # Express API endpoint definitions
│   │   │   ├── academy.routes.ts  # Academy learning endpoints
│   │   │   ├── scan.routes.ts     # Target inspection & analysis endpoints
│   │   │   ├── vulnerability.routes.ts
│   │   │   └── report.routes.ts   # Report export endpoints
│   │   ├── services/              # Scanning heuristics, Gemini LLM client, reporting
│   │   ├── server.ts              # Server bootstrapper & listener
│   │   └── app.ts                 # Express middleware configuration
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # React 19, TypeScript & Vite Client
│   ├── src/
│   │   ├── components/            # Reusable UI modules & scanning panels
│   │   │   ├── academy/           # 17 interactive Cyber Academy panels
│   │   │   ├── Header/            # Mode toggle: Scanner ↔ Cyber Academy
│   │   │   ├── Scanner/           # URL target input & progress bars
│   │   │   ├── SourcePanel/       # Raw HTML inspection pane
│   │   │   ├── VulnerabilityPanel/# Categorized risk findings & severity badges
│   │   │   ├── AIDetectionPanel/  # AI code generator forensics analysis
│   │   │   └── TechStackPanel/    # Framework & server stack identifier
│   │   ├── pages/                 # Top-level route pages (Dashboard, AcademyLanding)
│   │   ├── routes/                # React Router v6 definitions (Scanner, Academy)
│   │   ├── store/                 # Zustand state stores (scanStore, academyStore, authStore)
│   │   ├── services/              # Axios API client with automatic token refreshing
│   │   └── index.css              # Cyberpunk CRT scanlines, neon accents & design tokens
│   ├── package.json
│   └── vite.config.ts
│
├── vercel.json                    # Vercel frontend deployment and API proxy rules
├── railway.json                   # Railway backend deployment manifest
└── package.json                   # Root workspace scripts orchestrator
```

---

## ⚙️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Zustand |
| **Backend** | Node.js, Express, TypeScript, Helmet, Axios, Rate-Limiter |
| **Database** | MongoDB with Mongoose ODM |
| **AI Integration** | Google Gemini API (gemini-1.5-flash / gemini-pro) |
| **Security** | JWT (Access + Refresh tokens), bcrypt password hashing, CORS whitelist, Anti-Crawler Middleware |
| **Deployment** | Vercel (Frontend Client) + Railway / Docker (Backend API & MongoDB) |

---

## 🚀 Local Development Setup

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **MongoDB** (local community instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Clone the Repository
```bash
git clone https://github.com/heartcode2010/HEARTCODE.git
cd HEARTCODE
```

### 3. Install All Dependencies
Install dependencies concurrently for the root, frontend, and backend workspaces:
```bash
npm run install:all
```
*(Or navigate to `/frontend` and `/backend` individually and run `npm install`)*

### 4. Configure Environment Variables
Create a `.env` file in the project root (you can copy `.env.example` if available):

```env
# ── Server Configuration ──
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/heartcode

# ── JWT Security Credentials ──
JWT_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# ── LLM Integration (AI Cyber Tutor, Scam Detector) ──
GEMINI_API_KEY=your_google_gemini_api_key_here
ACADEMY_AI_MODEL=gemini-1.5-flash

# ── Academy Cryptographic Verification ──
CERTIFICATE_SECRET=heartcode_academy_cryptographic_verification_key_hash_salt
ACADEMY_STORAGE_PATH=./data/academy

# ── Frontend Configuration ──
VITE_URL=http://localhost:5173
```

### 5. Launch the Development Servers
From the root directory, start both client and server concurrently:
```bash
npm run dev
```

* **Vulnerability Scanner & Console:** [`http://localhost:5173`](http://localhost:5173)
* **Cyber Academy Direct Link:** [`http://localhost:5173/academy`](http://localhost:5173/academy)
* **Backend REST API:** [`http://localhost:5000`](http://localhost:5000)
* **API Health Check:** [`http://localhost:5000/health`](http://localhost:5000/health)

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/scans/inspect` | Initiates target URL retrieval and raw source extraction | Yes |
| `POST` | `/api/scans/vulnerability` | Executes the 19-module vulnerability heuristic scan | Yes |
| `GET`  | `/api/scans/ai-detect` | Analyzes target code for AI-assistant generator signatures | Yes |
| `GET`  | `/api/scans/tech-stack` | Identifies client frameworks, libraries, and CDNs | Yes |
| `GET`  | `/api/scans/history` | Fetches recent scan audit history | Yes |
| `POST` | `/api/reports/export` | Generates downloadable reports (PDF, HTML, MD, JSON, CSV) | Yes |
| `GET`  | `/api/academy/modules` | Retrieves all 17 cyber academy curriculum modules | Yes |
| `POST` | `/api/academy/tutor/chat` | AI Cyber Tutor streaming dialogue powered by Gemini | Yes |
| `POST` | `/api/academy/cert/verify` | Verifies digital cryptographic certificate signature | No |
| `GET`  | `/health` | Server health and operational status check | No |

---

## ☁️ Production Deployment Guide

HEARTCODE is optimized for zero-downtime deployment: the **frontend to Vercel** and the **backend to Railway**.

### Deploy Backend on Railway
1. Create a project at [Railway](https://railway.app).
2. Connect your GitHub repository and select the root directory with Railway configuring `/backend`.
3. Provision a **MongoDB** service inside Railway.
4. Add your environment variables (`PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.).
5. Railway will automatically build and deploy the Node.js TypeScript server via `railway.json`.
6. Copy your public Railway URL (e.g., `https://heartcode-backend.up.railway.app`).

### Deploy Frontend on Vercel
1. In [`vercel.json`](./vercel.json), confirm the destination matches your Railway backend URL:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://heartcode-backend.up.railway.app/api/$1" }
     ]
   }
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Root Directory to `frontend`.
4. Deploy — Vercel builds the production Vite bundle and provides global edge CDN distribution.

---

## 👨‍💻 Lead Architect & Support

* **Architect & Creator:** Ambassador Heartcode
* **WhatsApp Direct:** [+234 814 047 3040](https://wa.me/2348140473040)
* **Primary Email:** [aniebietabasienobong@gmail.com](mailto:aniebietabasienobong@gmail.com)
* **Repository:** [heartcode2010/HEARTCODE](https://github.com/heartcode2010/HEARTCODE)

---

<div align="center">
  <sub>Built with precision for ethical hackers, security analysts, and developers. © HEARTCODE. All rights reserved.</sub>
</div>
