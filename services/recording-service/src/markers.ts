/**
 * Marker system for the CogniCore recording service.
 *
 * A "marker" is a timestamped boundary event placed into a recording's
 * timeline. The primary use case is the "reset phase" feature: when a
 * presenter resets the audience data (signals, polls), a RESET marker is
 * inserted. During post-processing and export, segments before and after
 * each RESET marker can be split into separate clips or redacted.
 *
 * Future marker types may include:
 *   - CHAPTER: slide/section boundaries for chaptered playback
 *   - HIGHLIGHT: presenter-flagged moments for quick review
 *   - CENSORED: portions to mute/blur during processing
 */

/** The supported marker types. */
export type MarkerType = 'RESET' | 'CHAPTER' | 'HIGHLIGHT' | 'CENSORED';

/** A single marker placed on a recording timeline. */
export interface RecordingMarker {
  /** Unique identifier for this marker. */
  id: string;
  /** The recording this marker belongs to. */
  recordingId: string;
  /** Offset in seconds from the start of the recording. */
  offsetSeconds: number;
  /** The category of this marker. */
  type: MarkerType;
  /** Optional human-readable label (e.g., chapter title). */
  label?: string;
  /** Wall-clock time when the marker was placed. */
  createdAt: Date;
}

/** In-memory marker store. TODO: Replace with Prisma/database persistence. */
const markerStore = new Map<string, RecordingMarker[]>();

/**
 * Adds a marker to a recording's timeline.
 *
 * TODO: Persist via prisma.recordingMarker.create({ data: marker }).
 * TODO: After creating a RESET marker, notify api-core to dismiss all current
 *       signals and archive the current poll state, so the export pipeline
 *       can correctly partition data by phase.
 */
export function addMarker(
  recordingId: string,
  offsetSeconds: number,
  type: MarkerType,
  label?: string,
): RecordingMarker {
  const marker: RecordingMarker = {
    id: crypto.randomUUID(),
    recordingId,
    offsetSeconds,
    type,
    label,
    createdAt: new Date(),
  };

  const existing = markerStore.get(recordingId) ?? [];
  markerStore.set(recordingId, [...existing, marker].sort((a, b) => a.offsetSeconds - b.offsetSeconds));

  console.log(`[markers] Added ${type} marker at ${offsetSeconds}s for recording '${recordingId}'`);
  return marker;
}

/**
 * Returns all markers for a recording in chronological order.
 *
 * TODO: prisma.recordingMarker.findMany({ where: { recordingId }, orderBy: { offsetSeconds: 'asc' } })
 */
export function getMarkers(recordingId: string): RecordingMarker[] {
  return markerStore.get(recordingId) ?? [];
}

/**
 * Returns the RESET markers for a recording, used to partition the timeline
 * into "phases" for filtered exports.
 *
 * Each phase is the interval [previousResetOffset, nextResetOffset).
 * The final phase extends to the end of the recording.
 */
export function getResetPhases(
  recordingId: string,
  recordingDurationSeconds: number,
): Array<{ phase: number; startSeconds: number; endSeconds: number }> {
  const resetMarkers = getMarkers(recordingId).filter((m) => m.type === 'RESET');
  const boundaries = [0, ...resetMarkers.map((m) => m.offsetSeconds), recordingDurationSeconds];

  return boundaries.slice(0, -1).map((start, idx) => ({
    phase: idx + 1,
    startSeconds: start,
    endSeconds: boundaries[idx + 1],
  }));
}

/**
 * Removes all markers for a recording (e.g., when a recording is deleted).
 * TODO: prisma.recordingMarker.deleteMany({ where: { recordingId } })
 */
export function clearMarkers(recordingId: string): void {
  markerStore.delete(recordingId);
}
