import { Injectable } from '@nestjs/common';

export interface CaptionSegment {
  id: string;
  sessionId: string;
  text: string;
  language: string;
  startTime: number;
  endTime: number;
  isFinal: boolean;
  createdAt: Date;
}

@Injectable()
export class CaptionsService {
  /** In-memory store. TODO: Replace with Prisma + time-series-friendly storage. */
  private readonly segments = new Map<string, CaptionSegment[]>();

  /**
   * Persists a caption segment received from the speech-gateway.
   * Called by the internal speech-gateway webhook, not by participants directly.
   *
   * TODO: Accept only FINAL segments for persistence; interim segments should
   *       flow through the realtime-gateway only (no DB write).
   * TODO: Emit caption:segment event via realtime-gateway for live display.
   * TODO: Enqueue translation jobs via translation-gateway for multilingual audiences.
   */
  async ingest(segment: Omit<CaptionSegment, 'id' | 'createdAt'>): Promise<CaptionSegment> {
    const record: CaptionSegment = {
      id: crypto.randomUUID(),
      ...segment,
      createdAt: new Date(),
    };
    // TODO: prisma.captionSegment.create({ data: record })
    const list = this.segments.get(segment.sessionId) ?? [];
    this.segments.set(segment.sessionId, [...list, record]);
    return record;
  }

  /**
   * Returns all caption segments for a session in chronological order.
   * Used for the downloadable transcript feature.
   *
   * TODO: Add language filter for multilingual transcript downloads.
   * TODO: Add time-range filter for partial transcript exports.
   * TODO: Stream results for large sessions to avoid memory pressure.
   */
  async findBySession(sessionId: string): Promise<CaptionSegment[]> {
    return (this.segments.get(sessionId) ?? []).sort(
      (a, b) => a.startTime - b.startTime,
    );
  }

  /**
   * Generates a plain-text transcript from caption segments.
   * TODO: Produce SRT / VTT format output for accessibility exports.
   * TODO: Apply reset-phase markers from recording-service to segment the transcript.
   */
  async getTranscript(sessionId: string): Promise<string> {
    const segments = await this.findBySession(sessionId);
    return segments
      .filter((s) => s.isFinal)
      .map((s) => s.text)
      .join(' ');
  }
}
