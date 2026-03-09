/**
 * @fileoverview CogniCore™ config package public API.
 *
 * @example
 *   import { defaultAppConfig, defaultFeatureFlags } from '@cognicore/config';
 *   import type { FeatureFlags, AppConfig } from '@cognicore/config';
 */

export type {
  ApiConfig,
  FrontendConfig,
  DatabaseConfig,
  RedisConfig,
  StorageConfig,
  AppConfig,
} from './app.config.js';
export { defaultAppConfig } from './app.config.js';

export type { FeatureFlags } from './feature-flags.js';
export { defaultFeatureFlags } from './feature-flags.js';

export type { SessionSettings } from '@cognicore/types';
export { sessionConfig, defaultSessionSettings } from './session.config.js';

export type {
  SpeechProvider,
  BaseSpeechProviderConfig,
  AzureSpeechConfig,
  GoogleSpeechConfig,
  DeepgramSpeechConfig,
  SpeechProviderConfig,
  TranslationProvider,
  BaseTranslationProviderConfig,
  DeepLTranslationConfig,
  TranslationProviderConfig,
  ProvidersConfig,
} from './providers.config.js';
export {
  resolveSpeechConfig,
  resolveTranslationConfig,
} from './providers.config.js';
