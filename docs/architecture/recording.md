# CogniCore™ Recording Architecture

## Overview

**CogniCapture** handles all recording. It operates as a sidecar service alongside the media SFU and writes output to S3-compatible object storage.

## Architecture

```
mediasoup SFU
   │ RTP streams (per track)
   ▼
CogniCapture Recorder (GStreamer pipeline)
   ├─ Video compositor  → MP4 (H.264 / VP9)
   ├─ Audio mixer       → AAC / Opus
   └─ Transcript merge  → WebVTT chapter file
           │
           ▼
   Object Storage (S3 / MinIO)
           │
           ▼
   CogniChronicle (metadata & access log)
```

## Recording Modes

| Mode | Description |
|---|---|
| **Composite** | Single MP4 with all video tiles + mixed audio (default) |
| **Per-track** | Individual MP4 per participant (post-processing required) |
| **Audio-only** | MP3/AAC — lower storage, used for lecture-only sessions |
| **Transcript-only** | No media, WebVTT + JSON transcript only |

## Storage Policy

- Recordings stored in tenant-scoped S3 prefix: `s3://<bucket>/<tenantId>/<sessionId>/`.
- Default retention: **90 days** (configurable in CogniControl per tenant).
- GDPR right-to-erasure: deletion API purges all tracks, transcript, and CogniChronicle records.
- Recordings are encrypted at rest (AES-256) and in transit (TLS 1.3).

## Access Control

- Only participants with `recording:view` permission can stream or download recordings.
- Signed URLs expire after **4 hours**.
- Anti-restreaming controls apply (see `security/anti-restreaming.md`).

## Post-Processing

After session end, CogniCapture triggers an async post-processing job:
1. Transcode to web-optimised MP4 (H.264 Baseline, AAC 128 kbps).
2. Generate thumbnail at 10 s mark.
3. Merge WebVTT chapters from CogniCaption transcript.
4. Emit `recording.ready` xAPI statement to CogniChronicle.
