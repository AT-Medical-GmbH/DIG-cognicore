/**
 * Typed Socket.io event definitions for the CogniCore realtime layer.
 *
 * These types are inlined here since realtime-gateway is a standalone service.
 * In a future refactor, consider extracting shared event types into
 * @cognicore/types so that client SDKs can import them directly.
 */

// ---------------------------------------------------------------------------
// Shared payload types
// ---------------------------------------------------------------------------

export interface CaptionSegmentPayload {
  id: string;
  sessionId: string;
  text: string;
  language: string;
  startTime: number;
  endTime: number;
  isFinal: boolean;
}

export interface PollPayload {
  id: string;
  sessionId: string;
  type: 'MULTIPLE_CHOICE' | 'WORD_CLOUD' | 'RATING' | 'OPEN_ENDED';
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  question: string;
  options: string[];
}

export interface PollResultsPayload {
  pollId: string;
  totalResponses: number;
  counts: Record<string, number>;
}

export interface SignalPayload {
  id: string;
  sessionId: string;
  participantId: string;
  type: 'RAISE_HAND' | 'THUMBS_UP' | 'THUMBS_DOWN' | 'CONFUSED' | 'SPEED_UP' | 'SLOW_DOWN' | 'CUSTOM';
  message?: string;
  timestamp: string; // ISO-8601
}

export interface ParticipantPayload {
  participantId: string;
  displayName: string;
  role: 'HOST' | 'PRESENTER' | 'AUDIENCE';
}

export interface SessionStatePayload {
  sessionId: string;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';
  participantCount: number;
}

// ---------------------------------------------------------------------------
// Server → Client events
// ---------------------------------------------------------------------------

/**
 * Events that the server emits to connected clients.
 */
export interface ServerToClientEvents {
  /** A new (possibly interim) caption segment is available. */
  'caption:segment': (payload: CaptionSegmentPayload) => void;

  /** A new poll has been created in the session. */
  'poll:created': (payload: PollPayload) => void;

  /** A poll has been activated (now accepting responses). */
  'poll:activated': (payload: PollPayload) => void;

  /** A poll has been closed; final results are attached. */
  'poll:closed': (payload: PollPayload & { results: PollResultsPayload }) => void;

  /** Live poll results update (emitted while poll is ACTIVE). */
  'poll:results': (payload: PollResultsPayload) => void;

  /** A new audience signal arrived (presenter sees this). */
  'signal:new': (payload: SignalPayload) => void;

  /** A signal was dismissed by the presenter. */
  'signal:dismissed': (signalId: string) => void;

  /** All signals were cleared (e.g., after a reset phase). */
  'signal:cleared': (sessionId: string) => void;

  /** A participant joined the session. */
  'participant:joined': (payload: ParticipantPayload) => void;

  /** A participant left the session. */
  'participant:left': (participantId: string) => void;

  /** Session state changed (status, participant count). */
  'session:state': (payload: SessionStatePayload) => void;

  /** Generic error from the server. */
  'error': (message: string) => void;
}

// ---------------------------------------------------------------------------
// Client → Server events
// ---------------------------------------------------------------------------

/**
 * Events that clients send to the server.
 */
export interface ClientToServerEvents {
  /** Join a session room by its 6-digit code. */
  'session:join': (
    payload: { sessionCode: string; displayName: string; role: ParticipantPayload['role'] },
    ack: (response: { ok: boolean; error?: string; participantId?: string }) => void,
  ) => void;

  /** Leave the current session room. */
  'session:leave': (sessionCode: string) => void;

  /** Send an audience signal. */
  'signal:send': (
    payload: { sessionCode: string; type: SignalPayload['type']; message?: string },
    ack: (response: { ok: boolean; signalId?: string }) => void,
  ) => void;

  /** Submit a poll response. */
  'poll:respond': (
    payload: { pollId: string; value: string },
    ack: (response: { ok: boolean; error?: string }) => void,
  ) => void;
}

// ---------------------------------------------------------------------------
// Inter-server (Socket.io adapter) events
// ---------------------------------------------------------------------------

/** Events used between server nodes via the Redis adapter (socket.io-redis). */
export interface InterServerEvents {
  ping: () => void;
}

/** Data persisted on each socket instance. */
export interface SocketData {
  participantId: string;
  sessionCode: string;
  displayName: string;
  role: ParticipantPayload['role'];
}
