# Changelog – CogniCore™

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Enterprise directory structure (`configs/`, `metadata/`, `artifacts/`, `templates/`, `scripts/`, `tests/`)
- `metadata/repository-profile.yml` — AT Medical repository profile
- `configs/automation/copilot/repository-purpose.yml` — automation and Copilot configuration
- `CODE_OF_CONDUCT.md` — contributor code of conduct
- `CHANGELOG.md` — this changelog
- `.github/CODEOWNERS` — GitHub code ownership with AT Medical team references
- `.github/workflows/ci-validation.yml` — CI lint, type-check, test, and build pipeline
- `.github/workflows/governance-check.yml` — governance and compliance file checker
- `.github/workflows/tagging-validation.yml` — tag naming convention enforcer
- `.github/workflows/dependency-check.yml` — dependency audit workflow
- `.github/workflows/repository-self-check.yml` — repository structure health check
- `.github/workflows/safe-cleanup.yml` — safe stale-branch cleanup workflow
- `Abschlussbericht_DIG-cognicore.md` — project completion report (Abschlussbericht)
- Version / verification blocks added to `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- Enterprise badges added to `README.md`

### Changed
- `README.md` — updated with enterprise badges and version/verification block
- `SECURITY.md` — updated with version/verification block
- `CONTRIBUTING.md` — updated with version/verification block
- `CODEOWNERS` — moved to `.github/CODEOWNERS` and updated with AT Medical team references

---

## [0.1.0] – 2024-01-01

### Added
- Initial CogniCore™ monorepo structure
- Next.js frontend applications (`web-admin`, `web-teacher`, `web-viewer`, `web-remote`, `web-landing`)
- NestJS backend microservices (`api-core`, `realtime-gateway`, `speech-gateway`, `translation-gateway`, `recording-service`)
- Shared packages (`auth`, `branding`, `config`, `design-tokens`, `sessions`, `types`)
- Turborepo + pnpm workspace configuration
- ESLint, Prettier, TypeScript strict mode
- `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `LICENSE`

---

| Field | Value |
|---|---|
| **Document** | CHANGELOG.md |
| **Repository** | AT-Medical / DIG-cognicore |
| **Type** | Project – Private |
| **Owner** | @AT-Medical/admin-team |
| **Version** | 1.0.0 |
| **Last Updated** | 2026-03-16 |
| **Standard** | AT Medical Enterprise Standard v1 |

---

_© AT Medical GmbH® – All rights reserved._
