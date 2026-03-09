# CogniCore™ System Architecture

**Status:** Current | **Owner:** AT Medical GmbH® Architecture Team

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  Browser (Next.js)   Mobile PWA   CogniCell LocalLink Node      │
└───────────────┬─────────────────────────┬───────────────────────┘
                │ HTTPS / WSS             │ LAN (offline)
┌───────────────▼─────────────────────────▼───────────────────────┐
│                      API Gateway / CDN                          │
│            (Nginx / Cloudflare / AWS ALB)                       │
└───┬───────────────┬──────────────────────┬──────────────────────┘
    │               │                      │
┌───▼───┐     ┌─────▼──────┐        ┌──────▼──────┐
│ REST  │     │ Socket.io  │        │  Media SFU  │
│ API   │     │  Server    │        │  (mediasoup)│
│NestJS │     │  NestJS    │        └─────────────┘
└───┬───┘     └─────┬──────┘
    │               │
┌───▼───────────────▼──────────────────────────────────────────┐
│                     Service Mesh                              │
│  CogniCoordinator │ CogniCaption │ CogniCapture │ CogniCoach  │
└───┬───────────────────────────────────────────┬──────────────┘
    │                                           │
┌───▼──────────┐                        ┌───────▼──────────┐
│  PostgreSQL  │                        │      Redis        │
│  (Prisma)   │                        │  (pub/sub cache)  │
└─────────────┘                        └──────────────────┘
```

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend API | NestJS 10, TypeScript |
| Real-time | Socket.io 4, mediasoup 3 |
| Database | PostgreSQL 15, Prisma ORM |
| Cache / Pub-Sub | Redis 7 |
| Speech AI | Azure Cognitive Services, AWS Transcribe, OpenAI Whisper |
| Infrastructure | Docker, Kubernetes, Terraform |

## Package Structure (Monorepo)

```
/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # NestJS REST + WebSocket
│   └── locallink/    # CogniCell LocalLink edge node
├── packages/
│   ├── ui/           # Shared React components
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared config schemas
└── services/
    ├── caption/      # CogniCaption ASR worker
    └── recorder/     # CogniCapture media pipeline
```

## Data Flow

1. Client authenticates via JWT (OAuth2 / LTI 1.3).
2. REST API persists session state to PostgreSQL via Prisma.
3. Socket.io server pushes real-time events through Redis pub/sub.
4. CogniCaption workers stream ASR results back over the same Socket.io channel.
5. CogniCapture records composite media to object storage (S3-compatible).
6. CogniChronicle emits xAPI statements for every learner interaction.
