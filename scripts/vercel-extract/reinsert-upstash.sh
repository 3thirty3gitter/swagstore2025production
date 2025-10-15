#!/usr/bin/env bash
set -euo pipefail

# Reinsert sanitized tenants into Upstash Redis list (approved_tenants or pending_tenants)
# Usage: reinsert-upstash.sh [--dry-run] sanitized.ndjson [approved|pending]

DRY_RUN=true
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  shift
fi

INFILE=${1:-}
TARGET=${2:-approved}

if [[ -z "$INFILE" ]]; then
  echo "Usage: $0 [--dry-run] sanitized.ndjson [approved|pending]"
  exit 1
fi

if [[ -z "${UPSTASH_REDIS_REST_URL:-}" || -z "${UPSTASH_REDIS_REST_TOKEN:-}" ]]; then
  echo "Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in env"
  exit 1
fi

KEY="${TARGET}_tenants"

echo "Reading $INFILE -> will push to key: $KEY (dry-run=$DRY_RUN)"

count=0
while IFS= read -r line; do
  if [[ -z "$line" ]]; then
    continue
  fi
  # Ensure we push compact JSON
  payload=$(echo "$line" | jq -c '.')
  count=$((count+1))
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "DRY: would RPUSH $KEY -> $payload"
  else
    # Upstash REST RPUSH
    body=$(jq -n --arg cmd "rpush" --arg key "$KEY" --argjson val "[$payload]" '{cmd:$cmd, key:$key, argv:$val}')
    resp=$(curl -sS -X POST "$UPSTASH_REDIS_REST_URL" \
      -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
      -H 'Content-Type: application/json' \
      -d "$body")
    echo "$resp"
  fi
done < "$INFILE"

echo "Processed $count items"

