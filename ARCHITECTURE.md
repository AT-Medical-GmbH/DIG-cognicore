# CogniCore™ Architecture

**Owner:** AT Medical GmbH® Architecture Team  
**Status:** Current  
**Last updated:** 2026-03-17

---

## 1. Overview

CogniCore™ is a modular, web-based platform for interactive, integrative, and inclusive learning and communication environments. It serves schools, universities, medical education institutions, conferences, and hybrid events.

The platform is built as a **TypeScript monorepo** (Turborepo + pnpm workspaces) consisting of a Next.js frontend, a NestJS backend, real-time workers, and AI-powered speech and translation services.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
│  Browser (Next.js)    Mobile PWA    CogniCell LocalLink™ Edge Node   │
└───────────────┬────────────────────────────┬────────────────────────┘
                │ HTTPS / WSS                │ LAN (offline)
┌───────────────▼────────────────────────────▼────────────────────────┐
│                       API Gateway / CDN                              │
│              (Nginx / Cloudflare / AWS ALB)                          │
└───┬────────────────┬───────────────────────┬─────────────────────────┘
    │                │                       │
┌───▼────┐    ┌──────▼──────┐         ┌──────▼──────┐
│  REST  │    │  Socket.io  │         │  Media SFU  │
│  API   │    │   Server    │         │ (mediasoup) │
│ NestJS │    │   NestJS    │         └─────────────┘
└───┬────┘    └──────┬──────┘
    │                │
┌───▼────────────────▼───────────────────────────────────────────────┐
│                          Service Mesh                               │
│  CogniCoordinator │ CogniCaption │ CogniCapture │ CogniChronicle   │
└───┬────────────────────────────────────────────┬───────────────────┘
    │                                            │
┌───▼──────────┐                        ┌────────▼──────────┐
│  PostgreSQL  │                        │      Redis         │
│  (Prisma)   │                        │  (pub/sub / cache)  │
└─────────────┘                        └────────────────────┘
```

---

## 3. Monorepo Structure

```
/
├── apps/
│   ├── web/            # Next.js 14 frontend (App Router)
│   ├── api/            # NestJS REST API + WebSocket server
│   └── locallink/      # CogniCell LocalLink™ offline edge node
├── packages/
│   ├── ui/             # Shared React component library
│   ├── types/          # Shared TypeScript type definitions
│   └── config/         # Shared configuration schemas
├── services/
│   ├── caption/        # CogniCaption™ ASR worker (speech-to-text)
│   └── recorder/       # CogniCapture™ media recording pipeline
├── configs/            # Automation and tooling configuration
├── docs/               # Architecture decision records (ADRs), API docs
├── metadata/           # Repository profile and tagging
├── scripts/            # Development and validation utilities
└── tests/              # Integration and end-to-end tests
```

---

## 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript |
| Backend API | NestJS 10, TypeScript, REST + WebSocket |
| Real-time | Socket.io 4, mediasoup 3 (WebRTC SFU) |
| Database | PostgreSQL 15, Prisma ORM |
| Cache / Pub-Sub | Redis 7 |
| Speech AI | Azure Cognitive Services, Deepgram, OpenAI Whisper |
| Translation | DeepL, Azure Translator |
| Auth | JWT, OAuth 2.0 / OIDC, LTI 1.3 |
| Monorepo tooling | Turborepo, pnpm workspaces |
| Infrastructure | Docker, docker-compose, Kubernetes (optional) |
| CI/CD | GitHub Actions |

---

## 5. AI/ML Pipeline

CogniCore™ integrates AI/ML capabilities for real-time speech processing and translation. All AI model integrations follow a provider-abstraction pattern, enabling hot-swapping of underlying models without changes to consumer code.

### 5.1 Speech Recognition (ASR)

```
Audio Input → CogniCaption Worker
    │
    ├── Azure Cognitive Services (default, cloud)
    ├── Deepgram (alternative, cloud)
    └── OpenAI Whisper (self-hosted option)
    │
    └── Transcript → Socket.io → Client (caption overlay)
```

### 5.2 Translation Pipeline

```
Transcript → CogniCaption Translation Module
    │
    ├── DeepL API (default)
    └── Azure Translator (fallback)
    │
    └── Translated Text → Socket.io → Client
