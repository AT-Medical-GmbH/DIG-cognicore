/**
 * @fileoverview Audience signal type definitions for CogniCore™.
 *
 * Audience signals allow participants to send real-time feedback to the
 * teacher without interrupting the session flow. Signals are aggregated
 * and displayed in the coach dashboard, and optionally on the beamer.
 *
 * Built-in signal types (inspired by session pedagogy):
 * - `explain`  – "Bitte nochmal erklären" (Begriff/Concept unclear)
 * - `pause`    – "Pause" (participants need a break)
 * - `water`    – "Wasser" (water/refreshment break request)
 * - `slower`   – "Langsamer" (please slow down)
 * - `question` – "Frage" (participant has a question; may include text)
 */

// ---------------------------------------------------------------------------
// Signal types
// ---------------------------------------------------------------------------

/**
 * The category of an audience signal.
 *
 * | Value      | German       | Purpose                                |
 * |------------|--------------|----------------------------------------|
 * | `explain`  | Begriff      | Concept needs re-explanation.          |
 * | `pause`    | Pause        | Participants request a break.          |
 * | `water`    | Wasser       | Participants need a water break.       |
 * | `slower`   | Langsamer    | Please slow down the pace.             |
 * | `question` | Frage        | Participant has a question (with text).|
 */
export type SignalType = 'explain' | 'pause' | 'water' | 'slower' | 'question';

// ---------------------------------------------------------------------------
// Signal entity
// ---------------------------------------------------------------------------

/**
 * A single audience signal submitted during a live session.
 */
export interface AudienceSignal {
  /** Unique signal identifier (UUID v4). */
  id: string;
  /** Parent session identifier. */
  sessionId: string;
  /** Identifier of the participant who submitted the signal. */
  participantId: string;
  /** The type of feedback. */
  type: SignalType;
  /**
   * Optional free-text message – required for `question` signals,
   * optional for other types to add context.
   */
  message?: string;
  /** Server-assigned timestamp of signal receipt. */
  timestamp: Date;
  /**
   * Whether the signal is currently visible in the coach dashboard.
   * Teachers can hide/dismiss individual signals.
   */
  visible: boolean;
}

// ---------------------------------------------------------------------------
// Aggregated signal counts
// ---------------------------------------------------------------------------

/**
 * Counts of active (visible) signals grouped by type, used for dashboard display.
 */
export type SignalCounts = Record<SignalType, number>;

/**
 * A coach-reset event that zeroes all signal counts for a session.
 * Published when the teacher manually resets or the auto-reset interval fires.
 */
export interface CoachResetEvent {
  /** The session whose counts were reset. */
  sessionId: string;
  /** ISO 8601 timestamp of the reset. */
  resetAt: Date;
  /** Whether the reset was triggered automatically by the interval timer. */
  automatic: boolean;
}
