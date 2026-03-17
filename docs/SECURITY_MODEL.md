# CogniCore™ Security Model

**Owner:** AT Medical GmbH® Security Team  
**Status:** Current  
**Last updated:** 2026-03-17  
**Classification:** Internal — restricted

---

## 1. Introduction

This document describes the security model for CogniCore™, covering the threat landscape, protective controls, AI-specific risks, patient and participant data handling, model auditability, and GDPR compliance for automated processing.

CogniCore™ operates in medical education and clinical training environments where data confidentiality, integrity, and availability are of critical importance.

---

## 2. Threat Model

### 2.1 Assets

| Asset | Sensitivity |
|---|---|
| Session audio and video streams | High — may contain clinical discussions |
| ASR transcripts and translations | High — derivative of sensitive audio |
| Session recordings | High — stored PII and clinical content |
| Authentication credentials (JWT, OAuth tokens) | Critical |
| LTI 1.3 launch secrets and platform keys | Critical |
| AI provider API keys (Azure, Deepgram, OpenAI, DeepL) | Critical |
| User and participant PII (name, email, institution) | High |
| xAPI analytics events | Medium — pseudonymised |
| Infrastructure credentials (DB, Redis, S3) | Critical |

### 2.2 Threat Actors

| Actor | Motivation | Likelihood |
|---|---|---|
| External attacker | Unauthorised data access, service disruption | Medium |
| Malicious insider | Data exfiltration, sabotage | Low |
| Compromised third-party AI provider | Data leakage through provider breach | Medium |
| Adversarial ML attacker | Model manipulation, output poisoning | Low–Medium |
| Session participant | Recording redistribution, unauthorised access | Medium |

### 2.3 Attack Surface

- **Public API endpoints**: REST API and WebSocket server exposed to the internet.
- **WebRTC media paths**: SFU peer connections and RTMP ingest.
- **Third-party AI integrations**: Azure, Deepgram, OpenAI Whisper, DeepL.
- **LTI 1.3 launch flows**: Moodle and other LMS platforms.
- **CogniCell LocalLink™ edge nodes**: Local-network devices running the edge node software.
- **CI/CD pipeline**: GitHub Actions workflows with access to deployment secrets.

---

## 3. AI-Specific Threat Model

### 3.1 Adversarial Attacks

CogniCore™ uses third-party cloud AI providers for speech recognition and translation. These are treated as black-box services. Adversarial input risks include:

| Threat | Description | Mitigation |
|---|---|---|
| Adversarial audio inputs | Crafted audio designed to fool ASR models into producing incorrect transcripts | Input validation; confidence score thresholds; human review for critical outputs |
| Prompt injection (NLP) | Malicious text injected into translation pipeline to exfiltrate data or alter output | Output sanitisation; no direct user-controlled inputs to AI prompts without escaping |
| Model evasion | Inputs crafted to bypass content filters in AI providers | Provider-level safety filters; AT Medical usage policy enforcement |

### 3.2 Model Poisoning

CogniCore™ does not train custom models in production. Where fine-tuning is performed (e.g., domain-specific ASR vocabulary):

- Training datasets are stored in access-controlled repositories.
- Training pipelines must be approved via the AI/ML Model Request process.
- Model artefacts are stored with version hashes and provenance metadata.
- Fine-tuned models are evaluated against a held-out benchmark before deployment.

### 3.3 Data Leakage via AI Providers

Audio and text data sent to third-party AI APIs is subject to provider data handling policies.

**Controls:**
- Data processing agreements (DPAs) are required with all AI providers before production use.
- EU data residency is preferred; non-EU processing must be approved by the AT Medical data protection officer.
- Minimum necessary data principle: only the audio segment required for transcription is sent; no participant metadata is included in API requests.
- Providers are evaluated during security review for each new integration.

### 3.4 Model Output Integrity

AI-generated transcripts and translations are informational aids. The following controls ensure output integrity:

- Confidence scores are surfaced to end users where available.
- Users can correct or annotate transcripts before they are stored.
- No automated decisions with legal or significant effects are made based solely on AI output (GDPR Article 22 compliance — see Section 7).
- Model version and provider are logged alongside each transcript for auditability.

---

## 4. Authentication and Authorisation

| Mechanism | Details |
|---|---|
| JWT Bearer tokens | Signed with RS256; short-lived (15 min) + refresh token rotation |
| OAuth 2.0 / OIDC | Used for institutional SSO integrations |
| LTI 1.3 | Signed launch requests (RSA keys); nonce validation; JWKS endpoint |
| Session join tokens | Single-use, time-limited (5 min), IP and user-agent bound |
| Role-based access control (RBAC) | Roles: `admin`, `moderator`, `presenter`, `participant` |

---

## 5. Patient and Participant Data Handling

### 5.1 Data Classification

| Data Type | Classification | Retention |
|---|---|---|
| Name, email, institution | PII — personal | Per institutional policy (default: session lifetime) |
| Audio streams | PII — sensitive | Not stored unless recording enabled |
| Transcripts | PII — sensitive | Per session recording policy |
| Session recordings | PII — sensitive, may be special category | Configurable; admin-deletable |
| xAPI analytics | Pseudonymised | Per institutional policy |
| System logs | Non-personal (IP addresses masked after 24 h) | 30 days |

### 5.2 Data Subject Rights

