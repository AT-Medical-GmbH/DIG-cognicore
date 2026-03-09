import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePollDto, PollStatus, SubmitPollResponseDto } from './polling.dto';

export interface Poll {
  id: string;
  sessionId: string;
  type: string;
  status: PollStatus;
  question: string;
  options: string[];
  createdAt: Date;
  responses: Array<{ id: string; value: string; createdAt: Date }>;
}

@Injectable()
export class PollingService {
  /** In-memory store. TODO: Replace with Prisma. */
  private readonly polls = new Map<string, Poll>();

  /**
   * Creates a poll attached to a session.
   * TODO: Verify session exists before creating poll.
   * TODO: Emit poll:created via realtime-gateway so presenter dashboard updates live.
   */
  async create(sessionId: string, dto: CreatePollDto): Promise<Poll> {
    const poll: Poll = {
      id: crypto.randomUUID(),
      sessionId,
      type: dto.type,
      status: PollStatus.DRAFT,
      question: dto.question,
      options: dto.options ?? [],
      createdAt: new Date(),
      responses: [],
    };
    // TODO: prisma.poll.create({ data: ... })
    this.polls.set(poll.id, poll);
    return poll;
  }

  /**
   * Returns all polls for a given session.
   * TODO: Add status filter (e.g., only ACTIVE polls for participants).
   */
  async findBySession(sessionId: string): Promise<Poll[]> {
    return Array.from(this.polls.values()).filter((p) => p.sessionId === sessionId);
  }

  async findById(pollId: string): Promise<Poll> {
    const poll = this.polls.get(pollId);
    if (!poll) throw new NotFoundException(`Poll '${pollId}' not found`);
    return poll;
  }

  /**
   * Activates a poll, making it visible to participants.
   * TODO: Emit poll:activated event via realtime-gateway.
   */
  async activate(pollId: string): Promise<Poll> {
    const poll = await this.findById(pollId);
    const updated = { ...poll, status: PollStatus.ACTIVE };
    this.polls.set(pollId, updated);
    return updated;
  }

  /**
   * Closes a poll, preventing further responses.
   * TODO: Emit poll:closed event and compute result aggregates.
   */
  async close(pollId: string): Promise<Poll> {
    const poll = await this.findById(pollId);
    const updated = { ...poll, status: PollStatus.CLOSED };
    this.polls.set(pollId, updated);
    return updated;
  }

  /**
   * Records a participant response.
   * TODO: Validate participant exists in session.
   * TODO: Enforce one-response-per-participant rule (unless multi-select).
   * TODO: Emit poll:response event for live results bar chart.
   */
  async submitResponse(pollId: string, dto: SubmitPollResponseDto): Promise<void> {
    const poll = await this.findById(pollId);
    poll.responses.push({
      id: crypto.randomUUID(),
      value: dto.value,
      createdAt: new Date(),
    });
    // TODO: prisma.pollResponse.create({ data: { pollId, value: dto.value } })
  }

  /**
   * Returns aggregated results for a poll.
   * TODO: For WORD_CLOUD type, run frequency analysis and return top N words.
   * TODO: For RATING type, compute mean, median, and distribution.
   */
  async getResults(pollId: string): Promise<Record<string, unknown>> {
    const poll = await this.findById(pollId);
    const counts: Record<string, number> = {};
    for (const r of poll.responses) {
      counts[r.value] = (counts[r.value] ?? 0) + 1;
    }
    return {
      pollId,
      question: poll.question,
      totalResponses: poll.responses.length,
      counts,
    };
  }
}
