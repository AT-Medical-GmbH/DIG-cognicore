import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionsModule } from './sessions/sessions.module';
import { PollingModule } from './polling/polling.module';
import { SignalsModule } from './signals/signals.module';
import { CaptionsModule } from './captions/captions.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Load environment variables and make them available via ConfigService.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Feature modules
    SessionsModule,
    PollingModule,
    SignalsModule,
    CaptionsModule,

    // TODO: Add PrismaModule (global) once Prisma client generation is wired in CI.
    // TODO: Add AuthModule (JWT / clerk.dev) for protected endpoints.
    // TODO: Add ThrottlerModule for rate-limiting public endpoints.
    // TODO: Add CacheModule backed by Redis for session data hot-path.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
