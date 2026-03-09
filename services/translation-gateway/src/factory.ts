/**
 * Provider factory for the translation-gateway.
 *
 * Reads TRANSLATION_PROVIDER from the environment and returns the appropriate
 * TranslationProvider implementation. All providers are singletons.
 *
 * Supported values for TRANSLATION_PROVIDER:
 *   mock    — local development / CI (default)
 *   deepl   — DeepL API
 *   google  — Google Cloud Translation
 *   azure   — Azure Cognitive Services Translator
 */

import { TranslationProvider } from './providers/provider.interface';
import { MockTranslationProvider } from './providers/mock.provider';
import { DeepLProvider } from './providers/deepl.provider';
import { GoogleTranslateProvider } from './providers/google.provider';
import { AzureTranslatorProvider } from './providers/azure.provider';

let _instance: TranslationProvider | null = null;

/**
 * Returns (or creates) the singleton TranslationProvider instance.
 *
 * @throws {Error} If an unrecognised provider name is configured.
 */
export function getTranslationProvider(): TranslationProvider {
  if (_instance) return _instance;

  const providerName = (process.env.TRANSLATION_PROVIDER ?? 'mock').toLowerCase();

  switch (providerName) {
    case 'mock':
      _instance = new MockTranslationProvider();
      break;
    case 'deepl':
      _instance = new DeepLProvider();
      break;
    case 'google':
      _instance = new GoogleTranslateProvider();
      break;
    case 'azure':
      _instance = new AzureTranslatorProvider();
      break;
    default:
      throw new Error(
        `[translation-factory] Unknown TRANSLATION_PROVIDER '${providerName}'. ` +
        `Valid options: mock, deepl, google, azure`,
      );
  }

  console.log(`[translation-factory] Initialised provider: ${_instance.name}`);
  return _instance;
}

/** Resets the singleton — useful for testing. */
export function resetTranslationProvider(): void {
  _instance = null;
}
