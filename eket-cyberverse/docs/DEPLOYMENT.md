# Eket Cyberverse - Production Deployment Guide

## Production Architecture
* **Frontend:** Built via Vite static bundle (`npm run build --prefix apps/web`), deployable to any static host, CDN, or reverse-proxied Nginx/Cloudflare server.
* **Backend:** Node.js Express server (`npm run build --prefix apps/api`), runs containerized with Docker or as a systemd service.
* **Database:** Connects to PostgreSQL via `DATABASE_URL` or zero-config embedded SQLite for local/edge deployments.

## Docker Deployment
```yaml
version: '3.8'
services:
  eket-api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
      - DATABASE_URL=postgresql://user:pass@db:5432/eket_cyberverse
      - JWT_SECRET=strong_production_secret
  eket-web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "80:80"
```
