#!/usr/bin/env bash
# Pull Vercel Production env vars into .vercel/.env.production.local for CI.
# Requires: VERCEL_TOKEN (GitHub secret), jq, npm/npx vercel CLI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONFIG="$ROOT/.github/vercel-project.json"
VERCEL_DIR="$ROOT/.vercel"
ENV_FILE="$VERCEL_DIR/.env.production.local"

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "::error::Missing VERCEL_TOKEN. Add it once in GitHub → Settings → Secrets → Actions."
  exit 1
fi

if [ ! -f "$CONFIG" ]; then
  echo "::error::Missing $CONFIG"
  exit 1
fi

PROJECT_ID="$(jq -r '.projectId' "$CONFIG")"
PROJECT_NAME="$(jq -r '.projectName // empty' "$CONFIG")"

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "null" ]; then
  echo "::error::projectId missing in $CONFIG"
  exit 1
fi

ORG_ID="${VERCEL_ORG_ID:-}"
if [ -z "$ORG_ID" ]; then
  ORG_ID="$(jq -r '.orgId // empty' "$CONFIG")"
fi

if [ -z "$ORG_ID" ] || [ "$ORG_ID" = "null" ]; then
  echo "→ Resolving Vercel org ID for project ${PROJECT_NAME:-$PROJECT_ID}..."
  PROJECT_JSON="$(curl -fsSL \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" \
    "https://api.vercel.com/v9/projects/${PROJECT_ID}")"
  ORG_ID="$(echo "$PROJECT_JSON" | jq -r '.accountId // .teamId // empty')"
fi

if [ -z "$ORG_ID" ] || [ "$ORG_ID" = "null" ]; then
  echo "::error::Could not resolve Vercel org ID. Set orgId in .github/vercel-project.json or VERCEL_ORG_ID."
  exit 1
fi

mkdir -p "$VERCEL_DIR"
cat >"$VERCEL_DIR/project.json" <<EOF
{"orgId":"${ORG_ID}","projectId":"${PROJECT_ID}"}
EOF

echo "→ Pulling Vercel production environment (project ${PROJECT_ID})..."
cd "$ROOT"
npx --yes vercel@latest pull --yes --environment=production --token="$VERCEL_TOKEN"

if [ ! -f "$ENV_FILE" ]; then
  echo "::error::Expected env file at $ENV_FILE after vercel pull"
  exit 1
fi

echo "→ Production env file ready at .vercel/.env.production.local"
