/**
 * OpenAI Whisper speech provider stub.
 *
 * Whisper is a batch transcription model; real-time streaming requires
 * chunking audio into fixed-length buffers, sending each chunk via the
 * Audio Transcriptions API, and stitching results together.
 *
 * TODO: Implement chunked streaming using the approach below:
 *   1. Collect audio into ~5-second PCM chunks (configurable via WHISPER_CHUNK_MS).
 *   2. POST each chunk to https://api.openai.com/v1/audio/transcriptions
 *      with model=whisper-1 and response_format=verbose_json.
 *   3. Parse the verbose_json response for word-level timestamps.
 *   4. Emit CaptionSegmentEvent for each phrase/sentence boundary detected.
 *
 * Limitations to document for the team:
 *   - Whisper does not support true streaming; there will be a ~5 s latency floor.
 *   - Chunk boundaries can split words; implement a look-back overlap to heal them.
 *   - Cost is ~$0.006 / minute; add usage tracking via a Redis counter.
 */

import { CaptionSegmentEvent, SpeechProvider } from './provider.interface';

export class OpenAIWhisperProvider implements SpeechProvider {
  readonly name = 'openai-whisper';

  private readonly handlers: Array<(segment: CaptionSegmentEvent) => void> = [];
  private readonly activeSessions = new Set<string>();

  // TODO: Inject via constructor or ConfigService.
  private readonly apiKey = process.env.OPENAI_API_KEY ?? '';
  private readonly chunkMs = parseInt(process.env.WHISPER_CHUNK_MS ?? '5000', 10);
  private readonly model = process.env.WHISPER_MODEL ?? 'whisper-1';

  async startTranscription(sessionId: string, language: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('[openai-whisper] OPENAI_API_KEY is not set');
    }
    if (this.activeSessions.has(sessionId)) return;

    this.activeSessions.add(sessionId);

    // TODO: Initialize audio buffer collection for this session.
    // TODO: Start chunk flush timer (setInterval every this.chunkMs ms).
    // TODO: On each flush, POST audio to OpenAI and emit results.

    console.log(`[openai-whisper] Transcription started for session '${sessionId}' language=${language}`);
  }

  async stopTranscription(sessionId: string): Promise<void> {
    // TODO: Clear the chunk flush timer for this session.
    // TODO: Flush any remaining buffered audio before stopping.
    this.activeSessions.delete(sessionId);
    console.log(`[openai-whisper] Transcription stopped for session '${sessionId}'`);
  }

  async pushAudio(sessionId: string, audioChunk: Buffer): Promise<void> {
    if (!this.activeSessions.has(sessionId)) return;
    // TODO: Append audioChunk to per-session audio buffer.
    // TODO: If buffer exceeds this.chunkMs worth of audio, flush immediately.
  }

  onSegment(handler: (segment: CaptionSegmentEvent) => void): void {
    this.handlers.push(handler);
  }

  private emit(segment: CaptionSegmentEvent): void {
    for (const handler of this.handlers) {
      try {
        handler(segment);
      } catch (err) {
        console.error('[openai-whisper] Error in segment handler', err);
      }
    }
  }
}
