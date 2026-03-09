# ADR-004: Recording Model

**Status:** Accepted  
**Date:** 2025-01-01  
**Authors:** CogniCore Architecture Team  

## Context
CogniCapture needs a recording model that handles composite vs. per-track recording, supports GDPR erasure, and integrates with the transcript pipeline.

## Decision
Server-side composite recording using a **GStreamer pipeline** running as a sidecar to the mediasoup SFU. Output stored in S3-compatible object storage. Metadata (duration, participants, transcript path) stored in PostgreSQL.

## Rationale
- Server-side recording eliminates client-side upload variability.
- GStreamer provides production-grade media pipeline with hardware acceleration support.
- S3-compatible storage decouples CogniCore™ from any specific cloud provider.

## Alternatives Considered
- **Client-side recording (MediaRecorder API):** Unreliable; depends on client connection quality.
- **FFmpeg subprocess:** Simpler but less extensible for complex mixing scenarios.
- **Proprietary SFU recording (e.g., Janus):** Vendor lock-in; less control over output format.

## Consequences
- **Positive:** Consistent quality, GDPR-compliant deletion, transcript integration.
- **Negative:** GStreamer adds ~200 MB to the recorder Docker image.

## Implementation Notes
- Recorder service in `services/recorder/`.
- Recording lifecycle managed by `RecordingService` in `apps/api/`.
- GDPR erasure: `DELETE /api/recordings/:id` purges S3 objects and PostgreSQL rows.
