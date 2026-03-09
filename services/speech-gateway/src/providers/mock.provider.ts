/**
 * Mock speech provider — generates fake caption segments at a fixed interval.
 *
 * This provider is used in local development and CI environments where real
 * STT credentials are unavailable. It simulates a realistic caption stream
 * so that the rest of the pipeline (realtime-gateway, translation-gateway,
 * captions persistence) can be exercised end-to-end without a live microphone.
 */

import { CaptionSegmentEvent, SpeechProvider } from './provider.interface';

const MOCK_PHRASES = [
  'Welcome to the presentation.',
  'Today we will cover three main topics.',
  'First, let us look at the current market landscape.',
  'Our product has grown significantly this quarter.',
  'The data shows a clear upward trend.',
  'Let me hand it over to questions.',
  'Thank you all for attending.',
];

const SEGMENT_INTERVAL_MS = 3_000;

interface MockSession {
  intervalHandle: ReturnType<typeof setInterval>;
  startTime: number;
  phraseIndex: number;
  language: string;
}

export class MockSpeechProvider implements SpeechProvider {
  readonly name = 'mock';

  private readonly sessions = new Map<string, MockSession>();
  private readonly handlers: Array<(segment: CaptionSegmentEvent) => void> = [];

  async startTranscription(sessionId: string, language: string): Promise<void> {
    if (this.sessions.has(sessionId)) {
      console.warn(`[mock-speech] Session '${sessionId}' already active, ignoring duplicate start`);
      return;
    }

    const startTime = Date.now();
    let phraseIndex = 0;

    const intervalHandle = setInterval(() => {
      const phrase = MOCK_PHRASES[phraseIndex % MOCK_PHRASES.length];
      const elapsedSeconds = (Date.now() - startTime) / 1000;

      // Emit an interim segment first (isFinal=false).
      const interim: CaptionSegmentEvent = {
        id: crypto.randomUUID(),
        sessionId,
        text: phrase.slice(0, Math.ceil(phrase.length / 2)) + '…',
        language,
        startTime: elapsedSeconds,
        endTime: elapsedSeconds + 0.5,
        isFinal: false,
      };
      this.emit(interim);

      // Emit the final segment 500 ms later.
      setTimeout(() => {
        const final: CaptionSegmentEvent = {
          id: crypto.randomUUID(),
          sessionId,
          text: phrase,
          language,
          startTime: elapsedSeconds,
          endTime: elapsedSeconds + (SEGMENT_INTERVAL_MS / 1000),
          isFinal: true,
        };
        this.emit(final);
      }, 500);

      phraseIndex++;
    }, SEGMENT_INTERVAL_MS);

    this.sessions.set(sessionId, { intervalHandle, startTime, phraseIndex, language });
    console.log(`[mock-speech] Started transcription for session '${sessionId}' (language: ${language})`);
  }

  async stopTranscription(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`[mock-speech] No active session '${sessionId}' to stop`);
      return;
    }
    clearInterval(session.intervalHandle);
    this.sessions.delete(sessionId);
    console.log(`[mock-speech] Stopped transcription for session '${sessionId}'`);
  }

  onSegment(handler: (segment: CaptionSegmentEvent) => void): void {
    this.handlers.push(handler);
  }

  private emit(segment: CaptionSegmentEvent): void {
    for (const handler of this.handlers) {
      try {
        handler(segment);
      } catch (err) {
        console.error('[mock-speech] Error in segment handler', err);
      }
    }
  }
}
