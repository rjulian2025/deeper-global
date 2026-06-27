#!/usr/bin/env bash
# One-time setup: rotate CRON_SECRET on Vercel production (single source of truth).
#
# GitHub Actions pulls secrets at runtime via VERCEL_TOKEN — do NOT duplicate
# CRON_SECRET in GitHub repository secrets.
#
# Prerequisites:
#   vercel login
#   vercel link --project deeper-global-h65m   (from repo root)
#
# Usage:
#   ./scripts/setup-github-cron-secret.sh
#   ./scripts/setup-github-cron-secret.sh --repo rjulian2025/deeper-global

set -euo pipefail

REPO="rjulian2025/deeper-global"

while [ $# -gt 0 ]; do
  case "$1" in
    --repo)
      REPO="$2"
      shift 2
      ;;
    -h|--help)
      sed -n '1,24p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

command -v vercel >/dev/null || { echo "Install Vercel CLI: npm i -g vercel" >&2; exit 1; }
command -v openssl >/dev/null || { echo "openssl is required" >&2; exit 1; }

NEW_SECRET=$(openssl rand -hex 32)

echo "→ Rotating CRON_SECRET on Vercel production..."
vercel env rm CRON_SECRET production --yes
vercel env add CRON_SECRET production --value "$NEW_SECRET" --yes

echo "→ Set ADMIN_PASSPHRASE for /admin/ console (required; separate from CRON_SECRET)..."
echo "    vercel env add ADMIN_PASSPHRASE production --value \"\$(openssl rand -hex 24)\" --yes"

BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "production/astro" ]; then
  echo "→ Checkout production/astro before redeploy push:"
  echo "    git checkout production/astro && git pull"
  echo "    git commit --allow-empty -m 'chore: redeploy after CRON_SECRET rotation [visit-priority-apply]'"
  echo "    git push origin production/astro"
else
  echo "→ Triggering production redeploy (Vercel must load the new secret)..."
  git commit --allow-empty -m "chore: redeploy after CRON_SECRET rotation [visit-priority-apply]"
  git push origin production/astro
fi

cat <<EOF

Done. CRON_SECRET lives only on Vercel production.

GitHub Actions setup (one-time):
  1. Add VERCEL_TOKEN in GitHub → ${REPO} → Settings → Secrets → Actions
  2. Remove legacy duplicate secrets if present: CRON_SECRET, VERCEL_ORG_ID, VERCEL_PROJECT_ID,
     SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY (only needed on Vercel now)

Verify:
  • /admin/ after deploy (ADMIN_PASSPHRASE only)
  • GET /api/admin/health with Bearer auth
  • Actions → Pipeline Credentials Check
EOF
