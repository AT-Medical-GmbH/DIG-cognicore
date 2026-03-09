/**
 * Room management utilities for the CogniCore realtime gateway.
 *
 * Each session maps to exactly one Socket.io room identified by its
 * 6-character session code. This module provides helpers to construct
 * consistent room names and manage membership.
 */

import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './events';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type IoSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/** Derives the Socket.io room name from a session code. */
export function sessionRoom(sessionCode: string): string {
  return `session:${sessionCode.toUpperCase()}`;
}

/**
 * Adds a socket to a session room and returns the room name.
 * Also joins a role-specific sub-room so that targeted broadcasts
 * (e.g., presenter-only updates) are efficient.
 *
 * TODO: Persist room membership to Redis so it survives gateway restarts.
 */
export async function joinSessionRoom(socket: IoSocket, sessionCode: string): Promise<string> {
  const room = sessionRoom(sessionCode);
  await socket.join(room);

  // Join a role-specific sub-room for targeted broadcasts.
  if (socket.data.role) {
    await socket.join(`${room}:${socket.data.role}`);
  }

  return room;
}

/**
 * Removes a socket from a session room (and its role sub-room).
 * TODO: Clean up Redis presence keys on leave.
 */
export async function leaveSessionRoom(socket: IoSocket, sessionCode: string): Promise<void> {
  const room = sessionRoom(sessionCode);
  await socket.leave(room);
  if (socket.data.role) {
    await socket.leave(`${room}:${socket.data.role}`);
  }
}

/**
 * Returns the number of sockets currently in a session room.
 * Used to maintain the participantCount field in SessionStatePayload.
 *
 * TODO: For horizontally-scaled deployments this must query the Redis adapter,
 *       not just the local server instance: io.in(room).fetchSockets()
 */
export async function getRoomSize(io: IoServer, sessionCode: string): Promise<number> {
  const room = sessionRoom(sessionCode);
  const sockets = await io.in(room).fetchSockets();
  return sockets.length;
}

/**
 * Broadcasts an event to all sockets in a session room except the sender.
 */
export function broadcastToRoom<Ev extends keyof ServerToClientEvents>(
  io: IoServer,
  sessionCode: string,
  event: Ev,
  ...args: Parameters<ServerToClientEvents[Ev]>
): void {
  // @ts-expect-error: variadic emit args are tricky with strict generics
  io.to(sessionRoom(sessionCode)).emit(event, ...args);
}

/**
 * Broadcasts an event only to HOST / PRESENTER sockets in a session.
 * Useful for signals and internal presenter dashboard updates.
 */
export function broadcastToPresenter<Ev extends keyof ServerToClientEvents>(
  io: IoServer,
  sessionCode: string,
  event: Ev,
  ...args: Parameters<ServerToClientEvents[Ev]>
): void {
  const room = sessionRoom(sessionCode);
  // @ts-expect-error: variadic emit args
  io.to(`${room}:HOST`).to(`${room}:PRESENTER`).emit(event, ...args);
}
