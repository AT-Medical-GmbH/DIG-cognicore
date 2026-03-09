/**
 * @fileoverview Poll type definitions for CogniCore™.
 *
 * Supports six poll formats to cover a range of educational assessment needs:
 * Ja/Nein, Multiple Choice, ABCD (single-answer quiz), Freitext, Numerisch,
 * and Prozent (slider).
 */

// ---------------------------------------------------------------------------
// Poll format
// ---------------------------------------------------------------------------

/**
 * The interaction format of a poll.
 *
 * | Value             | German label | Description                           |
 * |-------------------|--------------|---------------------------------------|
 * | `yes-no`          | Ja/Nein      | Binary yes/no vote.                   |
 * | `multiple-choice` | Mehrfachwahl | Select one or more labeled options.   |
 * | `abcd`            | ABCD         | Single-answer labeled A–D quiz item.  |
 * | `free-text`       | Freitext     | Open text response.                   |
 * | `numeric`         | Numerisch    | Integer or decimal number entry.      |
 * | `percentage`      | Prozent      | 0–100 slider (e.g. confidence level). |
 */
export type PollType = 'yes-no' | 'multiple-choice' | 'abcd' | 'free-text' | 'numeric' | 'percentage';

// ---------------------------------------------------------------------------
// Poll lifecycle
// ---------------------------------------------------------------------------

/**
 * Lifecycle status of a poll.
 *
 * - `draft`     – Not yet shown to participants.
 * - `active`    – Accepting responses from participants.
 * - `closed`    – No longer accepting responses; results not yet visible.
 * - `published` – Results are visible to all participants.
 */
export type PollStatus = 'draft' | 'active' | 'closed' | 'published';

// ---------------------------------------------------------------------------
// Poll options
// ---------------------------------------------------------------------------

/**
 * A single selectable option within a `multiple-choice` or `abcd` poll.
 */
export interface PollOption {
  /** Stable identifier for this option (e.g. `"A"`, `"B"`, UUID). */
  id: string;
  /** Displayed label text. */
  label: string;
  /** For `abcd` polls – the letter identifier (A, B, C, D). */
  letter?: 'A' | 'B' | 'C' | 'D';
  /** Whether this option is the correct answer (for quiz scoring). */
  isCorrect?: boolean;
}

// ---------------------------------------------------------------------------
// Poll settings
// ---------------------------------------------------------------------------

/**
 * Configuration options that alter poll behaviour.
 */
export interface PollSettings {
  /** Whether to display the results chart to participants after voting. */
  showResultsToParticipants: boolean;
  /** Whether participant responses are anonymous (default: `true`). */
  anonymous: boolean;
  /** Optional time limit in seconds before the poll auto-closes. */
  timeLimitSeconds?: number;
  /**
   * For `multiple-choice` polls – maximum number of options a participant
   * may select. `undefined` means unlimited.
   */
  maxSelections?: number;
  /** For `numeric` polls – inclusive lower bound. */
  minValue?: number;
  /** For `numeric` polls – inclusive upper bound. */
  maxValue?: number;
}

// ---------------------------------------------------------------------------
// Poll results
// ---------------------------------------------------------------------------

/** Aggregated result for a single poll option. */
export interface PollOptionResult {
  /** References `PollOption.id`. */
  optionId: string;
  /** Raw count of responses selecting this option. */
  count: number;
  /** Percentage of total responses (0–100). */
  percentage: number;
}

/** Aggregated results across all responses for a poll. */
export interface PollResults {
  /** Total number of responses submitted. */
  totalResponses: number;
  /** Per-option breakdown (for `yes-no`, `multiple-choice`, `abcd` polls). */
  optionResults?: PollOptionResult[];
  /**
   * Statistical summary for `numeric` and `percentage` polls.
   */
  numericSummary?: {
    mean: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
  };
  /** Collected text answers for `free-text` polls. */
  textResponses?: string[];
}

// ---------------------------------------------------------------------------
// Poll entity
// ---------------------------------------------------------------------------

/**
 * A poll created within a CogniCore™ session.
 */
export interface Poll {
  /** Unique poll identifier (UUID v4). */
  id: string;
  /** Parent session identifier. */
  sessionId: string;
  /** The interaction format. */
  type: PollType;
  /** Current lifecycle status. */
  status: PollStatus;
  /** The question text displayed to participants. */
  question: string;
  /** Answer options – required for `multiple-choice` and `abcd` types. */
  options?: PollOption[];
  /** Behavioural configuration. */
  settings: PollSettings;
  /** Aggregated results – populated after the poll is closed. */
  results?: PollResults;
  /** Timestamp when the poll was created. */
  createdAt: Date;
  /** Timestamp when the poll was last activated (status → `active`). */
  activatedAt?: Date;
  /** Timestamp when the poll was closed. */
  closedAt?: Date;
}

// ---------------------------------------------------------------------------
// Poll response (individual submission)
// ---------------------------------------------------------------------------

/**
 * A single participant's response to a poll.
 */
export interface PollResponse {
  /** Unique response identifier. */
  id: string;
  /** The poll being responded to. */
  pollId: string;
  /** Responding participant (omitted if anonymous). */
  participantId?: string;
  /** Selected option IDs for `multiple-choice` / `abcd` / `yes-no`. */
  selectedOptionIds?: string[];
  /** Submitted text for `free-text` polls. */
  textValue?: string;
  /** Submitted number for `numeric` or `percentage` polls. */
  numericValue?: number;
  /** Timestamp of submission. */
  submittedAt: Date;
}
