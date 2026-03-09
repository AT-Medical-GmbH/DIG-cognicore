# CogniCore™ — Product Overview

> A product by AT Medical GmbH®

---

## Vision and Mission

### Vision

CogniCore™ envisions a world where every learning environment is truly inclusive — where every participant can follow, contribute, and engage regardless of language, ability, or device.

### Mission

To provide educators, presenters, and event organizers with a modular, open-standards platform that transforms passive audiences into active participants — in classrooms, lecture halls, conference rooms, hospitals, and beyond.

CogniCore™ is built on three founding principles:

| Principle | Description |
|---|---|
| **Interactive** | Every session is a two-way experience. Polls, Q&A, signals, and live reactions bring participants into the conversation. |
| **Integrative** | CogniCore™ integrates into existing workflows — LMS platforms, BigBlueButton installations, hospital information systems — without replacing them. |
| **Inclusive** | Live captions, multi-language translation, customizable display settings, and offline modes ensure no participant is left behind. |

---

## Target Audiences

### 🏫 Schools and Universities

CogniCore™ supports modern blended and hybrid learning models. Teachers can manage sessions, run polls, and receive real-time feedback on comprehension — while students follow along with captions in their preferred language.

**Key use cases:**
- Hybrid lecture delivery (in-room + remote students)
- Interactive seminars and workshops
- Accessible learning for students with hearing impairments
- Integration with Moodle for grade passback and completion tracking

### 🏥 Medical Education and Continuing Medical Education (CME)

Medical educators have demanding compliance and accessibility requirements. CogniCore™ supports:
- Accredited CME event delivery
- Simultaneous interpretation of keynotes
- Offline/local-network operation in hospital environments without public internet
- Secure recording and archival for review and compliance

### 🎤 Conferences and Events

Large-scale conferences benefit from CogniCore™'s ability to handle hundreds of simultaneous participants across multiple rooms, with live captioning, multi-track Q&A, and speaker support tools.

**Key use cases:**
- Keynote presentations with live captions
- Breakout sessions with real-time polls
- Audience Q&A management
- Post-event transcript export

### 📡 Hybrid Events

CogniCore™ is purpose-built for the complexity of hybrid events — where some participants are physically present and others join remotely. The system maintains a consistent experience across both cohorts.

### 🔒 Regulated and Sensitive Environments

For environments where internet access is restricted (classified facilities, clinical trials, private corporate events), CogniCore™'s **CogniCell LocalLink™** mode operates entirely on a local WLAN without any cloud connectivity.

---

## Key Differentiators

### 1. Modular Architecture
CogniCore™ is composed of named modules that can be licensed, deployed, and activated independently. Organizations pay only for what they use, and functionality can be extended incrementally.

### 2. Provider Abstraction for AI Services
Speech-to-text and translation services are provider-agnostic. Organizations can choose their preferred vendor (Azure, Deepgram, DeepL) or switch providers without changing their workflow or data model.

### 3. No App Installation Required
Participants join sessions through a standard web browser — on any device. No native app installation is required, reducing friction and support burden.

### 4. Per-Participant Personalization
Every participant can configure their own experience: font size, contrast mode, caption language, layout preferences. These settings persist across sessions.

### 5. Offline / Local WLAN Mode
CogniCell LocalLink™ enables full platform operation on a local Wi-Fi network without internet access — ideal for hospital wards, aircraft, remote locations, and high-security environments.

### 6. Open Standards Integration
CogniCore™ speaks LTI 1.3, supports Moodle natively, and can act as a companion system alongside BigBlueButton — fitting into existing educational IT infrastructure rather than replacing it.

### 7. Inclusive by Design
Accessibility is not an add-on. Live captions, translation, screen-reader support, and keyboard navigation are foundational features, not optional extras.

---

## Module Descriptions

CogniCore™ is organized into named capability modules:

| Module | Role |
|---|---|
| **CogniCompanion™** | The participant-facing experience layer. Delivers the session view, captions, interaction controls, and personalization on the participant's device. |
| **CogniCoordinator™** | The organizer and presenter layer. Manages events, sessions, participants, and live session controls from the admin and teacher interfaces. |
| **CogniConnect™** | The interaction engine. Powers polls, Q&A, audience signals (applause, confusion, speed up/down), and live reactions. |
| **CogniCaption™** | The accessibility layer. Provides live speech-to-text captions and real-time translation per participant's language preference. |
| **CogniCoach™** | The didactic support layer. Enables session reset (for re-runs), pace control, guided learning flows, and breakpoints. |
| **CogniCustom™** | The personalization layer. Allows each participant to configure display, language, and interaction settings independently. |
| **CogniCreator™** | The branding and layout engine. Manages themes, custom colors, logos, and layout templates for events and organizations. |
| **CogniCell LocalLink™** | The offline mode. Operates the full platform on a local WLAN router with no internet dependency. |
| **CogniCapture™** | The recording module. Manages official session recordings and personal local recording workflows. |
| **CogniChronicle™** | The archive module. Stores and exports transcripts, recordings, and session metadata in standard formats. |
| **CogniControl™** | The governance layer. Manages roles, permissions, content policies, and compliance controls across all modules. |

For detailed module specifications, see [Module Reference](modules.md).

---

## Deployment Modes

CogniCore™ supports multiple deployment modes to accommodate diverse organizational requirements:

### Standalone (Cloud / Self-Hosted)

The standard deployment mode. CogniCore™ services run as Docker containers on a cloud provider or on-premises server. All modules are available. Internet connectivity is required for AI-powered features (speech, translation) when using cloud providers.

```
Internet ──► Load Balancer ──► CogniCore™ Services ──► PostgreSQL + Redis
```

**Best for:** Universities, conference organizers, enterprises with existing cloud infrastructure.

### LMS-Embedded (LTI 1.3)

CogniCore™ is accessed directly from within an LMS (e.g., Moodle) via LTI 1.3. Users launch sessions without leaving their familiar learning environment. Grades and completion data are passed back automatically.

```
Moodle / LMS ──LTI 1.3 Launch──► CogniCore™ ──Grade Passback──► Moodle
```

**Best for:** Schools and universities already using Moodle or another LTI 1.3-compatible LMS.

### Offline / CogniCell LocalLink™

CogniCore™ operates entirely on a local Wi-Fi router. No internet access is required. Presentations are served from local storage (PDF-based offline mode or Gamma presentation format). AI features (speech, translation) can be powered by a locally hosted model if required.

```
Local Router (AP) ──► CogniCore™ (local server) ──► Participant Devices (WiFi)
```

**Best for:** Hospitals, aircraft, remote field sites, high-security environments, locations with unreliable internet.

### BigBlueButton Companion

CogniCore™ operates alongside an existing BigBlueButton installation. BBB handles formal video conferencing and attendance; CogniCore™ adds the interactive presentation layer, captions, and smartphone-based audience controls.

```
BBB Server ──► (video/audio) ──► Participant
CogniCore™ ──► (slides/captions/interaction) ──► Participant (second screen)
```

**Best for:** Institutions that have invested in BigBlueButton and want to extend its capabilities.
