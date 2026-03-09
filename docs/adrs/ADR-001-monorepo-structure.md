# ADR-001: Monorepo Structure

**Status:** Accepted  
**Date:** 2025-01-01  
**Authors:** CogniCore Architecture Team  

## Context
CogniCore™ comprises multiple applications (web, API, LocalLink), shared packages (UI, types, config), and background services (caption worker, recorder). Organising these as separate repositories increases coordination overhead, versioning complexity, and CI duplication.

## Decision
Adopt a **pnpm workspace monorepo** with Turborepo as the build orchestrator. Directory layout: `apps/`, `packages/`, `services/`.

## Rationale
- Atomic cross-package changes in a single PR.
- Shared TypeScript types guaranteed in sync.
- Turborepo's remote cache reduces CI build time by ~60%.
- pnpm's strict dependency isolation prevents phantom dependency bugs.

## Alternatives Considered
- **Yarn workspaces + Nx:** Considered but Nx's plugin model adds unnecessary complexity for the current team size.
- **Separate repos + npm packages:** Discarded due to high coordination overhead and version skew risk.
- **Lerna:** Deprecated in favour of native workspace tooling.

## Consequences
- **Positive:** Single `git clone`, unified CI pipeline, easy cross-package refactoring.
- **Negative:** Repo size grows over time; requires Turborepo cache hygiene.

## Implementation Notes
- Root `pnpm-workspace.yaml` defines all workspace globs.
- `turbo.json` defines the task pipeline (`build`, `test`, `lint`).
- Each package has its own `package.json` with explicit `exports` map.
