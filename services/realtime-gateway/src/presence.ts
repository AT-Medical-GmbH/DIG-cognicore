/**
 * Participant presence tracking backed by Redis.
 *
 * Each connected participant is represented by a Redis hash keyed by
 * participantId with a TTL that is refreshed on heartbeat. This gives
 * the system a consistent view of who is online even across multiple
 * gateway replicas.
 *
 * TODO: Integrate with ioredis once Redis credentials are available.
 * TODO: Add heartbeat / TTL refresh mechanism (e.g., every 30 s).
 * TODO: Emit participant:joined / participant:left events from here
 *       rather than from the connection handler.
 */

export interface PresenceRecord {
  participantId: string;
  sessionCode: string;
  displayName: string;
  role: 'HOST' | 'PRESENTER' | 'AUDIENCE';
  connectedAt: string; // ISO-8601
  socketId: string;
}

/**
 * In-memory presence store used during development.
 * Structure: sessionCode → Map<participantId, PresenceRecord>
 */
const presenceStore = new Map<string, Map<string, PresenceRecord>>();

/**
 * Registers a participant as online in a session.
 *
 * TODO: Replace with:
 *   await redis.hSet(`presence:${sessionCode}:${participantId}`, record);
 *   await redis.expire(`presence:${sessionCode}:${participantId}`, 90);
 */
export function markOnline(record: PresenceRecord): void {
  if (!presenceStore.has(record.sessionCode)) {
    presenceStore.set(record.sessionCode, new Map());
  }
  presenceStore.get(record.sessionCode)!.set(record.participantId, record);
}

/**
 * Removes a participant from the online presence map.
 *
 * TODO: Replace with:
 *   await redis.del(`presence:${sessionCode}:${participantId}`);
 */
export function markOffline(sessionCode: string, participantId: string): void {
  presenceStore.get(sessionCode)?.delete(participantId);
}

/**
 * Returns all online participants for a session.
 *
 * TODO: Replace with:
 *   const keys = await redis.keys(`presence:${sessionCode}:*`);
 *   return Promise.all(keys.map(k => redis.hGetAll(k)));
 */
export function getOnlineParticipants(sessionCode: string): PresenceRecord[] {
  return Array.from(presenceStore.get(sessionCode)?.values() ?? []);
}

/**
 * Returns the count of online participants for a session.
 *
 * TODO: Replace with: await redis.keys(`presence:${sessionCode}:*`).length
 */
export function getOnlineCount(sessionCode: string): number {
  return presenceStore.get(sessionCode)?.size ?? 0;
}

/**
 * Finds a participant by their socket ID (used on disconnect to clean up).
 *
 * TODO: Maintain a reverse index socketId → participantId in Redis to avoid
 *       the O(n) scan below.
 */
export function findBySocketId(
  sessionCode: string,
  socketId: string,
): PresenceRecord | undefined {
  for (const record of presenceStore.get(sessionCode)?.values() ?? []) {
    if (record.socketId === socketId) return record;
  }
  return undefined;
}
