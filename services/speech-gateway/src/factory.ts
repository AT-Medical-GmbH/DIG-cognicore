/**
 * Provider factory for the speech-gateway.
 *
 * Reads SPEECH_PROVIDER from the environment and returns the appropriate
 * SpeechProvider implementation. All providers are singletons — the factory
 * returns the same instance on repeated calls for the same provider name.
 *
 * Supported values for SPEECH_PROVIDER:
 *   mock          — local development / CI (default)
 *   openai-whisper — OpenAI Whisper batch transcription
 *   azure          — Azure Cognitive Services Speech
 *   deepgram       — Deepgram Nova-2 streaming
 */

import { SpeechProvider } from './providers/provider.interface';
import { MockSpeechProvider } from './providers/mock.provider';
import { OpenAIWhisperProvider } from './providers/openai-whisper.provider';
import { AzureSpeechProvider } from './providers/azure.provider';
import { DeepgramProvider } from './providers/deepgram.provider';

let _instance: SpeechProvider | null = null;

/**
 * Returns (or creates) the singleton SpeechProvider instance based on
 * the SPEECH_PROVIDER environment variable.
 *
 * @throws {Error} If an unrecognised provider name is configured.
 */
export function getSpeechProvider(): SpeechProvider {
  if (_instance) return _instance;

  const providerName = (process.env.SPEECH_PROVIDER ?? 'mock').toLowerCase();

  switch (providerName) {
    case 'mock':
      _instance = new MockSpeechProvider();
      break;
    case 'openai-whisper':
      _instance = new OpenAIWhisperProvider();
      break;
    case 'azure':
      _instance = new AzureSpeechProvider();
      break;
    case 'deepgram':
      _instance = new DeepgramProvider();
      break;
    default:
      throw new Error(
        `[speech-factory] Unknown SPEECH_PROVIDER '${providerName}'. ` +
        `Valid options: mock, openai-whisper, azure, deepgram`,
      );
  }

  console.log(`[speech-factory] Initialised provider: ${_instance.name}`);
  return _instance;
}

/** Resets the singleton — useful for testing. */
export function resetSpeechProvider(): void {
  _instance = null;
}
