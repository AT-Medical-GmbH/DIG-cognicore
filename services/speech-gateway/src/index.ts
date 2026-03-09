import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { getSpeechProvider } from './factory';

const PORT = process.env.PORT ?? 3003;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') ?? '*', credentials: true }));

// Lazily initialise the provider and register the shared segment handler.
const provider = getSpeechProvider();

/**
 * Forward final caption segments to api-core for persistence and to the
 * realtime-gateway for live display.
 *
 * TODO: Replace console.log with actual HTTP POSTs to:
 *   - api-core: POST /sessions/:code/captions
 *   - realtime-gateway: POST /internal/emit  { room, event: 'caption:segment', payload }
 * TODO: Enqueue translation jobs on final segments if multilingual mode is enabled.
 */
provider.onSegment((segment) => {
  if (segment.isFinal) {
    console.log(`[speech-gateway] Final segment [${segment.sessionId}]: "${segment.text}"`);
    // TODO: await axios.post(`${process.env.API_CORE_URL}/sessions/${segment.sessionId}/captions`, segment);
  } else {
    console.log(`[speech-gateway] Interim segment [${segment.sessionId}]: "${segment.text}"`);
    // TODO: await axios.post(`${process.env.REALTIME_GATEWAY_URL}/internal/emit`, { room: `session:${segment.sessionId}`, event: 'caption:segment', payload: segment });
  }
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: '@cognicore/speech-gateway',
    provider: provider.name,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/** Start transcription for a session. */
app.post('/sessions/:sessionId/transcription/start', async (req, res) => {
  const { sessionId } = req.params;
  const { language = 'en-US' } = req.body as { language?: string };

  try {
    await provider.startTranscription(sessionId, language);
    res.json({ ok: true, sessionId, language });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[speech-gateway] Failed to start transcription for '${sessionId}':`, message);
    res.status(500).json({ ok: false, error: message });
  }
});

/** Stop transcription for a session. */
app.post('/sessions/:sessionId/transcription/stop', async (req, res) => {
  const { sessionId } = req.params;

  try {
    await provider.stopTranscription(sessionId);
    res.json({ ok: true, sessionId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[speech-gateway] Failed to stop transcription for '${sessionId}':`, message);
    res.status(500).json({ ok: false, error: message });
  }
});

/**
 * Receive raw audio chunks from the client (WebSocket preferred in production).
 *
 * TODO: Switch to WebSocket audio streaming for lower latency and simpler
 *       backpressure handling. HTTP POST chunked upload is a fallback.
 */
app.post('/sessions/:sessionId/audio', async (req, res) => {
  const { sessionId } = req.params;

  if (typeof provider.pushAudio !== 'function') {
    res.status(400).json({ ok: false, error: `Provider '${provider.name}' does not support pushAudio` });
    return;
  }

  try {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', async () => {
      const audioBuffer = Buffer.concat(chunks);
      await provider.pushAudio!(sessionId, audioBuffer);
      res.json({ ok: true, bytes: audioBuffer.byteLength });
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message });
  }
});

createServer(app).listen(PORT, () => {
  console.log(`[speech-gateway] Listening on http://localhost:${PORT}`);
  console.log(`[speech-gateway] Active provider: ${provider.name}`);
});
