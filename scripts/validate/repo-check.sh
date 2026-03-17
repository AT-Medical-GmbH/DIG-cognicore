#!/usr/bin/env bash
# ==============================================================
# CogniCore™ – Repository Self-Check Script
# AT Medical Enterprise Standard v1.0
# ==============================================================
# Usage:  bash scripts/validate/repo-check.sh
# Exit 0 = All checks passed
# Exit 1 = One or more checks failed
# ==============================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ERRORS=0
WARNINGS=0

# ── Colour helpers ─────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Colour

ok()   { echo -e "${GREEN}  ✅ $*${NC}"; }
fail() { echo -e "${RED}  ❌ $*${NC}"; ERRORS=$((ERRORS + 1)); }
warn() { echo -e "${YELLOW}  ⚠️  $*${NC}"; WARNINGS=$((WARNINGS + 1)); }
info() { echo -e "${BLUE}  ℹ  $*${NC}"; }

# ── Section header ─────────────────────────────────────────────
section() {
  echo ""
  echo -e "${BLUE}══════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  $*${NC}"
  echo -e "${BLUE}══════════════════════════════════════════════${NC}"
}

# ==============================================================
section "1. Required Root Files"
# ==============================================================

REQUIRED_FILES=(
  "README.md"
  "LICENSE"
  "SECURITY.md"
  "CONTRIBUTING.md"
  "CODE_OF_CONDUCT.md"
  "CHANGELOG.md"
  "CODEOWNERS"
  ".env.example"
  "package.json"
)

for f in "${REQUIRED_FILES[@]}"; do
  if [[ -f "${REPO_ROOT}/${f}" ]]; then
    ok "${f}"
  else
    fail "${f} — MISSING"
  fi
done

# ==============================================================
section "2. Metadata Files"
# ==============================================================

METADATA_FILES=(
  "metadata/repository-profile.yml"
  "metadata/tags/global-tags.yml"
)

for f in "${METADATA_FILES[@]}"; do
  if [[ -f "${REPO_ROOT}/${f}" ]]; then
    ok "${f}"
  else
    fail "${f} — MISSING"
  fi
done

# ==============================================================
section "3. GitHub Configuration"
# ==============================================================

GITHUB_FILES=(
  ".github/dependabot.yml"
  ".github/workflows/ci.yml"
  ".github/workflows/codeql.yml"
  ".github/workflows/corporate-identity.yml"
  ".github/workflows/release.yml"
  ".github/PULL_REQUEST_TEMPLATE.md"
  ".github/ISSUE_TEMPLATE/bug_report.yml"
  ".github/ISSUE_TEMPLATE/feature_request.yml"
)

for f in "${GITHUB_FILES[@]}"; do
  if [[ -f "${REPO_ROOT}/${f}" ]]; then
    ok "${f}"
  else
    fail "${f} — MISSING"
  fi
done

# ==============================================================
section "4. Governance Documentation"
# ==============================================================

GOV_FILES=(
  "docs/governance/BRANCH_STRATEGY.md"
  "docs/governance/ABSCHLUSSBERICHT.md"
)

for f in "${GOV_FILES[@]}"; do
  if [[ -f "${REPO_ROOT}/${f}" ]]; then
    ok "${f}"
  else
    fail "${f} — MISSING"
  fi
done

# ==============================================================
section "5. Artifact Directories"
# ==============================================================

ARTIFACT_DIRS=(
  "artifacts/releases"
  "artifacts/reports"
  "artifacts/exports"
)

for d in "${ARTIFACT_DIRS[@]}"; do
  if [[ -d "${REPO_ROOT}/${d}" ]]; then
    ok "${d}/"
  else
    fail "${d}/ — MISSING"
  fi
done

# ==============================================================
section "6. Corporate Branding"
# ==============================================================

if grep -qi "AT Medical" "${REPO_ROOT}/README.md" 2>/dev/null; then
  ok "AT Medical branding in README.md"
else
  fail "README.md does not mention 'AT Medical'"
fi

if grep -q "MIT License" "${REPO_ROOT}/LICENSE" 2>/dev/null; then
  ok "MIT License present"
else
  fail "LICENSE does not contain MIT License text"
fi

if grep -qi "AT Medical" "${REPO_ROOT}/LICENSE" 2>/dev/null; then
  ok "AT Medical copyright in LICENSE"
else
  fail "LICENSE does not contain AT Medical copyright"
fi

# ==============================================================
section "7. Repository Profile Fields"
# ==============================================================

PROFILE="${REPO_ROOT}/metadata/repository-profile.yml"
if [[ -f "$PROFILE" ]]; then
  REQUIRED_FIELDS=(
    "organization:"
    "department:"
    "product_owner:"
    "classification:"
    "lifecycle:"
    "status:"
  )
  for field in "${REQUIRED_FIELDS[@]}"; do
    if grep -q "$field" "$PROFILE"; then
      ok "Profile field: ${field}"
    else
      fail "Profile field missing: ${field}"
    fi
  done
else
  fail "metadata/repository-profile.yml not found — skipping field checks"
fi

# ==============================================================
section "8. Global Tags"
# ==============================================================

TAGS="${REPO_ROOT}/metadata/tags/global-tags.yml"
if [[ -f "$TAGS" ]]; then
  REQUIRED_TAGS=(
    "organization:"
    "cost_center:"
    "project:"
    "product_line:"
  )
  for tag in "${REQUIRED_TAGS[@]}"; do
    if grep -q "$tag" "$TAGS"; then
      ok "Tag present: ${tag}"
    else
      fail "Tag missing: ${tag}"
    fi
  done
else
  fail "metadata/tags/global-tags.yml not found — skipping tag checks"
fi

# ==============================================================
section "9. README Badges"
# ==============================================================

README="${REPO_ROOT}/README.md"
if [[ -f "$README" ]]; then
  if grep -q "img.shields.io\|badge" "$README"; then
    ok "README.md contains status badges"
  else
    warn "README.md has no status badges — consider adding CI/license badges"
  fi
fi

# ==============================================================
# Summary
# ==============================================================

echo ""
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  SUMMARY${NC}"
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo ""

if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
  echo -e "${GREEN}  🎉 All checks passed — Repository meets AT Medical Enterprise Standard${NC}"
elif [[ $ERRORS -eq 0 ]]; then
  echo -e "${YELLOW}  ✅ No errors, but ${WARNINGS} warning(s) found${NC}"
else
  echo -e "${RED}  ❌ ${ERRORS} error(s) and ${WARNINGS} warning(s) found${NC}"
  echo -e "${RED}     Repository does NOT meet AT Medical Enterprise Standard${NC}"
fi

echo ""
echo "  Errors:   ${ERRORS}"
echo "  Warnings: ${WARNINGS}"
echo ""

exit $ERRORS
