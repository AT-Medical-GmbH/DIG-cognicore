/**
 * @fileoverview CogniCore™ sessions package public API.
 *
 * @example
 *   import { generateSessionCode, validateSessionCode } from '@cognicore/sessions';
 *   import { applyTransition, canJoinSession } from '@cognicore/sessions';
 */

export {
  generateSessionCode,
  validateSessionCode,
  normaliseSessionCode,
  CODE_ALPHABET,
  SESSION_CODE_LENGTH,
} from './session-code.js';

export type { TransitionResult } from './session-state.js';
export {
  canTransition,
  getValidTransitions,
  applyTransition,
  isSessionLive,
  canJoinSession,
  isSessionFinished,
} from './session-state.js';
