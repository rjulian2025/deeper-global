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

is_usable_org_id() {
  local value="$1"
  [ -n "$value" ] && [ "$value" != "null" ] && [ "$value" != "TODO" ]
}

read_committed_org_id() {
  local from_config
  from_config="$(jq -r '.orgId // empty' "$CONFIG")"
  if is_usable_org_id "$from_config"; then
    printf '%s' "$from_config"
    return 0
  fi
  if is_usable_org_id "${VERCEL_ORG_ID:-}"; then
    printf '%s' "$VERCEL_ORG_ID"
    return 0
  fi
  return 1
}

resolve_org_id_via_api() {
  echo "→ Resolving Vercel org ID via API for project ${PROJECT_NAME:-$PROJECT_ID}..."
  local project_json
  project_json="$(curl -fsSL \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" \
    "https://api.vercel.com/v9/projects/${PROJECT_ID}")"
  jq -r '.accountId // .teamId // empty' <<<"$project_json"
}

write_project_json() {
  local org_id="$1"
  mkdir -p "$VERCEL_DIR"
  cat >"$VERCEL_DIR/project.json" <<EOF
{"orgId":"${org_id}","projectId":"${PROJECT_ID}"}
EOF
}

pull_is_org_mismatch() {
  local log_file="$1"
  grep -qiE 'scope|team|organization|org|mismatch|not found|does not have access|wrong (team|scope)' "$log_file"
}

try_vercel_pull() {
  local log_file
  log_file="$(mktemp)"
  if npx --yes vercel@latest pull --yes --environment=production --token="$VERCEL_TOKEN" 2>"$log_file"; then
    rm -f "$log_file"
    return 0
  fi
  cat "$log_file" >&2
  if pull_is_org_mismatch "$log_file"; then
    rm -f "$log_file"
    return 2
  fi
  rm -f "$log_file"
  return 1
}

run_pull_with_org() {
  local org_id="$1"
  write_project_json "$org_id"
  echo "→ Pulling Vercel production environment (org ${org_id}, project ${PROJECT_ID})..."
  cd "$ROOT"
  try_vercel_pull
}

COMMITTED_ORG_ID=""
if COMMITTED_ORG_ID="$(read_committed_org_id)"; then
  echo "→ Using committed org ID from .github/vercel-project.json"
  PULL_STATUS=0
  run_pull_with_org "$COMMITTED_ORG_ID" || PULL_STATUS=$?
  if [ "$PULL_STATUS" -eq 0 ]; then
    :
  elif [ "$PULL_STATUS" -eq 2 ]; then
    echo "→ Committed org ID may be stale; resolving via Vercel API..."
    API_ORG_ID="$(resolve_org_id_via_api)"
    if ! is_usable_org_id "$API_ORG_ID"; then
      echo "::error::Could not resolve Vercel org ID. See .github/vercel-project.md"
      exit 1
    fi
    run_pull_with_org "$API_ORG_ID"
  else
    exit 1
  fi
else
  echo "→ No committed org ID; resolving via Vercel API (see .github/vercel-project.md to commit one)..."
  API_ORG_ID="$(resolve_org_id_via_api)"
  if ! is_usable_org_id "$API_ORG_ID"; then
    echo "::error::Could not resolve Vercel org ID. See .github/vercel-project.md"
    exit 1
  fi
  run_pull_with_org "$API_ORG_ID"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "::error::Expected env file at $ENV_FILE after vercel pull"
  exit 1
fi

echo "→ Production env file ready at .vercel/.env.production.local"
