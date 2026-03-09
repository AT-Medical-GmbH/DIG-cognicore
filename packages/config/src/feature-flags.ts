/**
 * @fileoverview CogniCore™ feature flag configuration.
 *
 * Feature flags gate capabilities at runtime and are evaluated from environment
 * variables so DevOps teams can enable/disable features without code changes.
 *
 * The runtime flags in `defaultFeatureFlags` reflect **instance-level** defaults;
 * per-license overrides are handled in `@cognicore/types` (`LicenseFeatures`).
 */

/**
 * Full set of CogniCore™ feature flags.
 *
 * Each flag controls a distinct product capability. Setting a flag to `false`
 * should gracefully disable the UI and reject related API calls.
 */
export interface FeatureFlags {
  /**
   * Live speech-to-text captioning via the configured ASR provider.
   * Requires a valid `SPEECH_PROVIDER_API_KEY`.
   */
  liveCaptions: boolean;

  /**
   * Real-time caption translation via the configured translation provider.
   * Requires `liveCaptions` to also be `true`.
   */
  translation: boolean;

  /**
   * Session recording to object storage.
   * Requires storage configuration to be set.
   */
  recording: boolean;

  /**
   * Poll creation and audience voting.
   */
  polling: boolean;

  /**
   * Audience signals (Begriff, Pause, Wasser, Langsamer, Frage).
   */
  audienceSignals: boolean;

  /**
   * Remote teacher control via the mobile companion app.
   */
  remote: boolean;

  /**
   * Aggregate analytics dashboard (session history, participation rates).
   */
  analytics: boolean;

  /**
   * CogniCell™ – AI-assisted slide analysis and in-session Q&A.
   * Requires an OpenAI-compatible API key.
   */
  cogniCell: boolean;

  /**
   * LTI 1.3 tool provider integration for LMS platforms.
   * Requires enterprise license.
   */
  lti: boolean;

  /**
   * Beamer (presenter display) mode for lecture rooms.
   */
  beamerMode: boolean;

  /**
   * Dark mode support in the UI.
   */
  darkMode: boolean;
}

/**
 * Reads a boolean environment variable.
 * Returns `defaultValue` when the variable is absent.
 * @internal
 */
function envBool(key: string, defaultValue: boolean): boolean {
  if (typeof process === 'undefined') return defaultValue;
  const val = process.env[key];
  if (val === undefined) return defaultValue;
  return val === 'true' || val === '1';
}

/**
 * Default feature flags resolved from environment variables.
 *
 * These defaults enable the core experience while gating advanced
 * (potentially cost-incurring) features behind explicit opt-in.
 */
export const defaultFeatureFlags: FeatureFlags = {
  liveCaptions: envBool('FEATURE_LIVE_CAPTIONS', false),
  translation: envBool('FEATURE_TRANSLATION', false),
  recording: envBool('FEATURE_RECORDING', false),
  polling: envBool('FEATURE_POLLING', true),
  audienceSignals: envBool('FEATURE_AUDIENCE_SIGNALS', true),
  remote: envBool('FEATURE_REMOTE', false),
  analytics: envBool('FEATURE_ANALYTICS', false),
  cogniCell: envBool('FEATURE_COGNI_CELL', false),
  lti: envBool('FEATURE_LTI', false),
  beamerMode: envBool('FEATURE_BEAMER_MODE', true),
  darkMode: envBool('FEATURE_DARK_MODE', true),
};
