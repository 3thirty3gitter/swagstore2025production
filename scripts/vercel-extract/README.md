Vercel Logs Extraction & Tenant Recovery

Purpose

This folder contains scripts and instructions to extract serverless function logs from Vercel, parse request bodies for tenant submissions, sanitize payloads (remove base64 logos), and prepare files for reinsertion into Upstash Redis. Use these if you need to recover tenant submissions that were cleaned.

Security

- Do NOT commit your Vercel token or Upstash credentials into the repo. Provide them as environment variables.
- Scripts expect environment variables: VERCEL_TOKEN and optionally UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN when re-inserting.

Files

- extract-vercel-logs.sh - Fetch logs for specific routes and save them to JSON files
- parse-tenant-bodies.sh - Parse the saved logs, extract JSON request bodies that look like tenant payloads, and save them as NDJSON
- sanitize-tenants.py - Python script that reads NDJSON, strips/flags base64 logos, optionally uploads images to object storage (not implemented), and emits sanitized JSON lines
- reinsert-upstash.sh - Example script to reinsert sanitized tenants back into Upstash (dry-run by default)

Quick run (example)

1. Export your Vercel token in your shell (local machine):

```bash
export VERCEL_TOKEN="<your_vercel_token>"
export VERCEL_PROJECT="<your_vercel_project_name_or_id>"  # optional, script will ask
```

2. Fetch logs for store-request and admin endpoints (date range optional):

```bash
scripts/vercel-extract/extract-vercel-logs.sh
```

3. Parse extracted logs and create raw tenant NDJSON:

```bash
scripts/vercel-extract/parse-tenant-bodies.sh
```

4. Sanitize recovered payloads:

```bash
python3 scripts/vercel-extract/sanitize-tenants.py recovered-tenants.ndjson sanitized-tenants.ndjson
```

5. (Optional) Re-insert sanitized payloads into Upstash (dry-run first):

```bash
scripts/vercel-extract/reinsert-upstash.sh --dry-run sanitized-tenants.ndjson
```

If you want me to run these here, paste the Vercel token into the terminal via environment variables and tell me to run the extraction (or run them locally yourself).