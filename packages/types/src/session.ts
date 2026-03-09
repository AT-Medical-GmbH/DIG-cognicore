/**
 * @fileoverview Core session and participant type definitions for CogniCore™.
 *
 * A **Session** represents a live meeting or class managed through CogniCore™.
 * Participants join via a 6-character `sessionCode` and are assigned a role
 * that determines their capabilities within the session.
 */

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

/**
 * Lifecycle status of a CogniCore™ session.
 *
 * - `pending`  – Session created but not yet started by the teacher.
 * - `active`   – Session is live; participants may interact.
 * - `paused`   – Teacher temporarily paused all interactions.
 * - `ended`    – Session has concluded; results are locked.
 */
export type SessionStatus = 'pending' | 'active' | 'paused' | 'ended';

/**
 * Information about the event or course context for the session.
 */
export interface EventInfo {
  /** Event or course title. */
  title: string;
  /** Main subject or topic of the event. */
  topic: string;
  /** ISO 8601 date string for the event. */
  date: string;
  /** Optional schedule / timetable description. */
  schedule?: string;
  /** Free-form notes for the teacher. */
  notes?: string;
}

/**
 * Information about the teacher or presenter hosting the session.
 */
export interface TeacherInfo {
  /** Full display name. */
  name: string;
  /** Job title or academic role (e.g. "Prof. Dr.", "Trainer"). */
  role: string;
  /** Organization or institution employing the teacher. */
  employer: string;
  /** Short biographical text shown in the beamer view. */
  bio?: string;
  /** URL to the teacher's profile photo. */
  photoUrl?: string;
  /** URL to the employer's logo (shown in participant view). */
  logoUrl?: string;
}

/**
 * Configurable behavioural settings for a session.
 *
 * All boolean flags default to `false` unless overridden by the teacher
 * or by the organization's license tier.
 */
export interface SessionSettings {
  /** Allow participants to vote in polls. */
  allowPolling: boolean;
  /** Allow participants to submit questions. */
  allowQuestions: boolean;
  /** Enable live caption generation via the speech provider. */
  captionsEnabled: boolean;
  /** Enable session recording. */
  recordingEnabled: boolean;
  /** Enable real-time translation of captions. */
  translationEnabled: boolean;
  /**
   * Activates the beamer (presenter) display mode –
   * shows session code QR, teacher info, and live stats.
   */
  beamerMode: boolean;
  /**
   * Interval in minutes after which the coach resets audience signal counts.
   * Set to `0` to disable automatic resets.
   */
  resetIntervalMinutes: number;
  /** Optional upper limit on the number of concurrent participants. */
  maxParticipants?: number;
}

/**
 * A CogniCore™ session entity.
 */
export interface Session {
  /** Unique session identifier (UUID v4). */
  id: string;
  /**
   * Human-readable 6-character alphanumeric join code shown to participants.
   * Example: `"ABC123"`.
   */
  sessionCode: string;
  /** Descriptive title set by the teacher. */
  title: string;
  /** Current lifecycle status. */
  status: SessionStatus;
  /** Optional context about the event or course. */
  eventInfo?: EventInfo;
  /** Optional presenter profile information. */
  teacherInfo?: TeacherInfo;
  /** Behavioural settings for this session. */
  settings: SessionSettings;
  /** ISO 8601 timestamp – when the session was first created. */
  createdAt: Date;
  /** ISO 8601 timestamp – last time session metadata was modified. */
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Participants
// ---------------------------------------------------------------------------

/**
 * Role of a participant within a session, controlling what actions they may perform.
 *
 * - `guest`      – Anonymous viewer; minimal interaction.
 * - `attendee`   – Named participant; can vote and submit signals.
 * - `teacher`    – Session owner; full control.
 * - `moderator`  – Delegated control; can manage polls and signals.
 * - `admin`      – Platform administrator; bypass all restrictions.
 */
export type ParticipantRole = 'guest' | 'attendee' | 'teacher' | 'moderator' | 'admin';

/**
 * A participant connected to a CogniCore™ session.
 */
export interface Participant {
  /** Unique participant identifier (UUID v4). */
  id: string;
  /** The session this participant belongs to. */
  sessionId: string;
  /** Role determining permissions within the session. */
  role: ParticipantRole;
  /** Optional display name chosen at join time. */
  displayName?: string;
  /** Timestamp when the participant joined. */
  joinedAt: Date;
  /** Timestamp of the participant's last interaction (for timeout tracking). */
  lastSeenAt?: Date;
}
