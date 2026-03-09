/**
 * @fileoverview CogniCore™ top-level application configuration.
 *
 * Values are resolved from environment variables at runtime with safe
 * defaults so the application remains functional without explicit configuration.
 *
 * **Never import this file on the client-side** – it may reference server-only
 * environment variables that should not be exposed to the browser.
 */

/** Configuration for the CogniCore™ API / backend service. */
export interface ApiConfig {
  /** Base URL of the REST API. */
  baseUrl: string;
  /** WebSocket server URL (Socket.io). */
  wsUrl: string;
  /** Request timeout in milliseconds. */
  timeoutMs: number;
  /** API version prefix (e.g. `"v1"`). */
  version: string;
}

/** Configuration for the web frontend application. */
export interface FrontendConfig {
  /** Public application base URL (used for links, OG tags, etc.). */
  appUrl: string;
  /** Application display name shown in the UI. */
  appName: string;
  /** Support email address. */
  supportEmail: string;
}

/** Persistence layer configuration. */
export interface DatabaseConfig {
  /** Full PostgreSQL connection URL. */
  url: string;
  /** Maximum number of pool connections. */
  poolMax: number;
  /** Connection acquire timeout in milliseconds. */
  acquireTimeoutMs: number;
}

/** Redis configuration for session state and pub/sub. */
export interface RedisConfig {
  /** Redis connection URL (e.g. `redis://localhost:6379`). */
  url: string;
  /** Optional key namespace prefix. */
  keyPrefix: string;
}

/** Object storage configuration for recordings. */
export interface StorageConfig {
  /** Storage provider (`"s3"`, `"gcs"`, `"local"`). */
  provider: 'S3' | 'GCS' | 'local';
  /** S3/GCS bucket name or local directory path. */
  bucket: string;
  /** CDN base URL prepended to stored object keys. */
  publicBaseUrl: string;
  /** AWS region (S3 only). */
  region?: string;
}

/** Aggregated application configuration. */
export interface AppConfig {
  api: ApiConfig;
  frontend: FrontendConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  storage: StorageConfig;
  /** Node.js runtime environment. */
  nodeEnv: 'development' | 'test' | 'staging' | 'production';
  /** Whether verbose debug logging is enabled. */
  debug: boolean;
}

/**
 * Reads an environment variable, returning `fallback` if absent.
 * @internal
 */
function env(key: string, fallback: string): string {
  if (typeof process === 'undefined') return fallback;
  return process.env[key] ?? fallback;
}

/** Default application configuration derived from environment variables. */
export const defaultAppConfig: AppConfig = {
  nodeEnv: (env('NODE_ENV', 'development') as AppConfig['nodeEnv']),
  debug: env('DEBUG', 'false') === 'true',

  api: {
    baseUrl: env('NEXT_PUBLIC_API_URL', 'http://localhost:3001/api'),
    wsUrl: env('NEXT_PUBLIC_WS_URL', 'http://localhost:3001'),
    timeoutMs: Number(env('API_TIMEOUT_MS', '10000')),
    version: env('API_VERSION', 'v1'),
  },

  frontend: {
    appUrl: env('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    appName: env('NEXT_PUBLIC_APP_NAME', 'CogniCore™'),
    supportEmail: env('SUPPORT_EMAIL', 'support@atmedical.de'),
  },

  database: {
    url: env('DATABASE_URL', 'postgresql://cognicore:cognicore@localhost:5432/cognicore'),
    poolMax: Number(env('DB_POOL_MAX', '10')),
    acquireTimeoutMs: Number(env('DB_ACQUIRE_TIMEOUT_MS', '30000')),
  },

  redis: {
    url: env('REDIS_URL', 'redis://localhost:6379'),
    keyPrefix: env('REDIS_KEY_PREFIX', 'cognicore:'),
  },

  storage: {
    provider: (env('STORAGE_PROVIDER', 'local') as StorageConfig['provider']),
    bucket: env('STORAGE_BUCKET', './data/recordings'),
    publicBaseUrl: env('STORAGE_PUBLIC_BASE_URL', 'http://localhost:3001/files'),
    region: env('AWS_REGION', 'eu-central-1'),
  },
};
