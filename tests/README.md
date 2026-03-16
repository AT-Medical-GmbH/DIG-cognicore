# Tests Directory

This directory is the top-level home for **integration**, **end-to-end (E2E)**, and
**cross-package** tests for the **CogniCore™** monorepo.

> Unit tests live alongside their source files as `*.spec.ts` / `*.test.ts` within each
> `apps/`, `services/`, or `packages/` workspace.

## Structure

```
tests/
├── integration/    # Cross-service integration test suites
├── e2e/            # End-to-end browser/API tests (Playwright / Supertest)
└── fixtures/       # Shared test fixtures and mock data
```

## Running Tests

```bash
# All unit tests (across workspaces)
pnpm test

# CI mode (with coverage)
pnpm test:ci

# Integration tests only
pnpm --filter @cognicore/tests test:integration

# E2E tests
pnpm --filter @cognicore/tests test:e2e
```

## Coverage

Target coverage thresholds (enforced in CI):

| Layer | Minimum |
|---|---|
| Unit tests | 80 % |
| Integration tests | 70 % |

---

_© AT Medical GmbH® – All rights reserved._
