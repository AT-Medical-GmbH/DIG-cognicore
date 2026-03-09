import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { getTranslationProvider } from './factory';

const PORT = process.env.PORT ?? 3004;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') ?? '*', credentials: true }));

const provider = getTranslationProvider();

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: '@cognicore/translation-gateway',
    provider: provider.name,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Translates a single text string.
 *
 * POST /translate
 * Body: { text: string; from: string; to: string }
 *
 * TODO: Add request-level Redis cache keyed by hash(text + from + to).
 * TODO: Add rate limiting per calling service (keyed by X-Service-Id header).
 */
app.post('/translate', async (req, res) => {
  const { text, from, to } = req.body as { text?: string; from?: string; to?: string };

  if (!text || !from || !to) {
    res.status(400).json({ error: 'text, from, and to are required' });
    return;
  }

  try {
    const translated = await provider.translate(text, from, to);
    res.json({ ok: true, translated, from, to });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[translation-gateway] translate() error:', message);
    res.status(500).json({ ok: false, error: message });
  }
});

/**
 * Batch-translates an array of strings in a single request.
 *
 * POST /translate/batch
 * Body: { texts: string[]; from: string; to: string }
 *
 * TODO: Enforce a maximum batch size (e.g., 100 strings) to prevent abuse.
 */
app.post('/translate/batch', async (req, res) => {
  const { texts, from, to } = req.body as { texts?: string[]; from?: string; to?: string };

  if (!Array.isArray(texts) || texts.length === 0 || !from || !to) {
    res.status(400).json({ error: 'texts (non-empty array), from, and to are required' });
    return;
  }

  try {
    const translated = await provider.translateBatch(texts, from, to);
    res.json({ ok: true, translated, from, to, count: translated.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[translation-gateway] translateBatch() error:', message);
    res.status(500).json({ ok: false, error: message });
  }
});

/** Returns the list of BCP-47 language codes supported by the active provider. */
app.get('/languages', async (_req, res) => {
  try {
    const languages = (await provider.getSupportedLanguages?.()) ?? [];
    res.json({ ok: true, provider: provider.name, languages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message });
  }
});

createServer(app).listen(PORT, () => {
  console.log(`[translation-gateway] Listening on http://localhost:${PORT}`);
  console.log(`[translation-gateway] Active provider: ${provider.name}`);
});
