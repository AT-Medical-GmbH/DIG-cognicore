/**
 * @fileoverview Real-time Socket.io event type definitions for CogniCore™.
 *
 * Provides a fully typed event map for use with `socket.io` and
 * `socket.io-client` so all realtime communication is compile-time safe.
 *
 * @example
 *   // Server (NestJS Gateway)
 *   import type { ServerToClientEvents, ClientToServerEvents } from '@cognicore/types';
 *   const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
 *
 *   // Client (Next.js / React)
 *   import { io } from 'socket.io-client';
 *   import type { ServerToClientEvents, ClientToServerEvents } from '@cognicore/types';
 *   const socket = io<ServerToClientEvents, ClientToServerEvents>(WS_URL);
 */

import type { Session, Participant, ParticipantRole } from './session.js';
import type { Poll, PollResponse } from './polling.js';
import type { AudienceSignal, CoachResetEvent } from './signals.js';
import type { CaptionSegment } from './captions.js';

// ---------------------------------------------------------------------------
// Server → Client events
// ---------------------------------------------------------------------------

/**
 * Events emitted by the CogniCore™ server to connected clients.
 */
export interface ServerToClientEvents {
  /**
   * Fires when session metadata changes (e.g. status, settings).
   * @param session – The updated session snapshot.
   */
  sessionUpdated: (session: Session) => void;

  /**
   * Fires when a new participant joins the session.
   * @param participant – The joining participant.
   */
  participantJoined: (participant: Participant) => void;

  /**
   * Fires when a participant leaves or times out.
   * @param participantId – ID of the departing participant.
   */
  participantLeft: (participantId: string) => void;

  /**
   * Fires when the teacher activates a new poll.
   * @param poll – The newly active poll.
   */
  pollStarted: (poll: Poll) => void;

  /**
   * Fires when the teacher closes a poll (no more responses accepted).
   * @param pollId – ID of the closed poll.
   */
  pollEnded: (pollId: string) => void;

  /**
   * Fires when poll results are published and visible to participants.
   * @param poll – The poll with populated `results`.
   */
  pollResultsPublished: (poll: Poll) => void;

  /**
   * Fires when a participant submits an audience signal.
   * Broadcast to teachers and moderators; not re-sent to all participants.
   * @param signal – The received signal.
   */
  signalReceived: (signal: AudienceSignal) => void;

  /**
   * Fires when the teacher resets (dismisses) all audience signal counts.
   * @param data – Reset event metadata.
   */
  coachReset: (data: CoachResetEvent) => void;

  /**
   * Fires for each speech recognition segment produced by the ASR provider.
   * Interim segments will be resent with `isFinal: true` once committed.
   * @param segment – The caption segment.
   */
  captionSegment: (segment: CaptionSegment) => void;

  /**
   * Generic error notification from the server.
   * @param error – Human-readable error message.
   */
  error: (error: { code: string; message: string }) => void;
}

// ---------------------------------------------------------------------------
// Client → Server events
// ---------------------------------------------------------------------------

/**
 * Events emitted by clients to the CogniCore™ server.
 */
export interface ClientToServerEvents {
  /**
   * Join a session using its 6-character code.
   * @param code – The session join code.
   * @param role – Requested participant role.
   * @param displayName – Optional display name for the participant.
   */
  joinSession: (code: string, role: ParticipantRole, displayName?: string) => void;

  /**
   * Leave the current session gracefully.
   */
  leaveSession: () => void;

  /**
   * Submit an audience signal to the teacher/coach dashboard.
   * @param signal – Signal data excluding server-generated fields.
   */
  submitSignal: (signal: Omit<AudienceSignal, 'id' | 'timestamp'>) => void;

  /**
   * Submit a response to the currently active poll.
   * @param response – Response data excluding the server-generated `id` and `submittedAt`.
   */
  submitPollResponse: (response: Omit<PollResponse, 'id' | 'submittedAt'>) => void;

  /**
   * Teacher: reset all signal counts for the session.
   */
  resetSignals: () => void;
}

// ---------------------------------------------------------------------------
// Inter-server events (for horizontal scaling)
// ---------------------------------------------------------------------------

/**
 * Events exchanged between Socket.io server instances via the adapter
 * (e.g. Redis adapter) for horizontal scaling.
 */
export interface InterServerEvents {
  /** Ping between instances for health-checking. */
  ping: () => void;
}

// ---------------------------------------------------------------------------
// Per-socket data
// ---------------------------------------------------------------------------

/**
 * Data attached to each individual socket connection.
 */
export interface SocketData {
  /** The authenticated participant associated with this socket. */
  participant: Participant;
  /** The session this socket is subscribed to. */
  sessionId: string;
}
