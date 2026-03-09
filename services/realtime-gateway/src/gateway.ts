/**
 * Main Socket.io gateway for CogniCore realtime features.
 *
 * Responsibilities:
 *  - Accept WebSocket connections from presenter and audience clients.
 *  - Manage session rooms (join / leave).
 *  - Forward signals, poll events, and caption segments to room members.
 *  - Track participant presence via the presence module (Redis-backed in prod).
 *  - Subscribe to Redis pub/sub channels published by api-core microservices.
 */

import type { Server } from 'socket.io';
import {
  joinSessionRoom,
  leaveSessionRoom,
  getRoomSize,
  broadcastToRoom,
  broadcastToPresenter,
  sessionRoom,
} from './rooms';
import {
  markOnline,
  markOffline,
  findBySocketId,
} from './presence';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './events';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/**
 * Registers all Socket.io event handlers on the server instance.
 * Call once after the server is created in index.ts.
 */
export function registerGateway(io: IoServer): void {
  // ---------------------------------------------------------------------------
  // TODO: Redis pub/sub integration
  // Subscribe to channels published by api-core services so that REST
  // operations (poll created, signal dismissed, etc.) are reflected in
  // real-time across all connected clients.
  //
  // Example:
  //   const sub = new Redis(process.env.REDIS_URL);
  //   sub.subscribe('poll:activated', 'signal:new', 'caption:segment');
  //   sub.on('message', (channel, message) => {
  //     const payload = JSON.parse(message);
  //     io.to(sessionRoom(payload.sessionCode)).emit(channel as any, payload);
  //   });
  // ---------------------------------------------------------------------------

  io.on('connection', (socket) => {
    console.log(`[gateway] Socket connected: ${socket.id}`);

    // -------------------------------------------------------------------------
    // session:join
    // -------------------------------------------------------------------------
    socket.on('session:join', async (payload, ack) => {
      const { sessionCode, displayName, role } = payload;

      // TODO: Validate sessionCode against api-core (HTTP call or Redis cache).
      // TODO: Validate auth token from socket.handshake.auth.token.

      const participantId = crypto.randomUUID();

      // Attach metadata to the socket for later use (disconnect cleanup, etc.).
      socket.data.participantId = participantId;
      socket.data.sessionCode = sessionCode;
      socket.data.displayName = displayName;
      socket.data.role = role;

      await joinSessionRoom(socket, sessionCode);

      markOnline({
        participantId,
        sessionCode,
        displayName,
        role,
        connectedAt: new Date().toISOString(),
        socketId: socket.id,
      });

      // Notify all room members that a new participant joined.
      const count = await getRoomSize(io, sessionCode);
      broadcastToRoom(io, sessionCode, 'participant:joined', { participantId, displayName, role });
      broadcastToRoom(io, sessionCode, 'session:state', {
        sessionId: sessionCode,
        status: 'ACTIVE', // TODO: read real status from Redis / api-core
        participantCount: count,
      });

      console.log(`[gateway] ${displayName} (${role}) joined session ${sessionCode}`);
      ack({ ok: true, participantId });
    });

    // -------------------------------------------------------------------------
    // session:leave
    // -------------------------------------------------------------------------
    socket.on('session:leave', async (sessionCode) => {
      await handleLeave(io, socket, sessionCode);
    });

    // -------------------------------------------------------------------------
    // signal:send
    // -------------------------------------------------------------------------
    socket.on('signal:send', async (payload, ack) => {
      const { sessionCode, type, message } = payload;
      const { participantId, displayName } = socket.data;

      if (!participantId) {
        ack({ ok: false, error: 'Not joined to a session' });
        return;
      }

      const signalId = crypto.randomUUID();
      const signalPayload = {
        id: signalId,
        sessionId: sessionCode,
        participantId,
        type,
        message,
        timestamp: new Date().toISOString(),
      };

      // Forward the signal to presenter sockets in the session.
      broadcastToPresenter(io, sessionCode, 'signal:new', signalPayload);

      // TODO: Persist signal via api-core REST call or direct Redis pub/sub.
      // TODO: Apply per-participant rate-limit before forwarding.

      console.log(`[gateway] Signal '${type}' from ${displayName} in ${sessionCode}`);
      ack({ ok: true, signalId });
    });

    // -------------------------------------------------------------------------
    // poll:respond
    // -------------------------------------------------------------------------
    socket.on('poll:respond', async (payload, ack) => {
      const { pollId, value } = payload;
      const { participantId, sessionCode } = socket.data;

      if (!participantId || !sessionCode) {
        ack({ ok: false, error: 'Not joined to a session' });
        return;
      }

      // TODO: Forward response to api-core via HTTP POST /sessions/:code/polls/:id/responses
      // TODO: After persisting, fetch updated results and emit poll:results to the room.
      // TODO: Enforce one-vote-per-participant guard.

      console.log(`[gateway] Poll response for ${pollId} from ${participantId}: ${value}`);
      ack({ ok: true });
    });

    // -------------------------------------------------------------------------
    // Disconnect cleanup
    // -------------------------------------------------------------------------
    socket.on('disconnect', async (reason) => {
      console.log(`[gateway] Socket disconnected: ${socket.id} (${reason})`);
      const { sessionCode } = socket.data;
      if (!sessionCode) return;

      await handleLeave(io, socket, sessionCode);
    });
  });
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function handleLeave(io: IoServer, socket: any, sessionCode: string): Promise<void> {
  const { participantId, displayName } = socket.data;

  if (participantId) {
    markOffline(sessionCode, participantId);
    broadcastToRoom(io, sessionCode, 'participant:left', participantId);

    const count = await getRoomSize(io, sessionCode);
    broadcastToRoom(io, sessionCode, 'session:state', {
      sessionId: sessionCode,
      status: 'ACTIVE', // TODO: read real status from Redis / api-core
      participantCount: Math.max(0, count - 1), // socket still technically in room
    });
  }

  await leaveSessionRoom(socket, sessionCode);
  console.log(`[gateway] ${displayName ?? socket.id} left session ${sessionCode}`);
}
