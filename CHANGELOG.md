# Changelog – CogniCore™

All notable changes to CogniCore™ will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Enterprise metadata profile (`metadata/repository-profile.yml`)
- Global tag registry (`metadata/tags/global-tags.yml`)
- CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
- CHANGELOG.md (this file)
- GitHub Actions CI/governance workflows
  - `ci.yml` — build, lint, type-check, test pipeline
  - `release.yml` — automated semantic release workflow
  - `corporate-identity.yml` — corporate identity validation
  - `codeql.yml` — CodeQL security analysis
- Dependabot configuration for npm and GitHub Actions
- Branch strategy documentation (`docs/governance/BRANCH_STRATEGY.md`)
- Artifact integration directories (`artifacts/releases`, `artifacts/reports`, `artifacts/exports`)
- Repository self-check script (`scripts/validate/repo-check.sh`)
- Final enterprise upgrade report (`docs/governance/ABSCHLUSSBERICHT.md`)
- Issue templates (bug report, feature request)
- Pull request template

---

## [0.1.0] – 2024-01-01

### Added
- Initial monorepo scaffold with Turborepo and pnpm workspaces
- Frontend applications: `web-admin`, `web-teacher`, `web-viewer`, `web-remote`, `web-landing`
- Backend services: `api-core` (NestJS), `realtime-gateway`, `speech-gateway`, `translation-gateway`, `recording-service`
- Shared packages: `auth`, `branding`, `config`, `design-tokens`, `sessions`, `types`
- Architecture Decision Records (ADRs 001–007)
- Documentation: API, architecture, deployment, integrations, product
- MIT License
- CONTRIBUTING.md
- SECURITY.md
- CODEOWNERS
- ESLint, Prettier, Husky, lint-staged configuration
- `.env.example` with all required environment variables
- Prisma schema for PostgreSQL

---

[Unreleased]: https://github.com/AT-Medical/DIG-cognicore/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AT-Medical/DIG-cognicore/releases/tag/v0.1.0
