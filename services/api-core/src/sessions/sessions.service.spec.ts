import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsService],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a session with a 6-character code', async () => {
      const session = await service.create({ title: 'Test Session' });
      expect(session.sessionCode).toHaveLength(6);
      expect(session.title).toBe('Test Session');
      expect(session.status).toBe('PENDING');
    });

    it('should apply provided settings', async () => {
      const session = await service.create({
        title: 'Settings Test',
        settings: { allowAnonymous: true },
      });
      expect(session.settings).toEqual({ allowAnonymous: true });
    });
  });

  describe('findByCode', () => {
    it('should return an existing session', async () => {
      const created = await service.create({ title: 'Find Me' });
      const found = await service.findByCode(created.sessionCode);
      expect(found.id).toBe(created.id);
    });

    it('should be case-insensitive', async () => {
      const created = await service.create({ title: 'Case Test' });
      const found = await service.findByCode(created.sessionCode.toLowerCase());
      expect(found.id).toBe(created.id);
    });

    it('should throw NotFoundException for unknown code', async () => {
      await expect(service.findByCode('XXXXXX')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the session title', async () => {
      const created = await service.create({ title: 'Old Title' });
      const updated = await service.update(created.sessionCode, { title: 'New Title' });
      expect(updated.title).toBe('New Title');
    });

    it('should transition status', async () => {
      const created = await service.create({ title: 'Status Test' });
      const updated = await service.update(created.sessionCode, { status: 'ACTIVE' as any });
      expect(updated.status).toBe('ACTIVE');
    });
  });

  describe('remove', () => {
    it('should mark session as ENDED', async () => {
      const created = await service.create({ title: 'End Me' });
      await service.remove(created.sessionCode);
      const session = await service.findByCode(created.sessionCode);
      expect(session.status).toBe('ENDED');
    });

    it('should throw NotFoundException for unknown code', async () => {
      await expect(service.remove('XXXXXX')).rejects.toThrow(NotFoundException);
    });
  });

  // TODO: Add tests once PrismaModule is wired:
  //   - findAll with pagination
  //   - database error propagation
  //   - Redis pub/sub notifications on status change
});
