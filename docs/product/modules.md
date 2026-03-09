# CogniCore™ Module Reference

**Platform:** CogniCore™ | **Company:** AT Medical GmbH®

## Overview

CogniCore™ consists of 11 purpose-built modules that together deliver a complete AI-powered learning and conferencing platform.

---

## 1. CogniCompanion
AI-powered personal learning assistant. Provides real-time Q&A, contextual hints, and personalized study recommendations during and after sessions.

**Key Features:**
- Contextual AI chat tied to session transcripts
- Spaced-repetition flashcard generation
- Learning gap analysis

---

## 2. CogniCoordinator
Session orchestration and scheduling engine. Manages room lifecycle, participant coordination, and integration with external calendars.

**Key Features:**
- Multi-room scheduling
- Participant role management
- Calendar sync (iCal, Google, Outlook)

---

## 3. CogniConnect
WebRTC/Socket.io signalling layer. Handles peer connections, media negotiation, and real-time data channels.

**Key Features:**
- SFU/MCU topology support
- Adaptive bitrate control
- Sub-100 ms signalling latency

---

## 4. CogniCaption
Live captioning and subtitle engine. Streams ASR results to participants with speaker diarisation and confidence scoring.

**Key Features:**
- Multi-provider ASR (Azure, AWS, Whisper)
- Speaker labelling
- Word-level timing metadata

---

## 5. CogniCoach
Instructor analytics and coaching dashboard. Surfaces engagement metrics, pacing insights, and content-effectiveness scores.

**Key Features:**
- Real-time engagement heatmaps
- Pace and clarity scoring
- Post-session coaching reports

---

## 6. CogniCustom
White-labelling and theming engine. Allows institutions to apply brand colours, logos, and UI overrides without forking the platform.

**Key Features:**
- CSS variable injection
- Logo and favicon management
- Per-tenant theme storage

---

## 7. CogniCreator
Content authoring studio. Drag-and-drop builder for interactive slides, quizzes, and SCORM packages.

**Key Features:**
- SCORM 1.2 / 2004 export
- H5P content embedding
- AI-assisted slide generation

---

## 8. CogniCell LocalLink
Offline-capable edge node. Runs a stripped CogniCore stack on local hardware for bandwidth-constrained environments.

**Key Features:**
- SQLite fallback for offline operation
- Automatic sync on reconnect
- Raspberry Pi 4 / x86 NUC support

---

## 9. CogniCapture
Session recording and media pipeline. Captures composite video, per-track audio, and transcript artefacts.

**Key Features:**
- Server-side composite recording
- MP4 / WebM output
- Automatic chapter markers from transcript

---

## 10. CogniChronicle
Learning record store and xAPI/LRS hub. Persists all learner events for compliance and analytics.

**Key Features:**
- xAPI 1.0.3 conformant LRS
- GDPR-compliant data retention policies
- BI export (CSV, Parquet)

---

## 11. CogniControl
Platform administration console. Manages tenants, licenses, feature flags, and system health.

**Key Features:**
- Multi-tenant RBAC
- License key enforcement
- Real-time system health dashboard
