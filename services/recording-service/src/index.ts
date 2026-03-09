import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import {
  startRecording,
  stopRecording,
  placeResetMarker,
  getRecording,
  getSessionRecordings,
  getRecordingMarkers,
  getRecordingDownloadUrl,
} from './recorder';

const PORT = process.env.PORT ?? 3005;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') ?? '*', credentials: true }));

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: '@cognicore/recording-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---------------------------------------------------------------------------
// Recording lifecycle
// ---------------------------------------------------------------------------

/** Start a recording for a session. */
app.post('/sessions/:sessionId/recordings', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const job = await startRecording(sessionId);
    res.status(201).json(job);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message });
  }
});

/** List all recordings for a session. */
app.get('/sessions/:sessionId/recordings', (req, res) => {
  const { sessionId } = req.params;
  res.json(getSessionRecordings(sessionId));
});

/** Get a specific recording. */
app.get('/recordings/:recordingId', (req, res) => {
  const job = getRecording(req.params.recordingId);
  if (!job) {
    res.status(404).json({ error: `Recording '${req.params.recordingId}' not found` });
    return;
  }
  res.json(job);
});

/** Stop an active recording. */
app.post('/recordings/:recordingId/stop', async (req, res) => {
  try {
    const job = await stopRecording(req.params.recordingId);
    res.json(job);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ ok: false, error: message });
  }
});

// ---------------------------------------------------------------------------
// Markers
// ---------------------------------------------------------------------------

/** Place a RESET marker at the current recording offset. */
app.post('/recordings/:recordingId/markers/reset', (req, res) => {
  try {
    const marker = placeResetMarker(req.params.recordingId);
    res.status(201).json(marker);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ ok: false, error: message });
  }
});

/** List all markers for a recording. */
app.get('/recordings/:recordingId/markers', (req, res) => {
  res.json(getRecordingMarkers(req.params.recordingId));
});

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------

/**
 * Get a download URL for a completed recording.
 * Optional query param ?phase=N returns a URL for a specific post-reset phase.
 */
app.get('/recordings/:recordingId/download', async (req, res) => {
  const phaseIndex = req.query.phase ? parseInt(req.query.phase as string, 10) : undefined;
  try {
    const url = await getRecordingDownloadUrl(req.params.recordingId, phaseIndex);
    res.json({ ok: true, url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ ok: false, error: message });
  }
});

createServer(app).listen(PORT, () => {
  console.log(`[recording-service] Listening on http://localhost:${PORT}`);
});
