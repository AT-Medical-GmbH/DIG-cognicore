import { Injectable } from '@nestjs/common';
import { CreateSignalDto } from './signals.dto';

export interface AudienceSignal {
  id: string;
  sessionId: string;
  participantId: string;
  type: string;
  message?: string;
  timestamp: Date;
  visible: boolean;
}

@Injectable()
export class SignalsService {
  /** In-memory store. TODO: Replace with Prisma. */
  private readonly signals = new Map<string, AudienceSignal[]>();

  /**
   * Records an incoming audience signal for a session.
   * TODO: Emit signal:new event via realtime-gateway pub/sub so the presenter
   *       dashboard updates without polling.
   * TODO: Apply rate-limiting per participant to prevent signal spam.
   */
  async create(sessionId: string, participantId: string, dto: CreateSignalDto): Promise<AudienceSignal> {
    const signal: AudienceSignal = {
      id: crypto.randomUUID(),
      sessionId,
      participantId,
      type: dto.type,
      message: dto.message,
      timestamp: new Date(),
      visible: true,
    };

    // TODO: prisma.audienceSignal.create({ data: signal })
    const existing = this.signals.get(sessionId) ?? [];
    this.signals.set(sessionId, [...existing, signal]);
    return signal;
  }

  /**
   * Returns all visible signals for a session, newest first.
   * TODO: Add cursor-based pagination for large audiences.
   * TODO: Add type filter (e.g., only RAISE_HAND signals).
   */
  async findBySession(sessionId: string): Promise<AudienceSignal[]> {
    return (this.signals.get(sessionId) ?? [])
      .filter((s) => s.visible)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Dismisses (hides) a signal from the presenter view.
   * TODO: Emit signal:dismissed event via realtime-gateway.
   */
  async dismiss(sessionId: string, signalId: string): Promise<void> {
    const list = this.signals.get(sessionId) ?? [];
    const idx = list.findIndex((s) => s.id === signalId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], visible: false };
      this.signals.set(sessionId, list);
    }
    // TODO: prisma.audienceSignal.update({ where: { id: signalId }, data: { visible: false } })
  }

  /**
   * Dismisses all signals for a session (e.g., after a reset phase).
   * TODO: Coordinate with recording-service markers to mark the reset boundary.
   */
  async dismissAll(sessionId: string): Promise<void> {
    const list = (this.signals.get(sessionId) ?? []).map((s) => ({ ...s, visible: false }));
    this.signals.set(sessionId, list);
    // TODO: prisma.audienceSignal.updateMany({ where: { sessionId }, data: { visible: false } })
  }
}
