/**
 * @fileoverview Feature flag and license type definitions for CogniCore™.
 *
 * CogniCore™ uses a feature-flag system to gate capabilities by license tier.
 * Flags can be overridden per-organization via the admin panel.
 */

// ---------------------------------------------------------------------------
// License tiers
// ---------------------------------------------------------------------------

/**
 * Available CogniCore™ subscription tiers.
 *
 * | Tier         | Description                                           |
 * |--------------|-------------------------------------------------------|
 * | `free`       | Self-hosted evaluation; limited participants & features.|
 * | `starter`    | Core polling + signals for small teams.              |
 * | `professional` | Adds captions, translation, recording.             |
 * | `enterprise` | Unlimited, SLA, SSO, LTI, analytics, CogniCell.     |
 */
export type LicenseTier = 'free' | 'starter' | 'professional' | 'enterprise';

// ---------------------------------------------------------------------------
// License entity
// ---------------------------------------------------------------------------

/**
 * License assigned to an organization or instance.
 */
export interface License {
  /** Unique license key. */
  key: string;
  /** Subscribed tier. */
  tier: LicenseTier;
  /** Organization name the license is issued to. */
  organizationName: string;
  /**
   * Maximum number of concurrent participants across all sessions.
   * `null` means unlimited (enterprise).
   */
  maxConcurrentParticipants: number | null;
  /**
   * Maximum number of concurrent active sessions.
   * `null` means unlimited.
   */
  maxConcurrentSessions: number | null;
  /** ISO 8601 date string when the license expires. `null` = perpetual. */
  expiresAt: string | null;
  /** Enabled feature flags for this license. */
  features: LicenseFeatures;
}

// ---------------------------------------------------------------------------
// Feature flags
// ---------------------------------------------------------------------------

/**
 * Granular feature gates controlled by the license tier.
 */
export interface LicenseFeatures {
  /** Poll creation and voting. */
  polling: boolean;
  /** Audience signals (Begriff, Pause, Wasser, etc.). */
  audienceSignals: boolean;
  /** Live speech-to-text captioning. */
  liveCaptions: boolean;
  /** Real-time caption translation. */
  translation: boolean;
  /** Session audio/video recording. */
  recording: boolean;
  /** Remote teacher control (tablet companion app). */
  remote: boolean;
  /** Aggregate analytics dashboard. */
  analytics: boolean;
  /**
   * CogniCell™ – AI-assisted slide analysis and Q&A.
   * Enterprise-only feature.
   */
  cogniCell: boolean;
  /**
   * LTI 1.3 integration with LMS platforms (Moodle, Canvas, etc.).
   * Enterprise-only feature.
   */
  lti: boolean;
  /**
   * White-label branding (custom logo, colors, domain).
   * Enterprise-only feature.
   */
  whiteLabel: boolean;
  /** SSO / SAML integration. */
  sso: boolean;
}

/**
 * Default feature set for each license tier.
 * Used as the base when no custom overrides are present.
 */
export const tierDefaults: Record<LicenseTier, LicenseFeatures> = {
  free: {
    polling: true,
    audienceSignals: true,
    liveCaptions: false,
    translation: false,
    recording: false,
    remote: false,
    analytics: false,
    cogniCell: false,
    lti: false,
    whiteLabel: false,
    sso: false,
  },
  starter: {
    polling: true,
    audienceSignals: true,
    liveCaptions: false,
    translation: false,
    recording: false,
    remote: true,
    analytics: false,
    cogniCell: false,
    lti: false,
    whiteLabel: false,
    sso: false,
  },
  professional: {
    polling: true,
    audienceSignals: true,
    liveCaptions: true,
    translation: true,
    recording: true,
    remote: true,
    analytics: true,
    cogniCell: false,
    lti: false,
    whiteLabel: false,
    sso: false,
  },
  enterprise: {
    polling: true,
    audienceSignals: true,
    liveCaptions: true,
    translation: true,
    recording: true,
    remote: true,
    analytics: true,
    cogniCell: true,
    lti: true,
    whiteLabel: true,
    sso: true,
  },
} as const;
