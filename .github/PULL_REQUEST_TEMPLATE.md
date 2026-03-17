# ============================================================
# CogniCore™ – Pull Request Template
# AT Medical GmbH® | DIG-cognicore
# ============================================================

## Description

<!-- Summarise the changes in this PR. What problem does it solve or what feature does it add? -->

Closes # <!-- issue number -->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Performance improvement
- [ ] Refactor (no functional change)
- [ ] Documentation update
- [ ] CI/CD / DevOps change
- [ ] Security fix

---

## Model / Algorithm Changes

<!-- If this PR modifies any AI/ML model integrations, ASR providers, translation engines, or inference pipelines, describe the changes here.
     Leave blank if not applicable. -->

| Field | Details |
| --- | --- |
| Model / provider affected | |
| Change type | (Integration / Config / Swap / Fine-tune / None) |
| Version before → after | |
| Accuracy / quality impact | |

---

## Performance Impact

<!-- Describe the expected performance impact of this change.
     Include benchmarks or profiling results where applicable. -->

- [ ] No performance impact expected
- [ ] Latency change: <!-- e.g. p99 reduced from 200 ms to 150 ms -->
- [ ] Memory change: <!-- e.g. +50 MB per worker instance -->
- [ ] Throughput change:
- [ ] Database query impact: <!-- new queries, index changes, migration -->

---

## Data & Privacy Review

<!-- For changes that affect data handling, answer the following. -->

- [ ] This PR does **not** process or transmit PII or patient data
- [ ] PII / patient data is handled — GDPR review completed
- [ ] Data sent to a third-party provider — legal review completed
- [ ] No new data retention or logging introduced

---

## Checklist

- [ ] Code follows the project style guide (`pnpm lint`)
- [ ] Code is formatted (`pnpm format:check`)
- [ ] TypeScript types pass (`pnpm type-check`)
- [ ] Unit tests added or updated
- [ ] Integration tests pass (`pnpm test:ci`)
- [ ] Documentation updated (README, ADRs, inline comments)
- [ ] Environment variable changes documented in `.env.example`
- [ ] No secrets, credentials, or API keys committed
- [ ] Self-review completed

---

## Risk Classification

- [ ] **Low** — isolated change, easily reversible
- [ ] **Medium** — affects multiple services or shared packages
- [ ] **High** — affects core authentication, data pipeline, or security controls
- [ ] **Critical** — production data migration or breaking API change

---

## Rollback Plan

<!-- Describe how to roll back this change if it causes issues in production. -->

1.
2.

---

## Screenshots / Demo

<!-- If this PR includes UI changes, add screenshots or a short recording. -->
