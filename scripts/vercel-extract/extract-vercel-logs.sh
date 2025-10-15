#!/usr/bin/env bash
set -euo pipefail

# Usage: extract-vercel-logs.sh [project] [output-dir]
# Requires: VERCEL_TOKEN in env (personal token with project:read or logs read)

PROJECT=${1:-$VERCEL_PROJECT}
OUTDIR=${2:-"./vercel-logs"}

if [[ -z "$PROJECT" ]]; then
  echo "Provide VERCEL_PROJECT as first arg or set VERCEL_PROJECT env var"
  echo "Usage: $0 <project> [output-dir]"
  exit 1
fi

mkdir -p "$OUTDIR"

# routes to extract — adjust if your app uses different paths
ROUTES=("/api/store-request" "/api/admin/tenants" "/api/admin/tenants/pending" "/api/admin/tenants/approve" "/api/admin/tenants/reject")

# time window: Vercel API allows filtering by since/until with ISO timestamps; keep blank to fetch recent
SINCE="" # e.g. 2025-10-01T00:00:00Z
UNTIL="" # e.g. 2025-10-15T23:59:59Z

echo "Fetching logs for project: $PROJECT -> $OUTDIR"

for route in "${ROUTES[@]}"; do
  # sanitiize route for filename
  route_file=$(echo "$route" | sed 's/[^a-zA-Z0-9]/_/g')
  out_json="$OUTDIR/logs_${route_file}.ndjson"
  echo "Querying logs for route: $route -> $out_json"

  # Vercel logs REST: https://vercel.com/docs/rest-api#endpoints/insights/list-project-logs
  # We'll query via the Vercel REST endpoint.

  url="https://api.vercel.com/v2/now/inspect/${PROJECT}?url=${route}"

  # If SINCE/UNTIL provided add as query params
  if [[ -n "$SINCE" ]]; then
    url+="&since=${SINCE}"
  fi
  if [[ -n "$UNTIL" ]]; then
    url+="&until=${UNTIL}"
  fi

  # Vercel may rate-limit; we request and dump raw JSON
  curl -sS -H "Authorization: Bearer ${VERCEL_TOKEN}" "$url" \
    | jq -c '.deployments[]?.invocations[]? | {time: .time, url: .url, requestBody: .request.body, responseStatus: .response.status, function: .function?.name}' \
    > "$out_json" || echo "no logs for $route"

  wc -l "$out_json" || true
done

echo "Done. Logs in $OUTDIR"
