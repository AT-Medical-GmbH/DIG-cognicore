/**
 * @fileoverview CogniCore™ auth package public API.
 *
 * @example
 *   import { validatePasswordPolicy, generateSessionToken } from '@cognicore/auth';
 *   import type { AuthMode, AuthIdentity, AuthResult } from '@cognicore/auth';
 */

export type {
  AuthMode,
  AuthIdentity,
  AuthResult,
  AuthError,
  PasswordPolicy,
} from './types.js';
export { defaultPasswordPolicy } from './types.js';

export type { PasswordValidationResult } from './teacher-password.js';
export {
  hashTeacherPassword,
  verifyTeacherPassword,
  validatePasswordPolicy,
} from './teacher-password.js';

export type { SessionTokenPayload, TokenValidationResult } from './session-token.js';
export {
  generateSessionToken,
  validateSessionToken,
} from './session-token.js';
