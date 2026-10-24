# 🛡️ EKET CYBERVERSE

**Global Cybersecurity Intelligence, Exposure Management, Defensive Automation, and Digital Resilience Platform**  
*Heartcode Technologies* — *"From Security Intelligence to Verified Resilience."*

---

## ⚡ What is Eket Cyberverse?

**Eket Cyberverse** is an independent, enterprise-grade cybersecurity operations and exposure management platform. Unlike legacy vulnerability scanners that rely on superficial pattern matching and self-declared fixes, Eket Cyberverse implements the **Verified Remediation Engine**: a workflow that binds every vulnerability finding to rigorous proof, change approval, and verifiable technical evidence.

### 🌟 Key Capabilities

1. **Digital Asset Inventory:** Track domains, cloud workloads, servers, endpoints, databases, and runtimes with evidence source and freshness tracking.
2. **Global Vulnerability Intelligence:** Automated ingestion and correlation of official CVE records, vendor advisories (PHP, OpenSSL, Apache, Nginx), and CISA Known Exploited Vulnerabilities (KEV).
3. **PHP Runtime Security:** Comprehensive detection of active PHP runtime installations, end-of-life support tracking, affected version ranges, backport detection, and remediation planning.
4. **TLS Trust Guardian:** Continuous certificate inventory, expiration warnings, chain validation, and distrusted issuer detection.
5. **Explainable Risk Prioritization:** Multi-factor scoring taking into account vendor severity, confirmed exploitation, internet exposure, and asset criticality with full rationale.
6. **The Verified Remediation Engine:** Rigorous lifecycle states (`New` → `Confirmed` → `Remediation Required` → `Awaiting Approval` → `Approved` → `In Progress` → `Awaiting Verification` → `Verified Resolved`). Findings cannot be closed without verified technical evidence.
7. **Security Change Rehearsal:** Pre-flight impact simulations for runtime updates, package upgrades, and certificate rotations with automated rollback planning.
8. **AI Security Copilot:** Context-aware assistant backed by deterministic security heuristics and authoritative citations.
9. **Incident Management & Response:** Track suspected vs. confirmed security events, containment actions, and forensic timelines.
10. **Backup & Recovery Assurance:** Monitor backup integrity, define RTO/RPO targets, and log empirical restore drill proofs.
11. **Cyber Range:** Interactive simulated security scenarios for hands-on operational training.
12. **Audit History & Compliance Reporting:** Tamper-evident activity logs, executive summaries, and evidence-backed posture exports.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd eket-cyberverse
npm install --prefix apps/api
npm install --prefix apps/web
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Launch Development Servers
```bash
# Starts both Backend API (port 4000) and Frontend Client (port 5173)
npm run dev
```

* **Frontend Console:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:4000/api](http://localhost:4000/api)

---

## 🔒 Isolation Guarantee
Eket Cyberverse is developed as an entirely separate product with its own source code, dependencies, database, APIs, and security configurations.
