# Anti-Restreaming Policy

CogniCore™ implements multiple layers of protection to prevent unauthorised redistribution of live sessions and recordings.

## Live Session Protection

### 1. Signed Join Tokens
Every participant receives a time-limited, single-use JWT join token. Tokens expire after **5 minutes** and are bound to the participant's IP address and user-agent.

### 2. WebRTC Encryption
All media is encrypted end-to-end using **DTLS-SRTP**. There is no unencrypted media path.

### 3. RTMP/HLS Output Restrictions
External stream output (RTMP, HLS) is disabled by default. When enabled for licensed broadcast scenarios, streams are signed with a rotating HMAC key and restricted to an allowlist of destination URLs configured in CogniControl.

## Recording Protection

### 1. Signed URLs
Recording playback URLs are signed with **HMAC-SHA256** and expire after **4 hours**. URLs are bound to the requesting user's session.

### 2. Token Binding
Playback tokens are invalidated if the user-agent or IP address changes mid-playback.

### 3. Watermarking
CogniCapture optionally embeds an invisible forensic watermark (tenant ID + user ID hash) in composite recordings to enable leak attribution.

### 4. Download Controls
Per-tenant and per-session download permissions. When download is disabled, recordings are only accessible via the in-browser player with DRM-lite controls (no `Content-Disposition: attachment`).

## Audit Logging

All recording access events are written to **CogniChronicle** as xAPI statements:

```json
{
  "verb": { "id": "https://w3id.org/xapi/video/verbs/played" },
  "object": { "id": "https://<domain>/recordings/<sessionId>" },
  "context": { "extensions": { "userAgent": "...", "ip": "..." } }
}
```

## Abuse Response

1. Suspected restream detected → automatic session token revocation.
2. Repeated violations → tenant-level access suspension pending review by AT Medical GmbH® trust & safety team.
