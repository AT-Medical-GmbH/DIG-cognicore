# CogniCore™

**Interactive. Integrative. Inclusive.**

> A product by AT Medical GmbH®

[![CI](https://github.com/AT-Medical/DIG-cognicore/actions/workflows/ci.yml/badge.svg)](https://github.com/AT-Medical/DIG-cognicore/actions/workflows/ci.yml)
[![CodeQL](https://github.com/AT-Medical/DIG-cognicore/actions/workflows/codeql.yml/badge.svg)](https://github.com/AT-Medical/DIG-cognicore/actions/workflows/codeql.yml)
[![Corporate Identity](https://github.com/AT-Medical/DIG-cognicore/actions/workflows/corporate-identity.yml/badge.svg)](https://github.com/AT-Medical/DIG-cognicore/actions/workflows/corporate-identity.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Enterprise Standard](https://img.shields.io/badge/AT%20Medical-Enterprise%20Standard%20v1-blue)](./docs/governance/ABSCHLUSSBERICHT.md)
[![Changelog](https://img.shields.io/badge/changelog-keep%20a%20changelog-orange)](./CHANGELOG.md)

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
<!-- ========================================================= -->
<!--  HEADER                                                   -->
<!-- ========================================================= -->

<p align="center">

<img src="https://raw.githubusercontent.com/AT-Medical/ATMED-assets/main/assets/logos/svg/logo.svg" width="320">

# CogniCore™

### Interactive. Integrative. Inclusive.

**A product by AT Medical GmbH®**

</p>

---

# 🇩🇪 Deutsch

## Überblick

**CogniCore™** ist eine modulare Infrastrukturplattform zur Unterstützung moderner Wissensvermittlung in Unterricht, Fortbildung und wissenschaftlichen Veranstaltungen.

Das System erweitert klassische Präsentations- und Lernsysteme um eine **Interaktions-, Integrations- und Inklusionsebene**.

CogniCore wird als Produktplattform von **AT Medical GmbH®** entwickelt.

Das Ziel ist es, Vorträge, Präsentationen und Lehrveranstaltungen durch intelligente Funktionen zu erweitern:

- Live-Interaktion mit dem Publikum  
- Live-Untertitel und Übersetzung  
- hybride Teilnahme (Präsenz + Online)  
- strukturierte Session-Steuerung  
- didaktische Unterstützung während Vorträgen  
- barrierefreie Wissensvermittlung  

CogniCore ersetzt bestehende Systeme wie **PowerPoint, Gamma, Moodle oder BigBlueButton** nicht, sondern fungiert als **Infrastruktur-Layer darüber**.

---

## Grundprinzipien

CogniCore basiert auf drei Kernprinzipien:

### Interactive

Aktive Einbindung des Publikums während Präsentationen.

### Integrative

Nahtlose Integration mit bestehenden Lernplattformen und Präsentationssystemen.

### Inclusive

Barrierefreiheit durch Untertitel, Übersetzung und individuelle Anzeigeoptionen.

---

## Plattformmodule

CogniCore besteht aus mehreren Modulen, die gemeinsam eine Plattform bilden.

### CogniCompanion

Frontend-Erlebnisoberfläche für Teilnehmer und Dozenten.

Funktionen:

- Präsentationsviewer  
- Live-Interaktion  
- Untertitel  
- Smartphone-Remote  
- persönliche Einstellungen  

---

### CogniCoordinator

Event- und Sessionverwaltung.

Funktionen:

- Erstellung von Sessions  
- Veranstaltungsplanung  
- Rollenverwaltung  
- Moderationsfunktionen  

---

### CogniConnect

Publikumsinteraktion.

Funktionen:

- Fragen aus dem Publikum  
- Begriff-Alarm  
- Pace-Signal („langsamer sprechen“)  
- Live-Abstimmungen  
- Brainstorming-Antworten  

---

### CogniCaption

Live-Untertitel und Übersetzung.

Funktionen:

- Speech-to-Text  
- Mehrsprachige Untertitel  
- Transkriptgenerierung  

---

### CogniCoach

Didaktische Unterstützung während Präsentationen.

Beispiele:

- Aufmerksamkeitspausen  
- Reset-Mechanismen  
- Engagement-Impulse  

---

### CogniCustom

Individuelle Anpassung für Teilnehmer.

Funktionen:

- Spracheinstellungen  
- Anzeigeoptionen  
- Barrierefreiheit  

---

### CogniCreator

Layout- und Branding-Anpassungen.

Funktionen:

- Themes  
- Eventbranding  
- Dozentenlogos  

---

### CogniCell LocalLink

Lokaler Netzwerkmodus.

Ermöglicht Sessions innerhalb eines lokalen WLAN-Netzes ohne Internetverbindung.

---

### CogniCapture

Session-Aufzeichnung.

Funktionen:

- Präsentationsaufnahme  
- Audioaufzeichnung  
- Export für Teilnehmer  

---

### CogniChronicle

Transkriptarchiv.

Funktionen:

- Speicherung von Transkripten  
- Suche in Sitzungsverläufen  

---

### CogniControl

Rechte- und Zugriffssystem.

Funktionen:

- Moderation  
- Rollenverwaltung  
- Policy-Management  

---

## Einsatzbereiche

CogniCore kann eingesetzt werden in:

- Schulen  
- Universitäten  
- medizinischer Fortbildung  
- wissenschaftlichen Kongressen  
- hybriden Lehrveranstaltungen  
- internationalen Konferenzen  

---

## Technische Architektur

Empfohlene Technologiekomponenten:

Frontend

- Next.js
- React
- TypeScript
- TailwindCSS

Backend

- Node.js
- NestJS

Realtime Kommunikation

- WebSockets / Socket.io

Datenbank

- PostgreSQL
- Redis

Speech- und Übersetzungs-Services

- Whisper / OpenAI
- Azure Speech
- Deepgram
- DeepL

Deployment

- Docker
- GitHub Actions
- Cloud oder Self-Hosted

---

# 🇬🇧 English

## Overview

**CogniCore™** is a modular infrastructure platform designed to enhance modern teaching, conferences and knowledge transfer.

The platform adds **interaction, integration and accessibility layers** to existing presentation and learning systems.

CogniCore is developed as a product platform of **AT Medical GmbH®**.

The goal is to enhance presentations and lectures through intelligent capabilities:

- real-time audience interaction  
- live captions and translation  
- hybrid participation  
- structured session control  
- presenter assistance  
- accessible knowledge transfer  

CogniCore does not replace systems such as **PowerPoint, Gamma, Moodle or BigBlueButton**.  
Instead it functions as an **infrastructure layer on top of them**.

---

## Core Principles

CogniCore is built around three guiding principles.

### Interactive

Active audience participation during sessions.

### Integrative

Seamless integration with existing learning platforms and presentation systems.

### Inclusive

Accessibility through captions, translation and adaptive interfaces.

---

## Platform Modules

CogniCore consists of several modules forming a unified ecosystem.

### CogniCompanion

Frontend experience layer for participants and presenters.

Features include:

- presentation viewer  
- live interaction  
- captions  
- smartphone remote control  
- personalization  

---

### CogniCoordinator

Event and session management.

Responsibilities:

- session creation  
- event planning  
- role management  
- moderation workflows  

---

### CogniConnect

Audience interaction engine.

Capabilities:

- audience questions  
- clarification signals  
- pacing signals  
- live polls  
- brainstorming input  

---

### CogniCaption

Live captioning and translation.

Capabilities:

- speech-to-text  
- multilingual captions  
- transcript generation  

---

### CogniCoach

Teaching assistance.

Examples include:

- engagement resets  
- pacing assistance  
- structured breaks  

---

### CogniCustom

Participant personalization.

Includes:

- language settings  
- accessibility preferences  
- display options  

---

### CogniCreator

Branding and layout customization.

Allows:

- themes  
- event branding  
- instructor logos  

---

### CogniCell LocalLink

Local network mode.

Allows sessions to operate inside a local WiFi network without internet connectivity.

---

### CogniCapture

Session recording system.

Supports:

- presentation recording  
- audio capture  
- session exports  

---

### CogniChronicle

Transcript archive.

Stores:

- caption transcripts  
- searchable session logs  

---

### CogniControl

Access control and permissions.

Provides:

- moderation  
- role management  
- policy configuration  

---

## Typical Use Cases

CogniCore can be used in environments such as:

- schools  
- universities  
- medical education  
- scientific conferences  
- hybrid learning environments  
- corporate training  

---

## Technology Stack

Recommended architecture components:

Frontend

- Next.js
- React
- TypeScript
- TailwindCSS

Backend

- Node.js
- NestJS

Realtime

- WebSockets / Socket.io

Data Layer

- PostgreSQL
- Redis

Speech and Translation

- OpenAI Whisper
- Azure Speech
- Deepgram
- DeepL

Deployment

- Docker
- GitHub Actions
- cloud or self-hosted infrastructure

---

<!-- ========================================================= -->
<!-- FOOTER                                                    -->
<!-- ========================================================= -->

---

<p align="center">

**CogniCore™**

Interactive. Integrative. Inclusive.

A product by **AT Medical GmbH®**

</p>
