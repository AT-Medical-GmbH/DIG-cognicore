# LTI 1.3 Integration

CogniCore™ is a certified **LTI 1.3 / LTI Advantage** tool provider.

## Supported LTI Advantage Services

| Service | Support |
|---|---|
| Deep Linking (Content-Item) | ✅ |
| Assignment & Grade Services (AGS) | ✅ |
| Names and Role Provisioning (NRPS) | ✅ |
| Submission Review | Roadmap |

## OIDC Launch Flow

```
Platform (LMS)          CogniCore™ Tool
     │                        │
     │── OIDC Login Request ──►│  GET /lti/login
     │◄── Redirect to Platform─│
     │── Auth Response ────────►│  POST /lti/launch
     │                        │  (JWT id_token verified)
     │                        │  Session created / resumed
```

## Configuration Endpoints

| Endpoint | URL |
|---|---|
| Login URL | `https://<domain>/lti/login` |
| Launch / Redirect URL | `https://<domain>/lti/launch` |
| JWKS | `https://<domain>/lti/.well-known/jwks.json` |
| Deep Link Return | `https://<domain>/lti/deep-link` |

## JWT Claims Used

```json
{
  "sub": "<platform_user_id>",
  "email": "learner@institution.edu",
  "name": "Jane Doe",
  "https://purl.imsglobal.org/spec/lti/claim/roles": [
    "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner"
  ],
  "https://purl.imsglobal.org/spec/lti/claim/context": {
    "id": "<course_id>",
    "title": "Introduction to Medicine"
  }
}
```

## Grade Passback Example

```typescript
// CogniCoordinator emits grade after session
await ltiAgsService.submitScore({
  deploymentId,
  lineItemUrl,
  score: { userId, scoreGiven: 87, scoreMaximum: 100, activityProgress: 'Completed' }
});
```

## Security Notes

- All JWTs validated with platform's public JWKS.
- State and nonce parameters enforced to prevent replay attacks.
- PKCE used for all OIDC flows.
