# ADR-005: Moodle & LTI Integration

**Status:** Accepted  
**Date:** 2025-01-01  
**Authors:** CogniCore Architecture Team  

## Context
Institutional customers require CogniCore™ to integrate with existing LMS platforms, primarily Moodle, using a standards-based protocol to avoid custom per-institution development.

## Decision
Implement **LTI 1.3 / LTI Advantage** as the primary LMS integration standard, with a Moodle-specific configuration guide and grade passback via AGS.

## Rationale
- LTI 1.3 is the current IMS Global standard; supported by Moodle, Canvas, Blackboard, D2L.
- A single LTI implementation covers multiple LMS targets.
- AGS eliminates manual grade entry for instructors.
- NRPS enables automatic roster sync without sharing credentials.

## Alternatives Considered
- **Moodle-only plugin (PHP):** Faster for Moodle but excludes other LMS platforms.
- **SAML SSO only:** Handles auth but not grade passback or deep linking.
- **Custom REST integration:** Requires per-institution maintenance.

## Consequences
- **Positive:** Standards compliance, broad LMS compatibility, automatic grade sync.
- **Negative:** LTI 1.3 OIDC flow is complex to debug; requires careful state/nonce management.

## Implementation Notes
- LTI module in `apps/api/src/lti/`.
- Library: `ltijs` (Node.js LTI 1.3 certified library).
- JWKS rotated every 90 days automatically.
