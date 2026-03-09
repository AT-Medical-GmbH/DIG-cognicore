import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ---------------------------------------------------------------------------
  // CORS
  // TODO: Tighten origins for production; read allowed origins from config.
  // ---------------------------------------------------------------------------
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // ---------------------------------------------------------------------------
  // Global validation pipe
  // ---------------------------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,          // auto-transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ---------------------------------------------------------------------------
  // Swagger / OpenAPI docs
  // ---------------------------------------------------------------------------
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CogniCore API')
    .setDescription('REST API for the CogniCore™ presentation intelligence platform')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('sessions', 'Session lifecycle management')
    .addTag('polling', 'Audience polling')
    .addTag('signals', 'Audience signals (raise-hand, reactions, etc.)')
    .addTag('captions', 'Live caption management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`[api-core] Listening on http://localhost:${port}`);
  console.log(`[api-core] Swagger UI → http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('[api-core] Fatal startup error', err);
  process.exit(1);
});
