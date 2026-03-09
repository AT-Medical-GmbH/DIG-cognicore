/**
 * Azure Cognitive Services Translator provider stub.
 *
 * Azure Translator supports 100+ languages and integrates well with other
 * Azure services (Speech, storage) making it an attractive option when the
 * platform is already Azure-hosted.
 *
 * TODO: Install the Azure SDK or use axios directly (no official Node SDK):
 *   The Azure Translator REST API is straightforward:
 *   POST https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from={from}&to={to}
 *   Headers: Ocp-Apim-Subscription-Key, Ocp-Apim-Subscription-Region
 *   Body: [{ Text: text }]
 *
 * TODO: Implement translate():
 *   const response = await axios.post(
 *     `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${from}&to=${to}`,
 *     [{ Text: text }],
 *     { headers: {
 *       'Ocp-Apim-Subscription-Key': this.subscriptionKey,
 *       'Ocp-Apim-Subscription-Region': this.region,
 *       'Content-Type': 'application/json',
 *     }},
 *   );
 *   return response.data[0].translations[0].text;
 *
 * TODO: translateBatch() can send up to 100 texts in a single request body.
 * TODO: Add Redis caching (same approach as DeepL/Google providers).
 * TODO: Handle 429 Too Many Requests with retry-after header backoff.
 */

import { TranslationProvider } from './provider.interface';

export class AzureTranslatorProvider implements TranslationProvider {
  readonly name = 'azure';

  private readonly subscriptionKey = process.env.AZURE_TRANSLATOR_KEY ?? '';
  private readonly region = process.env.AZURE_TRANSLATOR_REGION ?? '';

  async translate(text: string, from: string, to: string): Promise<string> {
    if (!this.subscriptionKey) throw new Error('[azure-translator] AZURE_TRANSLATOR_KEY is not set');
    // TODO: Implement REST call (see JSDoc above).
    throw new Error(`[azure-translator] translate() not yet implemented for '${from}' → '${to}'`);
  }

  async translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
    if (!this.subscriptionKey) throw new Error('[azure-translator] AZURE_TRANSLATOR_KEY is not set');
    // TODO: POST body: texts.map(t => ({ Text: t }))
    // TODO: Map response: data.map((r: any) => r.translations[0].text)
    throw new Error(`[azure-translator] translateBatch() not yet implemented for '${from}' → '${to}'`);
  }

  async getSupportedLanguages(): Promise<string[]> {
    // TODO: GET https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation
    return [];
  }
}
