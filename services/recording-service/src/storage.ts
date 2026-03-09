/**
 * Storage abstraction for the CogniCore recording service.
 *
 * Provides a unified interface for saving, retrieving, and deleting recording
 * files regardless of the underlying storage backend (local filesystem in dev,
 * S3-compatible object storage in production).
 *
 * TODO: Implement S3 backend using @aws-sdk/client-s3.
 * TODO: Add signed URL generation for secure browser-based downloads.
 * TODO: Add multipart upload support for large recordings.
 * TODO: Integrate with a CDN (CloudFront, Fastly) for efficient global delivery.
 */

import fs from 'fs';
import path from 'path';

/** Metadata about a stored recording file. */
export interface StorageObject {
  /** Storage key (relative path or S3 object key). */
  key: string;
  /** Absolute URL or local path where the file can be accessed. */
  url: string;
  /** File size in bytes. */
  sizeBytes: number;
  /** MIME type of the stored file. */
  contentType: string;
  /** When the file was stored. */
  storedAt: Date;
}

// ---------------------------------------------------------------------------
// Local filesystem backend (development only)
// ---------------------------------------------------------------------------

const STORAGE_ROOT = process.env.RECORDING_STORAGE_PATH ?? path.join(process.cwd(), '.recordings');

/** Ensures the storage root directory exists. */
function ensureStorageRoot(): void {
  if (!fs.existsSync(STORAGE_ROOT)) {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true });
    console.log(`[storage] Created local storage directory: ${STORAGE_ROOT}`);
  }
}

/**
 * Saves a recording file to local storage.
 *
 * TODO: In production, replace with:
 *   const s3 = new S3Client({ region: process.env.AWS_REGION });
 *   await s3.send(new PutObjectCommand({ Bucket, Key: key, Body: data, ContentType: contentType }));
 *
 * @param key          Unique storage key (e.g., `recordings/{sessionId}/{recordingId}.webm`).
 * @param data         File contents as a Buffer.
 * @param contentType  MIME type (e.g., `video/webm`).
 */
export async function saveFile(key: string, data: Buffer, contentType: string): Promise<StorageObject> {
  ensureStorageRoot();
  const filePath = path.join(STORAGE_ROOT, key);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(filePath, data);

  console.log(`[storage] Saved file: ${filePath} (${data.byteLength} bytes)`);
  return {
    key,
    url: `file://${filePath}`,
    sizeBytes: data.byteLength,
    contentType,
    storedAt: new Date(),
  };
}

/**
 * Reads a file from local storage.
 *
 * TODO: In production:
 *   const response = await s3.send(new GetObjectCommand({ Bucket, Key: key }));
 *   return Buffer.from(await response.Body.transformToByteArray());
 */
export async function readFile(key: string): Promise<Buffer> {
  const filePath = path.join(STORAGE_ROOT, key);
  if (!fs.existsSync(filePath)) {
    throw new Error(`[storage] File not found: ${key}`);
  }
  return fs.readFileSync(filePath);
}

/**
 * Deletes a file from local storage.
 *
 * TODO: In production:
 *   await s3.send(new DeleteObjectCommand({ Bucket, Key: key }));
 */
export async function deleteFile(key: string): Promise<void> {
  const filePath = path.join(STORAGE_ROOT, key);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`[storage] Deleted file: ${filePath}`);
  }
}

/**
 * Generates a pre-signed URL for client-side download.
 *
 * TODO: In production:
 *   const command = new GetObjectCommand({ Bucket, Key: key });
 *   return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
 */
export async function getDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  // Local development: return the file path directly.
  const filePath = path.join(STORAGE_ROOT, key);
  console.warn(`[storage] getDownloadUrl() using local path (dev only). expiresIn=${expiresInSeconds}s`);
  return `file://${filePath}`;
}
