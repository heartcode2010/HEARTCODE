# Eket Cyberverse - Development Guide

## Prerequisites
* Node.js v18 or higher (v24 LTS recommended)
* npm v9 or higher

## Quick Start
1. Navigate to the project root:
   ```bash
   cd eket-cyberverse
   ```
2. Install dependencies:
   ```bash
   npm install --prefix apps/api
   npm install --prefix apps/web
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start development servers:
   ```bash
   # In terminal 1 (Backend API on port 4000):
   npm run dev --prefix apps/api

   # In terminal 2 (Frontend Client on port 5173):
   npm run dev --prefix apps/web
   ```
5. Open your browser:
   * Frontend: `http://localhost:5173`
   * Backend Health: `http://localhost:4000/api/health`

## Running Tests
```bash
npm run test --prefix apps/api
```
