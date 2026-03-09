/**
 * @fileoverview Recording type definitions for CogniCore™.
 *
 * Session recordings capture the audio stream and, optionally, the
 * synchronized caption transcript. Recordings are stored in the configured
 * object storage and linked to their session.
 */

// ---------------------------------------------------------------------------
// Recording status
// ---------------------------------------------------------------------------

/**
 * Lifecycle status of a session recording.
 *
 * - `idle`        – Recording has not started.
 * - `recording`   – Actively capturing audio/video.
 * - `paused`      – Recording temporarily halted by the teacher.
 * - `processing`  – Upload/transcoding in progress after stop.
 * - `ready`       – Recording is available for playback/download.
 * - `failed`      – Recording could not be completed or processed.
 * - `deleted`     – Recording has been purged from storage.
 */
export type RecordingStatus =
  | 'idle'
  | 'recording'
  | 'paused'
  | 'processing'
  | 'ready'
  | 'failed'
  | 'deleted';

// ---------------------------------------------------------------------------
// Recording format
// ---------------------------------------------------------------------------

/**
 * Container format of the recording file.
 */
export type RecordingFormat = 'mp3' | 'mp4' | 'webm' | 'ogg';

// ---------------------------------------------------------------------------
// Recording entity
// ---------------------------------------------------------------------------

/**
 * Metadata for a CogniCore™ session recording.
 */
export interface Recording {
  /** Unique recording identifier (UUID v4). */
  id: string;
  /** The session this recording belongs to. */
  sessionId: string;
  /** Current processing/storage status. */
  status: RecordingStatus;
  /** Container format of the output file. */
  format: RecordingFormat;
  /** Duration in seconds – available once recording is `ready`. */
  durationSeconds?: number;
  /** File size in bytes – available once recording is `ready`. */
  fileSizeBytes?: number;
  /**
   * Signed URL for downloading or streaming the recording.
   * Only populated when `status === 'ready'`; may expire after a short TTL.
   */
  downloadUrl?: string;
  /** Whether a caption/transcript VTT file is included with this recording. */
  hasCaptionTrack: boolean;
  /** URL to the WebVTT caption track, if `hasCaptionTrack` is `true`. */
  captionTrackUrl?: string;
  /** Timestamp when the recording was initiated. */
  startedAt: Date;
  /** Timestamp when the recording was stopped. */
  stoppedAt?: Date;
  /** Timestamp when the recording became available (`status === 'ready'`). */
  readyAt?: Date;
}

// ---------------------------------------------------------------------------
// Recording configuration
// ---------------------------------------------------------------------------

/**
 * Per-session recording configuration set by the teacher before starting.
 */
export interface RecordingConfig {
  /** Whether to include the caption transcript as a VTT file. */
  includeCaptions: boolean;
  /** Whether to notify participants that the session is being recorded. */
  notifyParticipants: boolean;
  /** Preferred output format. Defaults to `'mp3'` for audio-only sessions. */
  preferredFormat: RecordingFormat;
  /**
   * Storage retention period in days. After this period the recording is
   * automatically purged. `0` means keep indefinitely.
   */
  retentionDays: number;
}
