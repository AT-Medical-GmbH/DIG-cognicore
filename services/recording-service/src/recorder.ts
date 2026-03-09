/**
 * Recording manager for the CogniCore recording service.
 *
 * This module manages the lifecycle of session recordings:
 *   PENDING → RECORDING → PROCESSING → READY | FAILED
 *
 * Current implementation is a conceptual stub. In production this service
 * will coordinate WebRTC track ingestion (via mediasoup or similar SFU) and
 * FFmpeg-based muxing/processing.
 *
 * TODO: Integrate with a WebRTC SFU (e.g., mediasoup, LiveKit, or ion-sfu) to
 *       receive audio/video tracks from the presenter's browser.
 * TODO: Use fluent-ffmpeg (npm install fluent-ffmpeg) to mux WebM/Opus tracks
 *       into a single MP4 output with H.264 + AAC encoding.
 * TODO: Implement post-processing pipeline:
 *         raw WebM → FFmpeg transcode → MP4
 *                  → apply RESET phase cuts (markers.ts)
 *                  → upload to storage (storage.ts)
 *                  → update recording status in database
 * TODO: Emit recording:ready / recording:failed events via realtime-gateway
 *       so the presenter dashboard can trigger a download prompt.
 */

import { addMarker, getMarkers, getResetPhases, RecordingMarker } from './markers';
import { saveFile, getDownloadUrl, deleteFile, StorageObject } from './storage';

/** The possible states a recording can be in. */
export type RecordingStatus = 'PENDING' | 'RECORDING' | 'PROCESSING' | 'READY' | 'FAILED';

/** A recording job managed by this service. */
export interface RecordingJob {
  id: string;
  sessionId: string;
  status: RecordingStatus;
  /** Wall-clock timestamp when recording started. */
  startedAt?: Date;
  /** Wall-clock timestamp when recording stopped. */
  endedAt?: Date;
  /** Duration in seconds (set after processing). */
  durationSeconds?: number;
  /** Storage object once the file is saved. */
  storageObject?: StorageObject;
  /** Any error message if status is FAILED. */
  error?: string;
}

/** In-memory job store. TODO: Replace with Prisma. */
const jobs = new Map<string, RecordingJob>();

/**
 * Creates and starts a new recording job for a session.
 *
 * TODO: Validate that the session is in ACTIVE status before starting.
 * TODO: Signal the SFU to begin capturing the presenter track.
 * TODO: prisma.recording.create({ data: { sessionId, status: 'RECORDING', startedAt: new Date() } })
 */
export async function startRecording(sessionId: string): Promise<RecordingJob> {
  const existing = Array.from(jobs.values()).find(
    (j) => j.sessionId === sessionId && j.status === 'RECORDING',
  );
  if (existing) {
    console.warn(`[recorder] Session '${sessionId}' already has an active recording '${existing.id}'`);
    return existing;
  }

  const job: RecordingJob = {
    id: crypto.randomUUID(),
    sessionId,
    status: 'RECORDING',
    startedAt: new Date(),
  };

  jobs.set(job.id, job);
  console.log(`[recorder] Started recording '${job.id}' for session '${sessionId}'`);
  return job;
}

/**
 * Stops an active recording and triggers the processing pipeline.
 *
 * TODO: Signal SFU to stop capturing.
 * TODO: Kick off FFmpeg transcode job (async — set status PROCESSING).
 * TODO: On transcode complete, upload to storage and set status READY.
 * TODO: On failure, set status FAILED and capture error.message.
 */
export async function stopRecording(recordingId: string): Promise<RecordingJob> {
  const job = jobs.get(recordingId);
  if (!job) throw new Error(`[recorder] Recording '${recordingId}' not found`);
  if (job.status !== 'RECORDING') {
    throw new Error(`[recorder] Recording '${recordingId}' is not in RECORDING state (current: ${job.status})`);
  }

  const endedAt = new Date();
  const durationSeconds = (endedAt.getTime() - job.startedAt!.getTime()) / 1000;

  const updated: RecordingJob = { ...job, status: 'PROCESSING', endedAt, durationSeconds };
  jobs.set(recordingId, updated);

  console.log(`[recorder] Stopped recording '${recordingId}' (${durationSeconds.toFixed(1)}s). Processing...`);

  // Simulate async processing — in production this triggers FFmpeg.
  setTimeout(() => _finishProcessing(recordingId, durationSeconds), 100);

  return updated;
}

/**
 * Places a RESET marker at the current playback offset.
 * Called when the presenter resets audience data during a session.
 */
export function placeResetMarker(recordingId: string): RecordingMarker {
  const job = jobs.get(recordingId);
  if (!job) throw new Error(`[recorder] Recording '${recordingId}' not found`);

  const offsetSeconds = job.startedAt
    ? (Date.now() - job.startedAt.getTime()) / 1000
    : 0;

  return addMarker(recordingId, offsetSeconds, 'RESET', 'Audience data reset');
}

/** Retrieves all markers for a recording. */
export function getRecordingMarkers(recordingId: string): RecordingMarker[] {
  return getMarkers(recordingId);
}

/**
 * Retrieves the download URL for a completed recording.
 *
 * @param recordingId  The recording job ID.
 * @param phaseIndex   Optional 1-based phase index to download a specific
 *                     post-reset segment rather than the full recording.
 */
export async function getRecordingDownloadUrl(
  recordingId: string,
  phaseIndex?: number,
): Promise<string> {
  const job = jobs.get(recordingId);
  if (!job) throw new Error(`[recorder] Recording '${recordingId}' not found`);
  if (job.status !== 'READY') {
    throw new Error(`[recorder] Recording '${recordingId}' is not ready (status: ${job.status})`);
  }

  // TODO: If phaseIndex is provided, check markers, slice the timeline,
  //       and return a URL for the phase-specific clip.
  const key = job.storageObject?.key ?? `recordings/${job.sessionId}/${recordingId}.mp4`;
  return getDownloadUrl(key);
}

/** Returns a recording job by ID. */
export function getRecording(recordingId: string): RecordingJob | undefined {
  return jobs.get(recordingId);
}

/** Returns all recording jobs for a session. */
export function getSessionRecordings(sessionId: string): RecordingJob[] {
  return Array.from(jobs.values()).filter((j) => j.sessionId === sessionId);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function _finishProcessing(recordingId: string, durationSeconds: number): Promise<void> {
  const job = jobs.get(recordingId);
  if (!job) return;

  try {
    // TODO: Run actual FFmpeg transcode here.
    // Stub: create a placeholder file so the storage layer has something to reference.
    const key = `recordings/${job.sessionId}/${recordingId}.mp4`;
    const placeholder = Buffer.from(`[placeholder: recording ${recordingId}]`);
    const storageObject = await saveFile(key, placeholder, 'video/mp4');

    const ready: RecordingJob = { ...job, status: 'READY', durationSeconds, storageObject };
    jobs.set(recordingId, ready);
    console.log(`[recorder] Recording '${recordingId}' is READY. Key: ${key}`);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    jobs.set(recordingId, { ...job, status: 'FAILED', error });
    console.error(`[recorder] Recording '${recordingId}' FAILED:`, error);
  }
}
