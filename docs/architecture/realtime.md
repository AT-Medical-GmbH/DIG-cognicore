# CogniCore™ Real-Time Architecture

## Transport Layer

CogniCore™ uses **Socket.io 4** over WSS for all real-time communication, with Redis Adapter enabling horizontal scaling.

```
Client A ──WSS──► Socket.io Server 1 ─┐
                                       ├─ Redis Pub/Sub ─► All Socket.io Servers
Client B ──WSS──► Socket.io Server 2 ─┘
```

## Namespaces

| Namespace | Purpose |
|---|---|
| `/session` | Room events, participant join/leave |
| `/caption` | Live ASR caption stream |
| `/chat` | In-session chat messages |
| `/media` | Mediasoup signalling (offer/answer/ICE) |
| `/coach` | Real-time instructor analytics |

## Event Reference (Session Namespace)

```typescript
// Client → Server
socket.emit('session:join', { sessionId, token });
socket.emit('session:leave', { sessionId });

// Server → Client
socket.on('session:participant-joined', (participant) => {});
socket.on('session:caption', (captionChunk) => {});
socket.on('session:ended', () => {});
```

## Scaling

- Each Socket.io server connects to the shared **Redis 7** cluster using `@socket.io/redis-adapter`.
- Sticky sessions are **not** required; the Redis adapter propagates events across all nodes.
- Horizontal pod autoscaling triggers at 70% CPU or 500 concurrent connections per pod.

## Heartbeat & Reconnection

- Ping interval: **25 s** | Ping timeout: **60 s**
- Clients use Socket.io's built-in exponential back-off reconnection.
- Session state is recovered from Redis on reconnect within the 5-minute grace window.
