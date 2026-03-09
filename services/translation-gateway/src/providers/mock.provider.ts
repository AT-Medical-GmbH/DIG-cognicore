/**
 * Mock translation provider — returns predictable fake translations for
 * local development, testing, and CI environments.
 *
 * The mock simply wraps each input with a language tag prefix so that
 * transliteration can be visually verified in the UI without real credentials.
 *
 * Example: translate("Hello world", "en", "es") → "[es] Hello world"
 */

import { TranslationProvider } from './provider.interface';

export class MockTranslationProvider implements TranslationProvider {
  readonly name = 'mock';

  async translate(text: string, from: string, to: string): Promise<string> {
    // Simulate a small network delay so the UI can be tested with realistic timing.
    await this.delay(50);
    return `[${to}] ${text}`;
  }

  async translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
    await this.delay(50);
    return texts.map((t) => `[${to}] ${t}`);
  }

  async getSupportedLanguages(): Promise<string[]> {
    // Return a representative subset for development purposes.
    return ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi', 'ru'];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
