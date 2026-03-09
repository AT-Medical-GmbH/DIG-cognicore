# ADR-006: Local Link Mode

**Status:** Accepted  
**Date:** 2025-01-01  
**Authors:** CogniCore Architecture Team  

## Context
AT Medical GmbH® serves customers in environments without reliable internet connectivity. A fully offline operational mode is required that syncs data when connectivity is restored.

## Decision
Create **CogniCell LocalLink** — a Docker Compose bundle running the full CogniCore™ stack on local hardware, using local PostgreSQL, Redis, MinIO, and Whisper ASR. Sync to cloud is handled by pg_logical replication and async S3 upload on reconnect.

## Rationale
- Offline-first design ensures session continuity regardless of WAN connectivity.
- Reusing the same codebase (with feature flags) avoids maintaining a separate product.
- pg_logical provides conflict-resolution-aware replication superior to file-based sync.

## Alternatives Considered
- **Lite client (no server):** Cannot support multi-participant sessions offline.
- **Service Worker caching only:** Insufficient for real-time media and ASR.
- **CouchDB sync:** Good offline story but introduces a second database technology.

## Consequences
- **Positive:** True offline capability, automatic sync, same UX as cloud version.
- **Negative:** Higher hardware requirements than a thin client; sync conflicts possible if node is offline > 30 days.

## Implementation Notes
- LocalLink Docker Compose in `apps/locallink/`.
- Feature flag `COGNICORE_MODE=locallink` enables Whisper ASR and disables cloud-only features.
- License heartbeat timeout: 30 days offline permitted.
