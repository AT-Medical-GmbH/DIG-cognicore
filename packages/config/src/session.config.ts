/**
 * @fileoverview Session-level default configuration for CogniCore™.
 *
 * These values are applied when a teacher creates a new session without
 * explicitly overriding individual settings.
 */

import type { SessionSettings } from '@cognicore/types';

/**
 * System-wide session configuration constants.
 */
export const sessionConfig = {
  /**
   * Length of the alphanumeric join code shown to participants.
   * Must stay at 6 to match `generateSessionCode()` in `@cognicore/sessions`.
   */
  sessionCodeLength: 6,

  /**
   * Maximum length of a session title.
   */
  maxTitleLength: 120,

  /**
   * Default interval in minutes after which the coach dashboard auto-resets
   * audience signal counts. Set to `0` to disable.
   */
  defaultResetIntervalMinutes: 30,

  /**
   * Default upper bound on concurrent participants.
   * `null` = unlimited (requires enterprise license).
   */
  defaultMaxParticipants: 500,

  /**
   * Inactivity timeout in minutes before a `paused` session auto-ends.
   */
  inactivityTimeoutMinutes: 120,

  /**
   * Maximum duration in hours for a single session before it is force-ended.
   */
  maxSessionDurationHours: 8,

  /**
   * Duration in seconds after which an idle participant socket is disconnected.
   */
  participantIdleTimeoutSeconds: 300,
} as const;

/**
 * Default `SessionSettings` applied to every new session.
 *
 * Individual teachers can override these in the session setup wizard.
 */
export const defaultSessionSettings: SessionSettings = {
  allowPolling: true,
  allowQuestions: true,
  captionsEnabled: false,
  recordingEnabled: false,
  translationEnabled: false,
  beamerMode: false,
  resetIntervalMinutes: sessionConfig.defaultResetIntervalMinutes,
  maxParticipants: sessionConfig.defaultMaxParticipants,
};
