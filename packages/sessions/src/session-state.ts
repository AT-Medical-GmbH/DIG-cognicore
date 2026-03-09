/**
 * @fileoverview Session state machine for CogniCore™.
 *
 * Defines the allowed state transitions for a session's lifecycle and
 * provides guard functions to check whether a transition is valid.
 *
 * ```
 * pending ──► active ──► paused ──► active
 *    │           │                    │
 *    └──────────►└────────────────────┴──► ended
 * ```
 *
 * @remarks
 * TODO: Integrate with a proper state machine library (e.g. XState) once
 *       the full session service is scaffolded. The current implementation
 *       is a lightweight adjacency-map approach for early development.
 */

/**
 * Lifecycle status of a CogniCore™ session.
 * Mirrors `SessionStatus` from `@cognicore/types` to avoid a hard runtime dependency.
 */
type SessionStatus = 'pending' | 'active' | 'paused' | 'ended';

// ---------------------------------------------------------------------------
// Transition map
// ---------------------------------------------------------------------------

/**
 * Adjacency map of valid `SessionStatus` transitions.
 *
 * Key   = current status.
 * Value = set of statuses the session may move to.
 */
const VALID_TRANSITIONS = new Map<SessionStatus, ReadonlySet<SessionStatus>>([
  ['pending', new Set<SessionStatus>(['active', 'ended'])],
  ['active', new Set<SessionStatus>(['paused', 'ended'])],
  ['paused', new Set<SessionStatus>(['active', 'ended'])],
  ['ended', new Set<SessionStatus>()],
]);

// ---------------------------------------------------------------------------
// Guard functions
// ---------------------------------------------------------------------------

/**
 * Returns `true` if transitioning from `current` to `next` is allowed.
 *
 * @example
 *   canTransition('pending', 'active'); // true
 *   canTransition('ended', 'active');   // false
 */
export function canTransition(current: SessionStatus, next: SessionStatus): boolean {
  return VALID_TRANSITIONS.get(current)?.has(next) ?? false;
}

/**
 * Returns the set of valid next statuses from a given current status.
 *
 * @example
 *   getValidTransitions('active'); // Set { 'paused', 'ended' }
 */
export function getValidTransitions(current: SessionStatus): ReadonlySet<SessionStatus> {
  return VALID_TRANSITIONS.get(current) ?? new Set<SessionStatus>();
}

// ---------------------------------------------------------------------------
// Transition helpers
// ---------------------------------------------------------------------------

/**
 * Result of a state transition attempt.
 */
export type TransitionResult =
  | { success: true; newStatus: SessionStatus }
  | { success: false; reason: string };

/**
 * Applies a status transition, returning the new status or an error reason.
 *
 * @param current - The session's current status.
 * @param next    - The desired new status.
 * @returns A `TransitionResult` – always check `success` before using `newStatus`.
 *
 * @example
 *   const result = applyTransition('pending', 'active');
 *   if (result.success) session.status = result.newStatus;
 */
export function applyTransition(
  current: SessionStatus,
  next: SessionStatus,
): TransitionResult {
  if (canTransition(current, next)) {
    return { success: true, newStatus: next };
  }
  return {
    success: false,
    reason: `Invalid transition: '${current}' → '${next}'. Allowed: [${[...getValidTransitions(current)].join(', ')}].`,
  };
}

// ---------------------------------------------------------------------------
// Status predicates
// ---------------------------------------------------------------------------

/** Returns `true` if the session is currently accepting participants and interactions. */
export function isSessionLive(status: SessionStatus): boolean {
  return status === 'active';
}

/** Returns `true` if participants can join (i.e., session has not ended). */
export function canJoinSession(status: SessionStatus): boolean {
  return status === 'pending' || status === 'active' || status === 'paused';
}

/** Returns `true` if the session has concluded and its data is immutable. */
export function isSessionFinished(status: SessionStatus): boolean {
  return status === 'ended';
}
