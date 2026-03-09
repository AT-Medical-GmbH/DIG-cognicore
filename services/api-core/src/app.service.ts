import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /** Returns a structured health payload for observability tooling. */
  getHealth(): Record<string, unknown> {
    return {
      status: 'ok',
      service: '@cognicore/api-core',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      // TODO: Include database connectivity status once PrismaModule is wired.
      // TODO: Include Redis connectivity status once CacheModule is wired.
    };
  }
}
