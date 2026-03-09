/** Configuration factory loaded by ConfigModule.forRoot({ load: [configuration] }). */
export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),

  database: {
    url: process.env.DATABASE_URL ?? '',
  },

  redis: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },

  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
  },

  // TODO: Add auth section once JWT / Clerk integration is in place.
  // auth: {
  //   clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  //   clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
  //   jwtSecret: process.env.JWT_SECRET ?? '',
  // },

  // TODO: Add storage section for recording file paths / S3 bucket config.
  // storage: {
  //   s3Bucket: process.env.S3_BUCKET ?? '',
  //   s3Region: process.env.AWS_REGION ?? 'us-east-1',
  // },

  realtimeGateway: {
    url: process.env.REALTIME_GATEWAY_URL ?? 'http://localhost:3002',
  },

  speechGateway: {
    url: process.env.SPEECH_GATEWAY_URL ?? 'http://localhost:3003',
    provider: process.env.SPEECH_PROVIDER ?? 'mock',
  },

  translationGateway: {
    url: process.env.TRANSLATION_GATEWAY_URL ?? 'http://localhost:3004',
    provider: process.env.TRANSLATION_PROVIDER ?? 'mock',
  },
});
