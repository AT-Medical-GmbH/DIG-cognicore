# CogniCell LocalLink — Offline Deployment

**CogniCell LocalLink** is a self-contained CogniCore™ edge node designed for environments with unreliable or no internet connectivity (field hospitals, remote classrooms, aircraft, vessels).

## Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 4-core x86-64 / ARM64 | 8-core x86-64 |
| RAM | 8 GB | 16 GB |
| Storage | 64 GB SSD | 256 GB NVMe |
| Network | 100 Mbps LAN | 1 Gbps LAN |

Tested on: **Raspberry Pi 4 (8 GB)**, **Intel NUC 12**, **ASUS NUC 13**.

## Services Included

| Service | Cloud Equivalent |
|---|---|
| Next.js (static export) | `apps/web` |
| NestJS API | `apps/api` |
| PostgreSQL 15 | Cloud PostgreSQL |
| Redis 7 | Cloud Redis |
| Whisper (local ASR) | Azure / AWS ASR |
| MinIO | S3 object storage |

## Installation

```bash
# Download LocalLink installer
curl -fsSL https://releases.cognicore.at-medical.com/locallink/install.sh | bash

# Configure
cp .env.locallink.example .env
nano .env   # set LOCALLINK_LICENSE_KEY, INSTITUTION_NAME

# Start
docker compose -f docker-compose.locallink.yml up -d
```

## Sync Behaviour

When internet connectivity is restored:

1. PostgreSQL WAL replicated to cloud via **pg_logical** (async).
2. MinIO recordings uploaded to cloud S3 bucket.
3. CogniChronicle xAPI statements flushed to cloud LRS.
4. License heartbeat sent to AT Medical GmbH® licensing server.

## Offline ASR

LocalLink uses **OpenAI Whisper** (base or small model) running on CPU. Expected latency:
- Whisper `base`: ~800 ms on Intel NUC
- Whisper `small`: ~1.5 s on Intel NUC

GPU acceleration (CUDA) supported if available.

## Security

- All LAN traffic encrypted with a self-signed TLS certificate generated at install time.
- No data leaves the node without explicit sync trigger.
- Node registers with AT Medical GmbH® licensing server on first boot; subsequent offline operation permitted for up to **30 days** without re-validation.
