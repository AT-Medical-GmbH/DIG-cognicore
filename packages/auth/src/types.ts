/**
 * @fileoverview Auth mode and identity type definitions for CogniCore™.
 *
 * CogniCore™ supports three authentication modes that control how a user
 * establishes identity before or during a session.
 */

import type { ParticipantRole } from '@cognicore/types';

// ---------------------------------------------------------------------------
// Auth modes
// ---------------------------------------------------------------------------

/**
 * Authentication mode used to access a CogniCore™ session.
 *
 * | Mode               | Description                                               |
 * |--------------------|-----------------------------------------------------------|
 * | `guest`            | Anonymous join – no credentials required.                 |
 * | `teacher-password` | Teacher unlocks elevated role with a session password.    |
 * | `profile`          | Full user profile authenticated via JWT / SSO.            |
 */
export type AuthMode = 'guest' | 'teacher-password' | 'profile';

// ---------------------------------------------------------------------------
// Auth identity
// ---------------------------------------------------------------------------

/**
 * Authenticated identity resolved after a successful auth flow.
 */
export interface AuthIdentity {
  /** Participant identifier assigned by the server. */
  participantId: string;
  /** The session this identity is scoped to. */
  sessionId: string;
  /** Role granted to this identity. */
  role: ParticipantRole;
  /** The auth mode used to establish this identity. */
  authMode: AuthMode;
  /** Display name – may be user-supplied or derived from profile. */
  displayName?: string;
  /** Expiry timestamp of the session token as a Unix epoch (seconds). */
  expiresAt: number;
}

// ---------------------------------------------------------------------------
// Auth results
// ---------------------------------------------------------------------------

/** Discriminated union returned by all auth operations. */
export type AuthResult =
  | { success: true; identity: AuthIdentity; token: string }
  | { success: false; error: AuthError };

/** Structured authentication error. */
export interface AuthError {
  /**
   * Machine-readable error code.
   *
   * | Code                  | Meaning                                    |
   * |-----------------------|--------------------------------------------|
   * | `INVALID_CODE`        | Session code not found or expired.         |
   * | `INVALID_PASSWORD`    | Teacher password mismatch.                 |
   * | `SESSION_ENDED`       | Session is no longer accepting joins.      |
   * | `CAPACITY_REACHED`    | Session is at max participant limit.       |
   * | `TOKEN_EXPIRED`       | Provided session token has expired.        |
   * | `UNAUTHORIZED`        | Action requires a higher role.             |
   */
  code:
    | 'INVALID_CODE'
    | 'INVALID_PASSWORD'
    | 'SESSION_ENDED'
    | 'CAPACITY_REACHED'
    | 'TOKEN_EXPIRED'
    | 'UNAUTHORIZED';
  /** Human-readable description for display or logging. */
  message: string;
}

// ---------------------------------------------------------------------------
// Teacher password policy
// ---------------------------------------------------------------------------

/**
 * Rules enforced when a teacher sets or changes their session password.
 */
export interface PasswordPolicy {
  /** Minimum password length. */
  minLength: number;
  /** Whether at least one digit is required. */
  requireDigit: boolean;
  /** Whether at least one uppercase letter is required. */
  requireUppercase: boolean;
  /** Whether at least one special character is required. */
  requireSpecialChar: boolean;
}

/** Default CogniCore™ password policy (permissive – suitable for live events). */
export const defaultPasswordPolicy: PasswordPolicy = {
  minLength: 4,
  requireDigit: false,
  requireUppercase: false,
  requireSpecialChar: false,
} as const;
