# CogniCore™ Captions & Translation Pipeline

## Architecture

```
Microphone (Client)
       │ raw PCM / Opus
       ▼
CogniConnect (WebRTC)
       │ audio track
       ▼
CogniCaption Worker
  ├─ ASR Provider (Azure / AWS / Whisper)
  │       │ partial + final transcripts
  │       ▼
  ├─ Diarisation Engine (speaker labels)
  │       ▼
  ├─ Translation Engine (optional, DeepL / Azure Translator)
  │       ▼
  └─ Socket.io /caption namespace
            │
            ▼
       All Clients (CogniCaption UI overlay)
```

## ASR Providers

| Provider | Latency | Languages | Notes |
|---|---|---|---|
| Azure Cognitive Services | ~300 ms | 100+ | Default cloud provider |
| AWS Transcribe Streaming | ~400 ms | 35+ | Fallback |
| OpenAI Whisper (local) | ~800 ms | 99 | Used by CogniCell LocalLink |

Provider selection is configured per-tenant in **CogniControl**.

## Caption Chunk Schema

```typescript
interface CaptionChunk {
  sessionId: string;
  speakerId: string;
  speakerLabel: string;
  text: string;
  isFinal: boolean;
  startMs: number;
  endMs: number;
  confidence: number;
  language: string;        // BCP-47
  translatedText?: string; // present when translation enabled
  translatedLanguage?: string;
}
```

## Translation

- Translation runs **post-ASR** on final segments only to reduce cost.
- Supported engines: **DeepL API**, **Azure Translator**.
- Target language is set per-participant (user preference) or per-session (instructor override).
- Translations are stored in **CogniChronicle** alongside the source transcript.

## Accessibility

- Caption overlay supports WCAG 2.1 AA contrast ratios.
- Font size adjustable (12 px – 36 px).
- Caption export: VTT, SRT, plain-text TXT.
