/**
 * @fileoverview Session token generation and validation for CogniCore™.
 *
 * Session tokens are short-lived JWTs issued when a participant joins a session.
 * They carry the participant's identity and role, and are used to authenticate
 * subsequent WebSocket connections and API requests.
 *
 * @remarks
 * TODO: Replace the stub implementations with a production JWT library
 *       (e.g. `jose` or `jsonwebtoken`) once the server package is scaffolded.
 *
 * TODO: Implement token refresh to extend sessions without re-joining.
 *
 * TODO: Store token revocation state in Redis so that force-disconnected
 *       participants cannot reconnect with a previously-valid token.
 */

import type { AuthIdentity } from './types.js';

// ---------------------------------------------------------------------------
// Token payload
// ---------------------------------------------------------------------------

/**
 * Claims encoded inside a CogniCore™ session JWT.
 */
export interface SessionTokenPayload {
  /** JWT subject – the participant's unique ID. */
  sub: string;
  /** Session the token is scoped to. */
  sessionId: string;
  /** Participant's role within the session. */
  role: string;
  /** Issued-at time as Unix epoch (seconds). */
  iat: number;
  /** Expiry time as Unix epoch (seconds). */
  exp: number;
  /** Optional display name claim. */
  displayName?: string | undefined;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Default token lifetime in seconds (4 hours). */
const DEFAULT_TOKEN_TTL_SECONDS = 4 * 60 * 60;

// ---------------------------------------------------------------------------
// Generation stub
// ---------------------------------------------------------------------------

/**
 * Generates a signed session token for an authenticated participant identity.
 *
 * @param identity - The resolved auth identity to encode into the token.
 * @param secret   - HMAC signing secret (minimum 32 bytes recommended).
 * @param ttlSeconds - Token lifetime in seconds. Defaults to 4 hours.
 * @returns A signed JWT string.
 *
 * @todo Replace stub with `new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(secret)` from `jose`.
 *
 * @example
 *   const token = await generateSessionToken(identity, process.env.JWT_SECRET!);
 *   res.cookie('cognicore_session', token, { httpOnly: true, secure: true });
 */
export async function generateSessionToken(
  identity: AuthIdentity,
  secret: string,
  ttlSeconds: number = DEFAULT_TOKEN_TTL_SECONDS,
): Promise<string> {
  // TODO: implement with jose or jsonwebtoken
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionTokenPayload = {
    sub: identity.participantId,
    sessionId: identity.sessionId,
    role: identity.role,
    iat: now,
    exp: now + ttlSeconds,
    displayName: identity.displayName,
  };

  // Stub: base64url-encode the JSON payload (NOT cryptographically signed)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = Buffer.from(`${secret}-STUB`).toString('base64url').slice(0, 16);

  return `${header}.${body}.${sig}`;
}

// ---------------------------------------------------------------------------
// Validation stub
// ---------------------------------------------------------------------------

/** Result of token validation. */
export type TokenValidationResult =
  | { valid: true; payload: SessionTokenPayload }
  | { valid: false; reason: string };

/**
 * Validates and decodes a CogniCore™ session token.
 *
 * @param token  - The JWT string to validate.
 * @param secret - HMAC signing secret used to verify the signature.
 * @returns A `TokenValidationResult` – check `valid` before accessing `payload`.
 *
 * @todo Replace stub with `jwtVerify(token, secret)` from `jose` with proper
 *       signature verification and clock skew tolerance.
 *
 * @example
 *   const result = await validateSessionToken(token, process.env.JWT_SECRET!);
 *   if (!result.valid) throw new UnauthorizedException(result.reason);
 *   const { sub, sessionId, role } = result.payload;
 */
export async function validateSessionToken(
  token: string,
  _secret: string,
): Promise<TokenValidationResult> {
  // TODO: implement cryptographic signature verification
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Malformed token structure.' };
  }

  let payload: SessionTokenPayload;
  try {
    const decoded = parts[1];
    if (!decoded) {
      return { valid: false, reason: 'Missing token payload.' };
    }
    payload = JSON.parse(Buffer.from(decoded, 'base64url').toString()) as SessionTokenPayload;
  } catch {
    return { valid: false, reason: 'Failed to decode token payload.' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    return { valid: false, reason: 'Token has expired.' };
  }

  return { valid: true, payload };
}
