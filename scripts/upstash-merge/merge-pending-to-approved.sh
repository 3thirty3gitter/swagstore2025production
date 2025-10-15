#!/usr/bin/env bash
set -euo pipefail

# Merge active/approved-like items from pending_tenants into approved_tenants
# Usage:
#   ./merge-pending-to-approved.sh [--apply]
# By default this is a dry-run and will only print what would be done.

OUTDIR="upstash-merge-output"
mkdir -p "$OUTDIR"

DRY_RUN=1
if [ "${1:-}" = "--apply" ]; then
  DRY_RUN=0
fi

if [ -z "${UPSTASH_REDIS_REST_URL:-}" ] || [ -z "${UPSTASH_REDIS_REST_TOKEN:-}" ]; then
  echo "Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your environment"
  exit 1
fi

echo "Dry run: $([ $DRY_RUN -eq 1 ] && echo yes || echo no)"

echo "Fetching pending_tenants..."
curl -sS -X POST "$UPSTASH_REDIS_REST_URL" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cmd":"lrange","key":"pending_tenants","argv":["0","-1"]}' \
  > "$OUTDIR/pending_raw.json"

if [ ! -s "$OUTDIR/pending_raw.json" ]; then
  echo "No pending_raw.json returned or empty"
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "This script requires jq. Please install jq and re-run."
  exit 1
fi

PENDING_COUNT=$(jq '.result | length' "$OUTDIR/pending_raw.json" || echo 0)
echo "Found $PENDING_COUNT pending items"

jq -r '.result[]' "$OUTDIR/pending_raw.json" > "$OUTDIR/pending.ndjson" || true

# Filter items that appear approved: status === 'active' or isActive === true
awk 'BEGIN{RS="\n"; ORS="\n"} {print}' "$OUTDIR/pending.ndjson" | \
  jq -c 'select(.status=="active" or .isActive==true)' > "$OUTDIR/pending-approved-candidates.ndjson" || true

CANDIDATES=$(wc -l < "$OUTDIR/pending-approved-candidates.ndjson" || echo 0)
echo "Candidates to move to approved: $CANDIDATES"

if [ "$CANDIDATES" -eq 0 ]; then
  echo "No approved-like candidates found in pending_tenants"
  exit 0
fi

if [ $DRY_RUN -eq 1 ]; then
  echo "DRY RUN - sample candidates (up to 3):"
  head -n 3 "$OUTDIR/pending-approved-candidates.ndjson" | jq '.'
  echo "To apply the changes, re-run with --apply"
  exit 0
fi

echo "Applying: pushing candidates into approved_tenants"
while IFS= read -r line; do
  # create body for rpush: argv is an array of values
  body=$(jq -n --arg key "approved_tenants" --arg val "$line" '{cmd:"rpush", key:$key, argv:[ $val ]}')
  resp=$(curl -sS -X POST "$UPSTASH_REDIS_REST_URL" \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$body") || true
  echo "Inserted one item into approved_tenants"
done < "$OUTDIR/pending-approved-candidates.ndjson"

echo "Merge complete. Consider cleaning pending_tenants if appropriate."
