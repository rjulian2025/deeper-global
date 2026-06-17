#!/usr/bin/env sh
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOG="reports/answer-rewrite/post-rewrite-pipeline.log"
mkdir -p reports/answer-rewrite

echo "=== waiting for rewrite to finish $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG"

while pgrep -f "rewrite-answers-claude.mjs --apply --all" >/dev/null 2>&1; do
  sleep 60
done

echo "=== rewrite finished $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG"
echo "--- QA ---" | tee -a "$LOG"
npm run content:qa-answer-rewrite 2>&1 | tee -a "$LOG"
echo "qa_exit: $?" | tee -a "$LOG"

echo "--- promote dry-run (no --apply) ---" | tee -a "$LOG"
node scripts/promote-answer-rewrite.mjs --all 2>&1 | tee -a "$LOG"
echo "promote_dry_run_exit: $?" | tee -a "$LOG"

echo "=== post-rewrite pipeline complete $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG"
