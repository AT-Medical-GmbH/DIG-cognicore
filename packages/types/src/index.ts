/**
 * @fileoverview CogniCore™ types package public API.
 *
 * @example
 *   import type { Session, Poll, AudienceSignal } from '@cognicore/types';
 *   import type { ServerToClientEvents } from '@cognicore/types';
 */

export type {
  SessionStatus,
  EventInfo,
  TeacherInfo,
  SessionSettings,
  Session,
  ParticipantRole,
  Participant,
} from './session.js';

export type {
  PollType,
  PollStatus,
  PollOption,
  PollSettings,
  PollOptionResult,
  PollResults,
  Poll,
  PollResponse,
} from './polling.js';

export type {
  SignalType,
  AudienceSignal,
  SignalCounts,
  CoachResetEvent,
} from './signals.js';

export type {
  SupportedLanguage,
  CaptionSegment,
  CaptionSettings,
} from './captions.js';
export { supportedLanguageNames } from './captions.js';

export type {
  RecordingStatus,
  RecordingFormat,
  Recording,
  RecordingConfig,
} from './recording.js';

export type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './events.js';

export type {
  LicenseTier,
  License,
  LicenseFeatures,
} from './licensing.js';
export { tierDefaults } from './licensing.js';
