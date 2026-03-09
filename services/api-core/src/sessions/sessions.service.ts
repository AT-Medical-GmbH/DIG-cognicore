import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

/**
 * Represents a session record returned by the service layer.
 * TODO: Replace with generated Prisma type once PrismaModule is wired.
 */
export interface Session {
  id: string;
  sessionCode: string;
  title: string;
  status: string;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SessionsService {
  /**
   * In-memory store used during development.
   * TODO: Replace with PrismaClient calls once DATABASE_URL is configured.
   */
  private readonly sessions = new Map<string, Session>();

  /**
   * Generates a unique 6-digit alphanumeric session code.
   * TODO: Add collision-retry loop and database uniqueness check.
   */
  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  /**
   * Creates a new session and persists it.
   * TODO: Notify realtime-gateway via Redis pub/sub to open a session room.
   */
  async create(dto: CreateSessionDto): Promise<Session> {
    const session: Session = {
      id: crypto.randomUUID(),
      sessionCode: this.generateCode(),
      title: dto.title,
      status: 'PENDING',
      settings: dto.settings ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: prisma.session.create({ data: session })
    this.sessions.set(session.sessionCode, session);
    return session;
  }

  /**
   * Retrieves a session by its 6-digit code.
   * TODO: Prisma: prisma.session.findUnique({ where: { sessionCode: code } })
   */
  async findByCode(code: string): Promise<Session> {
    const session = this.sessions.get(code.toUpperCase());
    if (!session) {
      throw new NotFoundException(`Session with code '${code}' not found`);
    }
    return session;
  }

  /**
   * Updates mutable session fields.
   * TODO: Prisma: prisma.session.update({ where: { sessionCode: code }, data: dto })
   * TODO: Emit session:updated event to realtime-gateway on status changes.
   */
  async update(code: string, dto: UpdateSessionDto): Promise<Session> {
    const session = await this.findByCode(code);
    const updated: Session = {
      ...session,
      title: dto.title ?? session.title,
      status: dto.status ?? session.status,
      settings: dto.settings ?? session.settings,
      updatedAt: new Date(),
    };
    this.sessions.set(code.toUpperCase(), updated);
    return updated;
  }

  /**
   * Ends a session (soft delete – marks status as ENDED).
   * TODO: Prisma: prisma.session.update({ where: { sessionCode: code }, data: { status: 'ENDED' } })
   * TODO: Emit session:ended event to realtime-gateway to close the room.
   * TODO: Trigger recording finalisation via recording-service.
   */
  async remove(code: string): Promise<void> {
    await this.findByCode(code); // ensure it exists
    const session = this.sessions.get(code.toUpperCase())!;
    this.sessions.set(code.toUpperCase(), {
      ...session,
      status: 'ENDED',
      updatedAt: new Date(),
    });
  }

  /**
   * Lists all sessions (admin use).
   * TODO: Add pagination, filtering by status, and owner scoping once auth is in place.
   */
  async findAll(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }
}
