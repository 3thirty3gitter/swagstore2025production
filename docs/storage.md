# Storage (Firebase) — setup & verification

This document explains the environment variables and quick verification steps for Firebase Storage used by the upload API.

## Required environment variables (Vercel / production)

- `FIREBASE_PROJECT_ID` — your Firebase project id
- `FIREBASE_CLIENT_EMAIL` — service account client email
- `FIREBASE_PRIVATE_KEY` — service account private key (newlines escaped as `\n`)
- `FIREBASE_STORAGE_BUCKET` — explicit bucket name (e.g. `my-project.appspot.com`)

Optional:
- `USE_SIGNED_URLS` — `'1'`/`'true'` to enable signed URLs, `'0'`/`'false'` to disable. Default: enabled.
- `SIGNED_URL_EXPIRY_SECONDS` — number of seconds the signed URL should be valid. Default: `86400` (24h).

## How the upload API works

- Endpoint: `POST /api/upload`
- Accepts either:
  - `file` (multipart/form-data) — a File/Blob, or
  - `dataUrl` (string) + `fileName` — a base64 data URL (browser flow uses this)
- The server writes the file to `uploads/<timestamp>_<filename>` in the configured bucket.
- By default the API returns a signed read URL (configurable via `USE_SIGNED_URLS`). If signed URLs are disabled it will attempt to make the object public and return a `https://storage.googleapis.com/...` URL.

## Quick verification (local)

Install dependencies (if needed):

```bash
npm ci
```

Run the smoke upload test (posts a small PNG to production by default):

```bash
npm run test:smoke-upload
```

To test a different base URL (e.g., preview):

```bash
SMOKE_BASE_URL=https://your-preview-url.vercel.app npm run test:smoke-upload
```

## CI suggestion

- Add a step after deploy to run `npm run test:smoke-upload` (use a dedicated account or preview to avoid polluting production). If using signed URLs, ensure the service account on the runner has access to generate signed URLs.

## Security notes

- Prefer signed URLs (recommended) over public objects for sensitive content.
- Rotate service account keys periodically and store secrets in Vercel environment variables.

If you want, I can add a CI workflow that runs the smoke test automatically after each deploy. This will require the runner to have access to the same env vars or to use a preview environment.
