# ADR-002: Real-Time Transport

**Status:** Accepted  
**Date:** 2025-01-01  
**Authors:** CogniCore Architecture Team  

## Context
CogniCore™ requires low-latency bidirectional communication for captions, chat, participant events, and mediasoup signalling. The transport must scale horizontally across multiple API pods.

## Decision
Use **Socket.io 4** for all real-time application events, with the **@socket.io/redis-adapter** for horizontal scaling. WebRTC media (audio/video) uses **mediasoup 3** directly over DTLS-SRTP.

## Rationale
- Socket.io provides reliable fallback (long-polling) for restrictive corporate networks.
- Redis adapter enables event fan-out across pods without sticky sessions.
- Separating application events (Socket.io) from media (WebRTC/mediasoup) keeps the signalling plane lightweight.

## Alternatives Considered
- **Plain WebSocket + custom broker:** More control but requires reimplementing reconnection, rooms, and namespaces.
- **MQTT:** Well-suited for IoT but not browser-native without a bridge.
- **WebTransport:** Promising but insufficient browser support in 2024.

## Consequences
- **Positive:** Mature ecosystem, excellent browser compatibility, easy namespace isolation.
- **Negative:** Socket.io adds ~10 KB to client bundle; Redis dependency required.

## Implementation Notes
- Socket.io server bootstrapped in `apps/api/src/realtime/`.
- Redis adapter configured with `createAdapter(pubClient, subClient)`.
- Namespaces: `/session`, `/caption`, `/chat`, `/media`, `/coach`.
