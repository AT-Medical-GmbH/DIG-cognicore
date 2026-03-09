/**
 * Translation provider interface for CogniCore's translation-gateway.
 *
 * All provider implementations must conform to this interface so that the
 * factory can swap them out based on the TRANSLATION_PROVIDER environment
 * variable without any changes to the consuming code.
 */

/**
 * Contract that every translation provider must implement.
 *
 * Providers are stateless — they receive text, hit an external API, and
 * return the translated result. Caching and rate-limiting are handled by
 * the gateway layer, not the provider implementations.
 */
export interface TranslationProvider {
  /** Human-readable name used in logs and metrics. */
  readonly name: string;

  /**
   * Translates a single text string from one language to another.
   *
   * @param text  The source text to translate.
   * @param from  BCP-47 language tag of the source language (e.g., 'en').
   *              Pass 'auto' to request automatic language detection (if supported).
   * @param to    BCP-47 language tag of the target language (e.g., 'es').
   * @returns     The translated text.
   */
  translate(text: string, from: string, to: string): Promise<string>;

  /**
   * Translates an array of text strings in a single API call.
   *
   * Batch translation is more cost-effective and reduces round-trip latency
   * compared to calling translate() in a loop. Implementations should map
   * each input string to its translated counterpart, preserving order.
   *
   * @param texts  Array of source strings to translate.
   * @param from   Source language BCP-47 tag.
   * @param to     Target language BCP-47 tag.
   * @returns      Array of translated strings, same length and order as input.
   */
  translateBatch(texts: string[], from: string, to: string): Promise<string[]>;

  /**
   * Returns the list of BCP-47 language codes supported by this provider.
   * Used to validate target language selections in the UI language picker.
   *
   * TODO: Implement per-provider — each has slightly different supported sets.
   */
  getSupportedLanguages?(): Promise<string[]>;
}
