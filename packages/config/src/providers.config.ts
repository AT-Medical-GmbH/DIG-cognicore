/**
 * @fileoverview Speech recognition and translation provider configuration interfaces.
 *
 * CogniCore™ is provider-agnostic for speech-to-text and translation.
 * Each provider is configured via environment variables and must satisfy
 * the interfaces below so the application can switch providers without
 * code changes.
 */

// ---------------------------------------------------------------------------
// Speech-to-text providers
// ---------------------------------------------------------------------------

/**
 * Supported speech-to-text (ASR) providers.
 *
 * | Value          | Service                       |
 * |----------------|-------------------------------|
 * | `azure`        | Azure Cognitive Speech Service |
 * | `google`       | Google Cloud Speech-to-Text    |
 * | `aws`          | Amazon Transcribe Streaming    |
 * | `deepgram`     | Deepgram Nova                  |
 * | `openai`       | OpenAI Whisper (batch/stream)  |
 */
export type SpeechProvider = 'azure' | 'google' | 'aws' | 'deepgram' | 'openai';

/** Base configuration shared by all speech providers. */
export interface BaseSpeechProviderConfig {
  /** Which provider to use. */
  provider: SpeechProvider;
  /** API key or access token (server-side only). */
  apiKey: string;
  /** Default source language for transcription (ISO 639-1). */
  defaultLanguage: string;
  /** Whether to enable speaker diarisation (if supported). */
  diarisationEnabled: boolean;
  /** Whether to return profanity-filtered transcripts. */
  filterProfanity: boolean;
}

/** Azure-specific speech configuration. */
export interface AzureSpeechConfig extends BaseSpeechProviderConfig {
  provider: 'azure';
  /** Azure region (e.g. `"westeurope"`). */
  region: string;
  /** Azure resource endpoint URL. */
  endpoint?: string;
}

/** Google Cloud Speech-specific configuration. */
export interface GoogleSpeechConfig extends BaseSpeechProviderConfig {
  provider: 'google';
  /** GCP project ID. */
  projectId: string;
}

/** Deepgram-specific configuration. */
export interface DeepgramSpeechConfig extends BaseSpeechProviderConfig {
  provider: 'deepgram';
  /** Deepgram model name (e.g. `"nova-2"`). */
  model: string;
  /** Deepgram API base URL (override for on-prem). */
  apiUrl?: string;
}

/** Union of all provider-specific config types. */
export type SpeechProviderConfig =
  | AzureSpeechConfig
  | GoogleSpeechConfig
  | DeepgramSpeechConfig
  | BaseSpeechProviderConfig;

// ---------------------------------------------------------------------------
// Translation providers
// ---------------------------------------------------------------------------

/**
 * Supported machine translation providers.
 *
 * | Value       | Service                        |
 * |-------------|--------------------------------|
 * | `deepl`     | DeepL Translate                |
 * | `azure`     | Azure Translator               |
 * | `google`    | Google Cloud Translation       |
 * | `openai`    | OpenAI GPT (prompt-based)      |
 */
export type TranslationProvider = 'deepl' | 'azure' | 'google' | 'openai';

/** Base configuration shared by all translation providers. */
export interface BaseTranslationProviderConfig {
  /** Which provider to use. */
  provider: TranslationProvider;
  /** API key (server-side only). */
  apiKey: string;
  /** Default target language when not specified by the participant. */
  defaultTargetLanguage: string;
}

/** DeepL-specific translation configuration. */
export interface DeepLTranslationConfig extends BaseTranslationProviderConfig {
  provider: 'deepl';
  /** `"free"` or `"pro"` API tier. */
  apiTier: 'free' | 'pro';
}

/** Union of all translation provider configs. */
export type TranslationProviderConfig =
  | DeepLTranslationConfig
  | BaseTranslationProviderConfig;

// ---------------------------------------------------------------------------
// Resolved provider config
// ---------------------------------------------------------------------------

/**
 * Combined provider configuration resolved at application startup.
 */
export interface ProvidersConfig {
  /** Active speech-to-text provider config. */
  speech: SpeechProviderConfig;
  /** Active translation provider config. */
  translation: TranslationProviderConfig;
}

/**
 * Resolves the speech provider configuration from environment variables.
 * @returns Partially-filled config; consumers should validate API keys exist.
 */
export function resolveSpeechConfig(): BaseSpeechProviderConfig {
  const provider = (process.env['SPEECH_PROVIDER'] ?? 'azure') as SpeechProvider;
  return {
    provider,
    apiKey: process.env['SPEECH_PROVIDER_API_KEY'] ?? '',
    defaultLanguage: process.env['SPEECH_DEFAULT_LANGUAGE'] ?? 'de',
    diarisationEnabled: process.env['SPEECH_DIARISATION'] === 'true',
    filterProfanity: process.env['SPEECH_FILTER_PROFANITY'] !== 'false',
  };
}

/**
 * Resolves the translation provider configuration from environment variables.
 * @returns Partially-filled config; consumers should validate API keys exist.
 */
export function resolveTranslationConfig(): BaseTranslationProviderConfig {
  const provider = (process.env['TRANSLATION_PROVIDER'] ?? 'deepl') as TranslationProvider;
  return {
    provider,
    apiKey: process.env['TRANSLATION_PROVIDER_API_KEY'] ?? '',
    defaultTargetLanguage: process.env['TRANSLATION_DEFAULT_LANGUAGE'] ?? 'en',
  };
}
