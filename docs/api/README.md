# CogniCore™ API Documentation

**Base URL:** `https://<your-domain>/api`  
**Version:** v1  
**Auth:** Bearer JWT (obtain via `/api/auth/login` or LTI 1.3 launch)

## Authentication

```bash
POST /api/auth/login
Content-Type: application/json

{ "email": "user@institution.edu", "password": "secret" }
```

Response:
```json
{ "accessToken": "<jwt>", "refreshToken": "<jwt>", "expiresIn": 3600 }
```

Include the access token in subsequent requests:
```
Authorization: Bearer <accessToken>
```

## Core Resources

| Resource | Base Path | Description |
|---|---|---|
| Sessions | `/api/sessions` | Create, list, update, end sessions |
| Participants | `/api/sessions/:id/participants` | Manage session participants |
| Recordings | `/api/recordings` | List, stream, download recordings |
| Captions | `/api/sessions/:id/captions` | Retrieve transcript for a session |
| Users | `/api/users` | User management (admin) |
| Tenants | `/api/tenants` | Tenant configuration (super-admin) |

## Key Endpoints

### Sessions

```
GET    /api/sessions              List sessions (paginated)
POST   /api/sessions              Create a session
GET    /api/sessions/:id          Get session details
PATCH  /api/sessions/:id          Update session metadata
DELETE /api/sessions/:id          End and archive session
POST   /api/sessions/:id/join     Get join token for session
```

### Recordings

```
GET    /api/recordings             List recordings
GET    /api/recordings/:id         Get recording metadata
GET    /api/recordings/:id/stream  Signed streaming URL (4 hr TTL)
DELETE /api/recordings/:id         Permanently delete (GDPR erasure)
```

### Captions / Transcripts

```
GET /api/sessions/:id/captions           Full transcript (JSON)
GET /api/sessions/:id/captions.vtt       WebVTT format
GET /api/sessions/:id/captions.srt       SRT format
```

## Pagination

All list endpoints support cursor-based pagination:

```
GET /api/sessions?cursor=<opaque>&limit=20
```

Response includes:
```json
{
  "data": [...],
  "meta": { "nextCursor": "<opaque>", "hasMore": true }
}
```

## Error Format

```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": "sessionId must be a valid UUID"
}
```

## Rate Limits

| Tier | Limit |
|---|---|
| Standard | 1 000 req/min |
| Bulk operations | 60 req/min |
| Webhook delivery | N/A (outbound) |

## WebSocket Events

Real-time events are delivered via Socket.io. See [Real-Time Architecture](../architecture/realtime.md) for full event reference.

## OpenAPI Spec

Machine-readable OpenAPI 3.1 spec available at:
```
GET /api/openapi.json
GET /api/docs   (Swagger UI)
```
