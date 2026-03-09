# Contributing to CogniCore™

Thank you for your interest in contributing to **CogniCore™**, the enterprise meeting-intelligence
platform by AT Medical GmbH®. Please read this guide before opening issues or pull requests.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Commit Convention](#commit-convention)
7. [Pull Request Process](#pull-request-process)
8. [Testing](#testing)
9. [Code Style](#code-style)
10. [Security Issues](#security-issues)

---

## Code of Conduct

By participating in this project you agree to abide by our internal Code of Conduct.
Please treat all contributors with respect and professionalism.

---

## Prerequisites

| Tool  | Minimum Version | Install                              |
| ----- | --------------- | ------------------------------------ |
| Node  | 20.x            | [nvm](https://github.com/nvm-sh/nvm) |
| pnpm  | 9.x             | `npm i -g pnpm`                      |
| Git   | 2.40+           | [git-scm.com](https://git-scm.com)  |

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/AT-Medical-GmbH/DIG-cognicore.git
cd DIG-cognicore

# 2. Use the correct Node version
nvm use   # reads .nvmrc → Node 20

# 3. Install dependencies (all workspaces)
pnpm install

# 4. Copy and configure environment variables
cp .env.example .env
# Edit .env with your local values

# 5. Start all services in development mode
pnpm dev
```

---

## Project Structure

```
DIG-cognicore/
├── apps/              # Next.js frontend applications
├── services/          # NestJS backend microservices
├── packages/          # Shared internal libraries
├── turbo.json         # Turborepo pipeline
├── pnpm-workspace.yaml
└── tsconfig.base.json # Shared TypeScript base config
```

---

## Development Workflow

```bash
pnpm dev          # Start all packages in watch mode
pnpm build        # Build all packages
pnpm lint         # Run ESLint across all packages
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Run Prettier
pnpm type-check   # TypeScript type checking
pnpm test         # Run all tests
```

To work on a single package, use the `--filter` flag:

```bash
pnpm --filter @cognicore/web dev
pnpm --filter @cognicore/api-core build
```

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

**Examples:**

```
feat(web): add live caption overlay component
fix(api-core): resolve JWT expiry edge case
docs: update contributing guide
chore(deps): upgrade turbo to v2
```

---

## Pull Request Process

1. **Branch** from `main` using a descriptive name: `feat/live-captions`, `fix/session-timeout`.
2. Keep PRs **focused and small** – one logical change per PR.
3. Ensure all CI checks pass (`lint`, `type-check`, `test`, `build`).
4. Fill in the **PR template** completely.
5. Request review from the relevant [CODEOWNERS](./CODEOWNERS).
6. A PR requires **at least one approving review** before merge.
7. Squash-merge into `main`.

---

## Testing

```bash
pnpm test              # Run tests once
pnpm test:ci           # Run with coverage (used in CI)
```

- Unit tests live alongside source files: `*.spec.ts` / `*.test.ts`
- Aim for **≥ 80% coverage** on new code
- Integration and E2E tests live under `tests/` within each package

---

## Code Style

- **TypeScript** strict mode is enforced – no `any` without justification
- **ESLint** + **Prettier** are enforced via lint-staged on commit
- Import order: external → internal (`@cognicore/*`) → relative
- Use `type` imports: `import type { Foo } from '...'`

---

## Security Issues

Please **do not** open a public GitHub issue for security vulnerabilities.
Instead, refer to [SECURITY.md](./SECURITY.md) for responsible disclosure instructions.

---

_© AT Medical GmbH® – All rights reserved._
