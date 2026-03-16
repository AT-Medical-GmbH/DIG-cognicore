# Branch Strategy – CogniCore™

> AT Medical GmbH® | Enterprise Branch Governance v1.0

---

## Overview

CogniCore™ follows **GitHub Flow** with enterprise extensions for compliance, release governance, and parallel workstream management.

---

## Branch Types

| Branch | Pattern | Description | Protected |
|--------|---------|-------------|-----------|
| `main` | `main` | Production-ready code. All merges require PR + CI pass + review. | ✅ Yes |
| `staging` | `staging` | Pre-production integration branch. | ✅ Yes |
| `feature/*` | `feature/<ticket-id>-short-description` | New feature development. | ❌ No |
| `fix/*` | `fix/<ticket-id>-short-description` | Bug fixes. | ❌ No |
| `chore/*` | `chore/<short-description>` | Maintenance tasks, dependency updates, refactoring. | ❌ No |
| `hotfix/*` | `hotfix/<ticket-id>-short-description` | Urgent production fixes. Merges directly to `main` and `staging`. | ❌ No |
| `release/*` | `release/v<major>.<minor>.<patch>` | Release stabilisation branches. | ❌ No |
| `docs/*` | `docs/<short-description>` | Documentation-only changes. | ❌ No |
| `experiment/*` | `experiment/<short-description>` | Spikes, PoCs, experiments. Not merged to main without review. | ❌ No |

---

## Branch Naming Rules

- Use **lowercase kebab-case** for all branch names.
- Include a **ticket ID** where applicable (`feature/COGNI-123-add-polling`).
- Keep names **short and descriptive**.
- Avoid special characters except `-` and `/`.

**✅ Good examples:**
```
feature/COGNI-101-live-captions-overlay
fix/COGNI-88-session-join-crash
chore/upgrade-nestjs-v10
hotfix/COGNI-210-auth-token-expiry
release/v1.2.0
```

**❌ Bad examples:**
```
my-branch
FEATURE_NewThing
john-working-on-stuff
```

---

## Workflow

### Standard Feature Flow

```
main ─────────────────────────────────────────────► main
       │                                        ▲
       └─► feature/COGNI-XXX-desc ─────────────┘
               (PR + review + CI)
```

1. Create branch from `main`: `git checkout -b feature/COGNI-XXX-desc`
2. Develop, commit using [Conventional Commits](https://www.conventionalcommits.org/)
3. Push and open Pull Request targeting `main`
4. Ensure all CI checks pass
5. Request review from relevant CODEOWNERS
6. Squash-merge after approval

### Hotfix Flow

```
main ──────────────────────────────────► main
       │                            ▲
       └─► hotfix/COGNI-XXX-desc ──┤
                                    └─► staging
```

1. Create branch from `main`
2. Fix, test, commit
3. Open PRs targeting both `main` and `staging`
4. After merge to `main`, tag a patch release

### Release Flow

```
staging ─────────────────────────────► main
       │                          ▲
       └─► release/v1.2.0 ────────┘
              (RC testing, bump version)
```

1. Cut `release/v1.2.0` from `staging` when feature-complete
2. Only bug fixes committed to the release branch
3. Merge to `main`, tag `v1.2.0`
4. Back-merge tag to `staging`

---

## Commit Convention

All commits **must** follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change that is neither fix nor feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |
| `revert` | Revert a previous commit |

### Examples

```
feat(polling): add real-time poll result streaming
fix(auth): prevent session token expiry race condition
chore(deps): upgrade socket.io to v4.7
docs(api): add OpenAPI spec for captions endpoint
ci: add CodeQL scheduled scan on staging
```

---

## Pull Request Rules

- Every PR must reference at least one issue or ticket (e.g. `Closes COGNI-101`)
- PR title must follow Conventional Commits format
- PRs must not be self-merged
- All CI checks must be green before merge
- At least **1 approving review** required for `main`; **2 reviews** for releases
- Delete the branch after merge

---

## Protected Branch Rules (`main`, `staging`)

| Rule | Setting |
|------|---------|
| Require pull request before merging | ✅ Enabled |
| Require approvals | ✅ 1 (main), 2 (releases) |
| Dismiss stale reviews | ✅ Enabled |
| Require review from Code Owners | ✅ Enabled |
| Require status checks to pass | ✅ Enabled (CI, corporate-identity) |
| Require branches to be up to date | ✅ Enabled |
| Restrict force pushes | ✅ Blocked |
| Restrict deletions | ✅ Blocked |

---

## Stale Branch Policy

- Feature/fix branches merged to `main` are **deleted immediately** after merge.
- Any branch older than **90 days** without activity should be reviewed and either merged, archived, or deleted.
- `experiment/*` branches are excluded from deletion automation.

---

*Last updated: 2026-03-16 | Owner: AT-Medical-GmbH/platform-core*
