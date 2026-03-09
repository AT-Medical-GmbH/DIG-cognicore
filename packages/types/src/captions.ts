/**
 * @fileoverview Caption and translation type definitions for CogniCore™.
 *
 * CogniCore™ supports real-time speech-to-text captioning and translation
 * into 13 languages. Captions can be displayed in overlay, sidebar, or
 * full-screen modes with accessibility-first contrast settings.
 */

// ---------------------------------------------------------------------------
// Language support
// ---------------------------------------------------------------------------

/**
 * ISO 639-1 language codes supported for captioning and translation.
 *
 * | Code | Language   |
 * |------|------------|
 * | `de` | German     |
 * | `en` | English    |
 * | `fr` | French     |
 * | `es` | Spanish    |
 * | `it` | Italian    |
 * | `pt` | Portuguese |
 * | `nl` | Dutch      |
 * | `pl` | Polish     |
 * | `cs` | Czech      |
 * | `ru` | Russian    |
 * | `zh` | Chinese    |
 * | `ja` | Japanese   |
 * | `ar` | Arabic     |
 */
export type SupportedLanguage =
  | 'de'
  | 'en'
  | 'fr'
  | 'es'
  | 'it'
  | 'pt'
  | 'nl'
  | 'pl'
  | 'cs'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ar';

/** Human-readable display names for each supported language. */
export const supportedLanguageNames: Record<SupportedLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  cs: 'Čeština',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ar: 'العربية',
} as const;

// ---------------------------------------------------------------------------
// Caption segments
// ---------------------------------------------------------------------------

/**
 * A single recognized speech segment, as returned by the speech provider.
 *
 * Segments may be **interim** (still being refined by the ASR engine) or
 * **final** (committed and will not change).
 */
export interface CaptionSegment {
  /** Unique segment identifier (UUID v4). */
  id: string;
  /** Parent session identifier. */
  sessionId: string;
  /** The transcribed (or translated) text of this segment. */
  text: string;
  /** ISO 639-1 language code of the text content. */
  language: SupportedLanguage;
  /** Start time offset in milliseconds from session start. */
  startTime: number;
  /** End time offset in milliseconds – `undefined` while the segment is interim. */
  endTime?: number;
  /**
   * `true` once the ASR engine has committed this segment.
   * Interim segments should be rendered differently (e.g. italic).
   */
  isFinal: boolean;
  /** Speaker diarisation label (e.g. `"Speaker_1"`), if supported by provider. */
  speakerId?: string;
  /**
   * Translated version of this segment, keyed by target language.
   * Populated asynchronously after the segment becomes final.
   */
  translations?: Partial<Record<SupportedLanguage, string>>;
}

// ---------------------------------------------------------------------------
// Caption display settings
// ---------------------------------------------------------------------------

/**
 * Participant-configurable caption display preferences.
 */
export interface CaptionSettings {
  /** Whether captions are currently shown in this participant's view. */
  enabled: boolean;
  /** Language in which the teacher is speaking. */
  sourceLanguage: SupportedLanguage;
  /** Language in which the participant wants to read captions. */
  outputLanguage: SupportedLanguage;
  /**
   * Preferred caption font size.
   *
   * | Value    | Approx. px |
   * |----------|-----------|
   * | `small`  | 14 px     |
   * | `medium` | 18 px     |
   * | `large`  | 24 px     |
   * | `xlarge` | 32 px     |
   */
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Colour contrast mode.
   * `high` renders white text on a solid black background (WCAG AA compliant).
   */
  contrast: 'normal' | 'high';
  /**
   * Where captions appear in the participant's UI.
   *
   * - `overlay`    – Translucent bar at the bottom of the main view.
   * - `sidebar`    – Scrolling transcript panel beside the main content.
   * - `fullscreen` – Full-screen caption-only view (accessibility mode).
   */
  displayMode: 'overlay' | 'sidebar' | 'fullscreen';
}