CogniCore™ supports the following GDPR data subject rights:

| Right | Implementation |
|---|---|
| Right of access | Admin API: `GET /api/v1/users/{id}/data-export` |
| Right to erasure | Admin API: `DELETE /api/v1/users/{id}` (cascades to recordings, transcripts, analytics) |
| Right to portability | Data export returns JSON-LD with xAPI statements |
| Right to rectification | Users can edit display name and correct transcripts |
| Right to object | Participants can opt out of recording and analytics per session |

### 5.3 Special Category Data (GDPR Article 9)

Medical education sessions may involve discussion of patient cases, clinical data, or health conditions. Operators (institutions) deploying CogniCore™ are responsible for:

- Assessing whether their use case involves special category data.
- Obtaining appropriate consent or legal basis.
- Implementing additional safeguards (e.g., restricting recording, anonymising transcripts).

AT Medical GmbH® provides configuration controls to support these obligations but is a data processor; the operator is the data controller.

---

## 6. Model Versioning and Auditability

### 6.1 Version Tracking

- AI provider SDK versions are pinned in `package.json` and updated via Dependabot PRs.
- Model versions (e.g., Whisper model size, Azure Speech API version) are declared in environment configuration and documented in `CHANGELOG.md`.
- Each ASR transcript stored in the database includes metadata: `provider`, `modelVersion`, `confidence`, `processedAt`.

### 6.2 Audit Log

All security-relevant events are logged with the following fields:

```json
{
  "timestamp": "ISO-8601",
  "actor": { "id": "user-id", "role": "participant" },
  "action": "recording.access",
  "resource": { "type": "recording", "id": "recording-id" },
  "outcome": "success | failure",
  "meta": { "ip": "masked", "userAgent": "..." }
}
```

Audit logs are written to CogniChronicle as xAPI statements and are immutable once written. Retention period: minimum 1 year for compliance purposes.

### 6.3 Incident Response

1. Security incidents must be reported to `security@atmedical.de` within 24 hours of discovery.
2. For data breaches involving personal data, the AT Medical DPO must be notified within 24 hours.
3. GDPR Article 33 notification to supervisory authority: within 72 hours of confirming a breach.
4. See `SECURITY.md` for the public vulnerability disclosure process.

---

## 7. GDPR Compliance

### 7.1 Legal Basis

| Processing Activity | Legal Basis |
|---|---|
| Session facilitation (audio, transcript) | Contract (Art. 6(1)(b)) or Legitimate Interest |
| Recording storage | Consent (Art. 6(1)(a)) — explicit opt-in per session |
| xAPI analytics | Legitimate interest; pseudonymised |
| AI model processing (third-party providers) | Data processing agreement (Art. 28) |

### 7.2 Article 22 — Automated Decision-Making

CogniCore™ uses AI for:
- Real-time speech-to-text transcription
- Real-time translation

**These are informational tools only.** No automated decisions with legal or similarly significant effects are made based on AI output without human oversight. This is enforced by design:

- Transcripts are displayed as suggestions; users can correct them.
- No scoring, grading, or access decisions are made by AI systems.
- If automated grading or competency assessment features are added in future, a full Data Protection Impact Assessment (DPIA) is required before deployment.

### 7.3 Data Protection Impact Assessment (DPIA)

A DPIA is required before deploying new features that:
- Introduce systematic processing of special category data (GDPR Art. 9).
- Use automated processing to evaluate personal aspects (GDPR Art. 22).
- Involve large-scale processing of participant data in new contexts.

DPIAs are documented in `docs/governance/` and reviewed by the AT Medical DPO.

### 7.4 International Data Transfers

AI provider APIs may transfer data outside the EU/EEA. The following safeguards apply:

| Transfer | Mechanism |
|---|---|
| Azure Cognitive Services | Standard Contractual Clauses (SCCs) + DPA |
| Deepgram | SCC + DPA (evaluated per deployment region) |
| OpenAI Whisper (self-hosted) | No transfer — processed on-premises |
| DeepL | SCC + DPA |

---

## 8. Infrastructure Security

| Control | Details |
|---|---|
| TLS in transit | TLS 1.2+ enforced at gateway and service level |
| WebRTC encryption | DTLS-SRTP for all media streams |
| Database encryption | PostgreSQL TDE at infrastructure level; Prisma connection via SSL |
| Secret management | Environment variables only; no secrets in source code; GitHub Secrets for CI/CD |
| Container scanning | Docker image vulnerability scanning in CI pipeline |
| Dependency scanning | GitHub Dependabot for npm and GitHub Actions; weekly automated PRs |
| SAST | CodeQL analysis on every pull request |
| Network segmentation | Services communicate on internal Docker networks; only gateway is internet-exposed |

---

## 9. Security Testing

| Type | Tool | Frequency |
|---|---|---|
| Static analysis (SAST) | CodeQL | Every PR |
| Dependency vulnerabilities | Dependabot + `npm audit` | Weekly + every PR |
| Secret scanning | GitHub Secret Scanning | Continuous |
| Penetration testing | Third-party (planned annually) | Annual |
| Security regression tests | Jest (`*.security.spec.ts`) | Every PR |

---

## 10. Further Reading

- [SECURITY.md](../SECURITY.md) — Vulnerability disclosure policy
- [Anti-Restreaming Policy](security/anti-restreaming.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md) — System architecture overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Development guidelines