```

### 5.3 Model Versioning and Provider Abstraction

- Provider selection is configured via environment variables (`CAPTION_PROVIDER`, `TRANSLATION_PROVIDER`).
- Each provider implements a common interface (`ISpeechProvider`, `ITranslationProvider`), defined in `packages/types/`.
- Model versions are pinned via provider SDK versions in `package.json` and tracked in `CHANGELOG.md`.
- New model integrations or upgrades must follow the AI/ML Model Request process (see `.github/ISSUE_TEMPLATE/model_request.md`).

---

## 6. Data Handling

### 6.1 Data Flow

1. Participant authenticates via JWT (OAuth2 / LTI 1.3).
2. Session metadata is persisted to PostgreSQL via Prisma ORM.
3. Audio streams are forwarded to CogniCaption workers via WebRTC / RTMP.
4. ASR transcripts are streamed back to clients via Socket.io over Redis pub/sub.
5. Composite recordings are stored in S3-compatible object storage.
6. xAPI learning analytics events are emitted to CogniChronicle.

### 6.2 Sensitive Data Considerations

- **Audio and transcripts** may contain personally identifiable information (PII) and, in medical education contexts, sensitive clinical discussions.
- **Recordings** are protected with signed URLs (HMAC-SHA256), token binding, and optional forensic watermarking.
- **Third-party AI providers** (Azure, Deepgram, OpenAI) receive audio/text data. Data processing agreements (DPAs) with all providers are required before production use.
- **xAPI analytics** must be anonymised or pseudonymised at the point of emission where possible.
- Medical education sessions may fall under GDPR Article 9 (special category data). Data classification must be assessed per deployment.

---

## 7. API Layer

- **REST API**: NestJS controllers, OpenAPI/Swagger documented. See `docs/api/README.md`.
- **WebSocket API**: Socket.io with namespace-based routing (`/session`, `/caption`, `/poll`).
- **LTI 1.3**: Deep-link and Resource Link Launch flows for Moodle and compatible LMS platforms.
- **Authentication**: All API endpoints require a valid JWT Bearer token except public health-check endpoints.
- **Rate limiting**: Applied at the API gateway and NestJS guard levels.

---

## 8. Testing Strategy

| Level | Tooling | Location |
|---|---|---|
| Unit | Jest (per package) | `*/src/**/*.spec.ts` |
| Integration | Jest + Supertest | `*/test/**/*.e2e-spec.ts` |
| End-to-end | Playwright (planned) | `tests/e2e/` |
| Type checking | `tsc --noEmit` | CI pipeline |
| Linting | ESLint + Prettier | CI pipeline |
| Security scanning | CodeQL (GitHub Advanced Security) | `.github/workflows/` |

CI pipeline is defined in `.github/workflows/ci-validation.yml` and runs on every pull request.

---

## 9. Infrastructure & Deployment

- **Docker**: Each service has a `Dockerfile`. `docker-compose.yml` is provided for local development.
- **Reverse proxy**: Nginx handles TLS termination and routing.
- **Environment configuration**: All secrets are injected via environment variables. See `.env.example` for required variables.
- **CogniCell LocalLink™**: Offline-capable edge node for schools with restricted internet access. Communicates with the main platform over a local Wi-Fi network.

---

## 10. GDPR & Medical Compliance

| Requirement | Implementation |
|---|---|
| Data minimisation | Only necessary participant data collected; analytics anonymised where possible |
| Right to erasure | Session recordings and personal data can be deleted via admin API |
| Data processor agreements | DPAs required with all third-party AI/ML providers |
| GDPR Article 22 (automated decisions) | ASR and translation outputs are informational only; no automated decisions affecting individuals are made without human review |
| Audit trail | All access events logged to CogniChronicle as xAPI statements |
| Encryption in transit | TLS 1.2+ enforced; WebRTC media encrypted with DTLS-SRTP |
| Encryption at rest | Database encryption and S3 bucket encryption enforced at infrastructure level |

---

## 11. Architecture Decision Records (ADRs)

Key architectural decisions are documented in `docs/adrs/`:

| ADR | Decision |
|---|---|
| ADR-001 | Monorepo structure with Turborepo |
| ADR-002 | Real-time transport (Socket.io + Redis) |
| ADR-003 | Speech provider abstraction pattern |
| ADR-004 | Recording model (WebRTC + FFmpeg) |
| ADR-005 | Moodle LTI 1.3 integration |
| ADR-006 | CogniCell LocalLink™ offline mode |
| ADR-007 | Database and ORM selection (PostgreSQL + Prisma) |

---

## 12. Further Reading

- [System Architecture Diagram](docs/architecture/system-architecture.md)
- [Real-time Architecture](docs/architecture/realtime.md)
- [Recording Architecture](docs/architecture/recording.md)
- [Captions and Translation](docs/architecture/captions-and-translation.md)
- [API Documentation](docs/api/README.md)
- [Security Model](docs/SECURITY_MODEL.md)
- [Anti-Restreaming Policy](docs/security/anti-restreaming.md)
- [Docker Deployment](docs/deployment/docker.md)
