#!/usr/bin/env bash
set -euo pipefail

# Parse NDJSON logs created by extract-vercel-logs.sh
# Extract requestBody if it looks like JSON containing keys typical for tenant submissions

LOGDIR=${1:-"./vercel-logs"}
OUTFILE=${2:-"recovered-tenants.ndjson"}

> "$OUTFILE"

for f in "$LOGDIR"/*.ndjson; do
  if [[ ! -f "$f" ]]; then
    continue
  fi
  echo "Parsing $f"
  # requestBody may be base64 or raw JSON; attempt to decode if base64-ish
  jq -c '.requestBody' "$f" | while IFS= read -r body; do
    # skip null bodies
    if [[ "$body" == "null" ]]; then
      continue
    fi
    # remove surrounding quotes if present
    raw=$(echo "$body" | sed -e 's/^"//' -e 's/"$//' )
    # If looks like base64 (many chars ending with =), try decode
    if echo "$raw" | grep -Eq '^[A-Za-z0-9+/=]{200,}$'; then
      decoded=$(echo "$raw" | base64 -d 2>/dev/null || true)
    else
      decoded="$raw"
    fi

    # Now try to extract JSON objects inside decoded using jq -c
    echo "$decoded" | jq -c 'if type=="object" then . elif (type=="string" and (try (fromjson) catch null)!=null) then (fromjson) else . end' 2>/dev/null | \
      jq -c 'if type=="object" and (.name or .org or .commerce or .contact or .slug) then . else empty end' 2>/dev/null >> "$OUTFILE" || true
  done
done

echo "Recovered tenant candidate lines written to $OUTFILE"
wc -l "$OUTFILE"
