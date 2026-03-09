import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { registerGateway } from './gateway';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './events';

const PORT = process.env.PORT ?? 3002;

// ---------------------------------------------------------------------------
// Express HTTP server (used for health checks and internal webhooks)
// ---------------------------------------------------------------------------
const app = express();

app.use(express.json());
app.use(
  cors({
    // TODO: Tighten to specific origins in production.
    origin: process.env.CORS_ORIGINS?.split(',') ?? '*',
    credentials: true,
  }),
);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: '@cognicore/realtime-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    // TODO: Report Redis connectivity status.
  });
});

// Internal endpoint called by api-core to push events into the realtime layer.
// Secured by a shared secret in production.
// TODO: Add HMAC signature verification middleware.
app.post('/internal/emit', (req, res) => {
  const { room, event, payload } = req.body as {
    room: string;
    event: string;
    payload: unknown;
  };

  if (!room || !event) {
    res.status(400).json({ error: 'room and event are required' });
    return;
  }

  // @ts-expect-error: dynamic event name
  io.to(room).emit(event, payload);
  res.json({ ok: true });
});

const httpServer = createServer(app);

// ---------------------------------------------------------------------------
// Socket.io server
// ---------------------------------------------------------------------------
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  httpServer,
  {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') ?? '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // TODO: Configure Redis adapter for horizontal scaling:
    //   import { createAdapter } from '@socket.io/redis-adapter';
    //   const pub = new Redis(process.env.REDIS_URL);
    //   const sub = pub.duplicate();
    //   io.adapter(createAdapter(pub, sub));
    transports: ['websocket', 'polling'],
    pingInterval: 25_000,
    pingTimeout: 20_000,
  },
);

// Register all event handlers.
registerGateway(io);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
httpServer.listen(PORT, () => {
  console.log(`[realtime-gateway] WebSocket server listening on ws://localhost:${PORT}`);
  console.log(`[realtime-gateway] Health check → http://localhost:${PORT}/health`);
});

export { io };
