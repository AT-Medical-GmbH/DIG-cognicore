# CogniCore™

**Interactive. Integrative. Inclusive.**

> A product by AT Medical GmbH®

CogniCore™ is a modular, web-based platform for interactive, integrative, and inclusive learning and communication environments. Designed for schools, universities, medical education, conferences, hybrid events, and live presentations with real-time interaction.

---

## Table of Contents

- [Overview](#overview)
- [Module Architecture](#module-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Local Development](#local-development)
- [Environment Setup](#environment-setup)
- [Available Applications](#available-applications)
- [Service Architecture](#service-architecture)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CogniCore™ provides a unified platform where presenters, educators, and event organizers can deliver engaging, accessible sessions — in-person, hybrid, or fully remote. Participants interact through their own devices (smartphones, tablets, laptops) without installing any native application.

Key capabilities:
- **Real-time interaction** — live polls, Q&A, audience signals, reactions
- **Live captions and translation** — per-participant language preferences via speech-to-text
- **Session management** — full event lifecycle from planning to archival
- **Offline/local WLAN** — CogniCell LocalLink™ for environments without internet
- **LMS integration** — LTI 1.3, Moodle plugin, grade passback
- **Recording and transcripts** — session recordings with full transcript archives

---

## Module Architecture

CogniCore™ is composed of named functional modules. Each module corresponds to a capability domain and maps to one or more frontend applications and backend services.

| Module | Description |
|---|---|
| **CogniCompanion™** | Frontend Experience Layer — the participant-facing web app (viewer, remote) |
| **CogniCoordinator™** | Administration, event planning, and session management (admin, teacher apps) |
| **CogniConnect™** | Real-time interaction: polls, Q&A, audience signals, reactions |
| **CogniCaption™** | Live subtitles and multi-language translation per participant |
| **CogniCoach™** | Didactic support tools: session reset, pace control, guided flows |
| **CogniCustom™** | Per-participant customization: font size, contrast, language, layout |
| **CogniCreator™** | Layout engine, branding configuration, and theme management |
| **CogniCell LocalLink™** | Local WLAN / offline operation mode for isolated environments |
| **CogniCapture™** | Session recording — official and personal recording pipelines |
| **CogniChronicle™** | Transcript and archive management — export to TXT, VTT, JSON |
| **CogniControl™** | Permissions, policies, role-based access, and compliance controls |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript |
| Design System | Custom design tokens, Tailwind CSS |
| Backend API | NestJS, TypeScript, REST + WebSocket |
| Realtime | Socket.io, Redis Pub/Sub |
| Database | PostgreSQL, Prisma ORM |
| Speech-to-Text | Provider abstraction (Azure Cognitive, Deepgram, Whisper) |
| Translation | Provider abstraction (DeepL, Azure Translator) |
| Recording | WebRTC, FFmpeg, S3-compatible storage |
| Auth | JWT, OAuth 2.0 / OIDC, LTI 1.3 |
| Monorepo | Turborepo, pnpm workspaces |
| Containerization | Docker, docker-compose |
| CI/CD | GitHub Actions |

---

## Repository Structure

```
DIG-cognicore/
├── apps/                          # Deployable frontend applications
│   ├── web-admin/                 # CogniCoordinator — admin & event management
│   ├── web-teacher/               # CogniCoordinator — presenter/teacher view
│   ├── web-viewer/                # CogniCompanion — participant viewer
│   ├── web-remote/                # CogniCompanion — participant remote/controller
│   └── web-landing/               # Public landing page
├── packages/                      # Shared internal libraries
│   ├── auth/                      # Authentication helpers, JWT utilities
│   ├── branding/                  # Brand tokens, logo assets
│   ├── config/                    # Shared configuration schemas
│   ├── design-tokens/             # Design system tokens
│   ├── sessions/                  # Session domain types and helpers
│   └── types/                     # Shared TypeScript types
├── services/                      # Backend microservices
│   ├── api-core/                  # Main REST API (NestJS)
│   ├── realtime-gateway/          # WebSocket/Socket.io gateway
│   ├── speech-gateway/            # Speech-to-text provider proxy
│   ├── translation-gateway/       # Translation provider proxy
│   └── recording-service/         # Recording orchestration
├── docs/                          # Project documentation
│   ├── product/                   # Product overview and module reference
│   ├── architecture/              # Technical architecture documents
│   ├── integrations/              # LMS and third-party integration guides
│   ├── deployment/                # Deployment and infrastructure guides
│   ├── security/                  # Security policies and architecture
│   ├── adrs/                      # Architecture Decision Records
│   └── api/                       # API reference documentation
├── turbo.json                     # Turborepo pipeline configuration
├── pnpm-workspace.yaml            # pnpm workspace configuration
├── package.json                   # Root package (dev tooling)
├── tsconfig.base.json             # Base TypeScript configuration
└── .env.example                   # Environment variable template
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Participant Devices                       │
│          Browser (web-viewer / web-remote / web-landing)        │
└────────────────────┬───────────────────────┬────────────────────┘
                     │ HTTPS/REST            │ WebSocket
┌────────────────────▼───────────────────────▼────────────────────┐
│                      API Gateway / Load Balancer                 │
└───┬────────────────────────────────┬────────────────────────────┘
    │                                │
┌───▼──────────────┐    ┌────────────▼──────────────┐
│   api-core        │    │   realtime-gateway         │
│   (NestJS REST)   │    │   (Socket.io)              │
│                   │    │                            │
│  - Auth/Sessions  │    │  - Room management         │
│  - Event CRUD     │    │  - Presence tracking       │
│  - Polls/Q&A      │    │  - Event broadcasting      │
└───┬───────────────┘    └────────────┬───────────────┘
    │                                 │
    │         ┌───────────────────────┘
    │         │
┌───▼─────────▼──────────────────────────────────────┐
│                  PostgreSQL + Redis                  │
│         (Persistent data + Pub/Sub cache)            │
└─────────────────────────────────────────────────────┘
    │                    │                    │
┌───▼────────┐  ┌────────▼──────┐  ┌─────────▼───────┐
│  speech-   │  │ translation-  │  │ recording-      │
│  gateway   │  │ gateway       │  │ service         │
│            │  │               │  │                 │
│ Azure/Deep │  │ DeepL/Azure   │  │ FFmpeg/S3       │
│ gram/Whis. │  │ Translator    │  │ WebRTC          │
└────────────┘  └───────────────┘  └─────────────────┘
```

---

## Local Development

### Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** ≥ 9.x
- **Docker** and **docker-compose** (for PostgreSQL, Redis)
- **Git**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/AT-Medical/DIG-cognicore.git
cd DIG-cognicore

# 2. Install dependencies
pnpm install

# 3. Start infrastructure services (PostgreSQL, Redis)
docker-compose up -d postgres redis

# 4. Copy and configure environment variables
cp .env.example .env
# Edit .env with your local configuration

# 5. Run database migrations
pnpm --filter @cognicore/api-core db:migrate

# 6. Start all development servers
pnpm dev

# Or start a specific app/service:
pnpm --filter @cognicore/web-viewer dev
pnpm --filter @cognicore/api-core start:dev
```

### Useful Commands

```bash
# Build all packages and apps
pnpm build

# Run all tests
pnpm test

# Lint all packages
pnpm lint

# Type-check all packages
pnpm typecheck

# Clean all build artifacts
pnpm clean
```

---

## Environment Setup

Copy `.env.example` to `.env` and configure the following key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `SPEECH_PROVIDER` | Speech-to-text provider (`azure`, `deepgram`, `whisper`) |
| `TRANSLATION_PROVIDER` | Translation provider (`deepl`, `azure`) |
| `S3_ENDPOINT` | S3-compatible storage endpoint |
| `S3_BUCKET` | Storage bucket name |
| `LTI_PLATFORM_URL` | LTI 1.3 platform (e.g., Moodle) URL |

See `.env.example` for the full list of configuration options.

---

## Available Applications

| App | Package | Description | Default Port |
|---|---|---|---|
| Admin | `@cognicore/web-admin` | Event and user management | 3001 |
| Teacher | `@cognicore/web-teacher` | Presenter control panel | 3002 |
| Viewer | `@cognicore/web-viewer` | Participant session view | 3003 |
| Remote | `@cognicore/web-remote` | Participant interaction remote | 3004 |
| Landing | `@cognicore/web-landing` | Public marketing landing page | 3005 |

---

## Service Architecture

| Service | Package | Description | Default Port |
|---|---|---|---|
| API Core | `@cognicore/api-core` | Main REST API (NestJS) | 4000 |
| Realtime Gateway | `@cognicore/realtime-gateway` | Socket.io WebSocket server | 4001 |
| Speech Gateway | `@cognicore/speech-gateway` | Speech-to-text proxy | 4002 |
| Translation Gateway | `@cognicore/translation-gateway` | Translation provider proxy | 4003 |
| Recording Service | `@cognicore/recording-service` | Recording orchestration | 4004 |

---

## Documentation

| Document | Description |
|---|---|
| [Product Overview](docs/product/overview.md) | Vision, audiences, key differentiators |
| [Module Reference](docs/product/modules.md) | Detailed module descriptions |
| [System Architecture](docs/architecture/system-architecture.md) | High-level architecture |
| [Realtime Architecture](docs/architecture/realtime.md) | WebSocket and Socket.io design |
| [Captions & Translation](docs/architecture/captions-and-translation.md) | Caption pipeline |
| [Recording Architecture](docs/architecture/recording.md) | Recording model |
| [Moodle Integration](docs/integrations/moodle.md) | Moodle setup guide |
| [LTI 1.3 Integration](docs/integrations/lti.md) | LTI 1.3 setup guide |
| [BigBlueButton Integration](docs/integrations/bigbluebutton.md) | BBB companion scenario |
| [LocalLink Deployment](docs/deployment/local-link.md) | Offline/local WLAN mode |
| [Docker Deployment](docs/deployment/docker.md) | Container deployment guide |
| [Anti-Restreaming Policy](docs/security/anti-restreaming.md) | Content protection policy |
| [ADR Index](docs/adrs/) | Architecture Decision Records |
| [API Reference](docs/api/README.md) | API documentation overview |

---

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests. All contributors are expected to follow the code of conduct and development guidelines.

---

## License

Copyright © AT Medical GmbH®. All rights reserved.

See [LICENSE](LICENSE) for details.
