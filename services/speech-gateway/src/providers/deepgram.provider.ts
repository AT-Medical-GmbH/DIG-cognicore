/**
 * Deepgram speech provider stub.
 *
 * Deepgram offers a real-time streaming STT WebSocket API that is well-suited
 * for live caption delivery. It supports interim results, speaker diarization,
 * and language detection out of the box.
 *
 * TODO: Install the Deepgram SDK: npm install @deepgram/sdk
 *
 * TODO: Implement using the SDK:
 *   import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
 *
 *   const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
 *   const connection = deepgram.listen.live({
 *     model: 'nova-2',
 *     language: language,
 *     smart_format: true,
 *     interim_results: true,
 *     utterance_end_ms: 1000,
 *   });
 *
 *   connection.on(LiveTranscriptionEvents.Transcript, (data) => {
 *     const alt = data.channel.alternatives[0];
 *     this.emit({
 *       id: crypto.randomUUID(),
 *       sessionId,
 *       text: alt.transcript,
 *       language: data.metadata.language ?? language,
 *       startTime: data.start,
 *       endTime: data.start + data.duration,
 *       isFinal: data.is_final,
 *     });
 *   });
 *
 * TODO: Handle LiveTranscriptionEvents.Error and reconnect with exponential backoff.
 * TODO: Store connection per sessionId for multi-session support.
 * TODO: Evaluate nova-2 vs nova-2-meeting models for presentation context accuracy.
 * TODO: Enable diarization (diarize: true) to distinguish speaker turns.
 */

import { CaptionSegmentEvent, SpeechProvider } from './provider.interface';

export class DeepgramProvider implements SpeechProvider {
  readonly name = 'deepgram';

  private readonly handlers: Array<(segment: CaptionSegmentEvent) => void> = [];
  private readonly activeSessions = new Set<string>();

  private readonly apiKey = process.env.DEEPGRAM_API_KEY ?? '';
  private readonly model = process.env.DEEPGRAM_MODEL ?? 'nova-2';

  async startTranscription(sessionId: string, language: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('[deepgram] DEEPGRAM_API_KEY is not set');
    }
    if (this.activeSessions.has(sessionId)) return;

    this.activeSessions.add(sessionId);

    // TODO: Open Deepgram live connection for this session.
    console.log(`[deepgram] Transcription started for session '${sessionId}' language=${language} model=${this.model}`);
  }

  async stopTranscription(sessionId: string): Promise<void> {
    // TODO: connection.finish() to gracefully close the WebSocket.
    this.activeSessions.delete(sessionId);
    console.log(`[deepgram] Transcription stopped for session '${sessionId}'`);
  }

  async pushAudio(sessionId: string, audioChunk: Buffer): Promise<void> {
    if (!this.activeSessions.has(sessionId)) return;
    // TODO: connection.send(audioChunk) for this session.
  }

  onSegment(handler: (segment: CaptionSegmentEvent) => void): void {
    this.handlers.push(handler);
  }

  private emit(segment: CaptionSegmentEvent): void {
    for (const handler of this.handlers) {
      try {
        handler(segment);
      } catch (err) {
        console.error('[deepgram] Error in segment handler', err);
      }
    }
  }
}
