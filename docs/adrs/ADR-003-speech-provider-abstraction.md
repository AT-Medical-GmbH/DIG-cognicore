# ADR-003: Speech Provider Abstraction

**Status:** Accepted  
**Date:** 2025-01-01  
**Authors:** CogniCore Architecture Team  

## Context
CogniCaption must support multiple ASR backends (Azure, AWS Transcribe, local Whisper for CogniCell LocalLink) without coupling business logic to any single vendor SDK.

## Decision
Implement a **SpeechProvider interface** in `services/caption/`. Each provider implements `connect()`, `sendAudio(chunk)`, `onTranscript(handler)`, and `disconnect()`. The active provider is selected at runtime via environment variable.

## Rationale
- Vendor lock-in risk is mitigated; switching providers requires only an env change.
- CogniCell LocalLink can use Whisper with zero cloud dependency.
- Per-tenant provider override is possible via CogniControl.

## Alternatives Considered
- **Single vendor (Azure only):** Simpler but creates lock-in and prevents offline use.
- **Aggregation service (e.g., Deepgram):** Adds a third-party dependency and latency.

## Consequences
- **Positive:** Flexibility, offline support, competitive pricing leverage.
- **Negative:** Maintenance burden of multiple provider implementations.

## Implementation Notes
```typescript
interface SpeechProvider {
  connect(config: ProviderConfig): Promise<void>;
  sendAudio(chunk: Buffer): void;
  onTranscript(handler: (chunk: CaptionChunk) => void): void;
  disconnect(): Promise<void>;
}
```
Providers live in `services/caption/src/providers/`.
