/**
 * Azure Cognitive Services Speech provider stub.
 *
 * Azure Speech supports true continuous real-time recognition via its
 * Speech SDK WebSocket connection, making it a good fit for low-latency
 * caption delivery (< 300 ms on a stable connection).
 *
 * TODO: Install the Azure Speech SDK: npm install microsoft-cognitiveservices-speech-sdk
 *
 * TODO: Implement using the SDK:
 *   import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
 *
 *   const speechConfig = sdk.SpeechConfig.fromSubscription(
 *     process.env.AZURE_SPEECH_KEY,
 *     process.env.AZURE_SPEECH_REGION,
 *   );
 *   speechConfig.speechRecognitionLanguage = language;
 *
 *   const pushStream = sdk.AudioInputStream.createPushStream();
 *   const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
 *
 *   const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
 *   recognizer.recognizing = (_, e) => this.emit({ ..., isFinal: false, text: e.result.text });
 *   recognizer.recognized  = (_, e) => this.emit({ ..., isFinal: true,  text: e.result.text });
 *   recognizer.startContinuousRecognitionAsync();
 *
 * TODO: Store { recognizer, pushStream } per sessionId for multi-session support.
 * TODO: Handle reconnection on network errors (Azure SDK fires sessionStopped).
 * TODO: Enable profanity filtering via speechConfig.setProfanity if required.
 * TODO: Add speaker diarization support (DiarizationConfig) once multi-speaker
 *       sessions are supported.
 */

import { CaptionSegmentEvent, SpeechProvider } from './provider.interface';

export class AzureSpeechProvider implements SpeechProvider {
  readonly name = 'azure';

  private readonly handlers: Array<(segment: CaptionSegmentEvent) => void> = [];
  private readonly activeSessions = new Set<string>();

  private readonly subscriptionKey = process.env.AZURE_SPEECH_KEY ?? '';
  private readonly region = process.env.AZURE_SPEECH_REGION ?? '';

  async startTranscription(sessionId: string, language: string): Promise<void> {
    if (!this.subscriptionKey || !this.region) {
      throw new Error('[azure-speech] AZURE_SPEECH_KEY or AZURE_SPEECH_REGION is not set');
    }
    if (this.activeSessions.has(sessionId)) return;

    this.activeSessions.add(sessionId);

    // TODO: Create SpeechRecognizer for this session (see above).
    console.log(`[azure-speech] Transcription started for session '${sessionId}' language=${language}`);
  }

  async stopTranscription(sessionId: string): Promise<void> {
    // TODO: Call recognizer.stopContinuousRecognitionAsync() for this session.
    // TODO: Close push stream to release resources.
    this.activeSessions.delete(sessionId);
    console.log(`[azure-speech] Transcription stopped for session '${sessionId}'`);
  }

  async pushAudio(sessionId: string, audioChunk: Buffer): Promise<void> {
    if (!this.activeSessions.has(sessionId)) return;
    // TODO: pushStream.write(audioChunk) for this session.
  }

  onSegment(handler: (segment: CaptionSegmentEvent) => void): void {
    this.handlers.push(handler);
  }

  private emit(segment: CaptionSegmentEvent): void {
    for (const handler of this.handlers) {
      try {
        handler(segment);
      } catch (err) {
        console.error('[azure-speech] Error in segment handler', err);
      }
    }
  }
}
