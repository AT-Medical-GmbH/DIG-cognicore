/**
 * Google Cloud Translation provider stub.
 *
 * Google Translate supports 130+ languages and is a good fallback for
 * languages not well-covered by DeepL (e.g., many Asian and African languages).
 *
 * TODO: Install the Google Cloud Translation SDK:
 *   npm install @google-cloud/translate
 *
 * TODO: Implement using the SDK (v2 basic):
 *   import { Translate } from '@google-cloud/translate/build/src/v2';
 *   const client = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });
 *
 *   async translate(text, from, to) {
 *     const [translation] = await client.translate(text, { from, to });
 *     return translation;
 *   }
 *
 *   async translateBatch(texts, from, to) {
 *     const [translations] = await client.translate(texts, { from, to });
 *     return translations;
 *   }
 *
 * TODO: For higher throughput, use the v3 Advanced client with batch requests.
 * TODO: Add Redis caching layer (same approach as DeepL provider).
 * TODO: Map 'auto' from-language to undefined so Google performs auto-detection.
 * TODO: Monitor quota; free tier allows 500k chars/month via API key.
 */

import { TranslationProvider } from './provider.interface';

export class GoogleTranslateProvider implements TranslationProvider {
  readonly name = 'google';

  private readonly apiKey = process.env.GOOGLE_TRANSLATE_API_KEY ?? '';

  async translate(text: string, from: string, to: string): Promise<string> {
    if (!this.apiKey) throw new Error('[google-translate] GOOGLE_TRANSLATE_API_KEY is not set');
    // TODO: const [translation] = await client.translate(text, { from, to });
    // TODO: return translation;
    throw new Error(`[google-translate] translate() not yet implemented for '${from}' → '${to}'`);
  }

  async translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
    if (!this.apiKey) throw new Error('[google-translate] GOOGLE_TRANSLATE_API_KEY is not set');
    // TODO: const [translations] = await client.translate(texts, { from, to });
    // TODO: return translations;
    throw new Error(`[google-translate] translateBatch() not yet implemented for '${from}' → '${to}'`);
  }

  async getSupportedLanguages(): Promise<string[]> {
    // TODO: return (await client.getLanguages()).map(l => l.code.toLowerCase());
    return [];
  }
}
