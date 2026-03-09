/**
 * @fileoverview Session code generation and validation for CogniCore™.
 *
 * Session codes are 6-character uppercase alphanumeric strings (A–Z, 2–9)
 * that participants type or scan to join a live session. Characters `0`, `1`,
 * `O`, and `I` are excluded to avoid visual confusion on handwritten boards.
 *
 * @example
 *   const code = generateSessionCode(); // e.g. "B7KQ3R"
 *   const valid = validateSessionCode(code); // true
 */

import { randomInt } from 'node:crypto';

/** Characters used when generating session codes. Visually unambiguous set. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Required length for all session codes. */
const SESSION_CODE_LENGTH = 6;

/** Pre-compiled regex for validating a session code without generating extras. */
const SESSION_CODE_PATTERN = new RegExp(`^[A-HJ-NP-Z2-9]{${SESSION_CODE_LENGTH}}$`);

/**
 * Generates a cryptographically random 6-character session code.
 *
 * Uses Node.js `crypto.randomInt` for uniform, unbiased sampling from the
 * 32-character `CODE_ALPHABET`, giving 32⁶ ≈ 1.07 billion combinations.
 *
 * @returns A 6-character uppercase alphanumeric code, e.g. `"B7KQ3R"`.
 *
 * @example
 *   const code = generateSessionCode(); // "M4XQ7R"
 */
export function generateSessionCode(): string {
  let code = '';
  for (let i = 0; i < SESSION_CODE_LENGTH; i++) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

/**
 * Validates the format of a session code.
 *
 * A valid code must:
 * - Be exactly 6 characters long.
 * - Contain only uppercase letters (A–H, J–N, P–Z) and digits (2–9).
 * - Not contain `0`, `1`, `O`, or `I` (excluded to avoid visual ambiguity).
 *
 * @param code - The code string to validate.
 * @returns `true` if the code matches the expected format; `false` otherwise.
 *
 * @example
 *   validateSessionCode('B7KQ3R'); // true
 *   validateSessionCode('000000'); // false – contains excluded characters
 *   validateSessionCode('abc123'); // false – lowercase
 *   validateSessionCode('AB12');   // false – too short
 */
export function validateSessionCode(code: string): boolean {
  return SESSION_CODE_PATTERN.test(code);
}

/**
 * Normalises a user-entered code by trimming whitespace and uppercasing.
 *
 * Useful to process codes typed by participants before calling `validateSessionCode`.
 *
 * @param input - Raw user input.
 * @returns Trimmed, uppercased string ready for validation.
 *
 * @example
 *   normaliseSessionCode(' b7kq3r '); // "B7KQ3R"
 */
export function normaliseSessionCode(input: string): string {
  return input.trim().toUpperCase();
}

// Re-export constants for consumers that need to render the alphabet or length.
export { CODE_ALPHABET, SESSION_CODE_LENGTH };

