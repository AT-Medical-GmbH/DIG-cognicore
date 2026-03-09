# Docker Deployment Guide

## Prerequisites

- Docker 24+ and Docker Compose 2.20+
- 4 CPU cores, 8 GB RAM minimum
- Valid CogniCore™ license key

## Quick Start

```bash
git clone https://github.com/at-medical/cognicore.git
cd cognicore
cp .env.example .env
# Edit .env with your values
docker compose up -d
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://cognicore:secret@postgres:5432/cognicore

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=<64-char-random-string>

# License
COGNICORE_LICENSE_KEY=<your-license-key>

# ASR Provider (choose one)
ASR_PROVIDER=azure
AZURE_SPEECH_KEY=<key>
AZURE_SPEECH_REGION=westeurope

# Object Storage
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=cognicore-recordings
S3_ACCESS_KEY=<key>
S3_SECRET_KEY=<secret>
```

## Services

```yaml
# docker-compose.yml (abbreviated)
services:
  web:
    image: ghcr.io/at-medical/cognicore-web:latest
    ports: ["3000:3000"]

  api:
    image: ghcr.io/at-medical/cognicore-api:latest
    ports: ["4000:4000"]

  caption-worker:
    image: ghcr.io/at-medical/cognicore-caption:latest

  recorder:
    image: ghcr.io/at-medical/cognicore-recorder:latest

  postgres:
    image: postgres:15-alpine

  redis:
    image: redis:7-alpine
```

## Production Checklist

- [ ] Replace self-signed TLS cert with a valid certificate (Let's Encrypt / corporate CA)
- [ ] Set `NODE_ENV=production`
- [ ] Configure external PostgreSQL with replication
- [ ] Configure Redis Sentinel or Redis Cluster
- [ ] Set up S3-compatible object storage with versioning enabled
- [ ] Configure SMTP for email notifications
- [ ] Enable log shipping to your SIEM

## Upgrading

```bash
docker compose pull
docker compose up -d
docker compose exec api npx prisma migrate deploy
```

## Health Checks

```bash
curl https://<domain>/api/health        # API health
curl https://<domain>/api/health/db     # Database connectivity
curl https://<domain>/api/health/redis  # Redis connectivity
```
