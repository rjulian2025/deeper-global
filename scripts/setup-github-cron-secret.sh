#!/usr/bin/env bash
# One-time setup: sync CRON_SECRET between Vercel production and GitHub Actions.
#
# Vercel dashboard cannot copy encrypted secrets. Rotate once via CLI and set
# the same value in both places in a single terminal session.
#
# Prerequisites:
#   vercel login
#   vercel link --project deeper-global-www-production   (from repo root)
#   gh auth login
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
      sed -n '1,20p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

command -v vercel >/dev/null || { echo "Install Vercel CLI: npm i -g vercel" >&2; exit 1; }
command -v gh >/dev/null || { echo "Install GitHub CLI: https://cli.github.com/" >&2; exit 1; }
command -v openssl >/dev/null || { echo "openssl is required" >&2; exit 1; }

NEW_SECRET=$(openssl rand -hex 32)

echo "→ Rotating CRON_SECRET on Vercel production..."
vercel env rm CRON_SECRET production --yes
vercel env add CRON_SECRET production --value "$NEW_SECRET" --yes

echo "→ Setting GitHub repository secret CRON_SECRET..."
gh secret set CRON_SECRET --body "$NEW_SECRET" --repo "$REPO"

BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "production/astro" ]; then
  echo "→ Checkout production/astro before redeploy push:"
  echo "    git checkout production/astro && git pull"
  echo "    git commit --allow-empty -m 'chore: redeploy after CRON_SECRET sync [visit-priority-apply]'"
  echo "    git push origin production/astro"
else
  echo "→ Triggering production redeploy (Vercel must load the new secret)..."
  git commit --allow-empty -m "chore: redeploy after CRON_SECRET sync to GitHub [visit-priority-apply]"
  git push origin production/astro
fi

cat <<EOF

Done. CRON_SECRET is now synced between Vercel and GitHub.

Next:
  1. Wait for the Vercel production deploy to finish.
  2. GitHub Actions will run the visit-priority pipeline (apply=true on this push).
  3. Weekly canary: Actions → Pipeline Credentials Check (Mondays 12:00 UTC).

Future batches: merge draft JSON to production/astro → auto-apply, no manual steps.
EOF
