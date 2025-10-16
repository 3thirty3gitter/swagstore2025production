# Unused Dependencies and Environment Variables Cleanup

## Summary
Your codebase has leftover dependencies and environment variables from an abandoned Redis/KV integration. These are safe to remove.

## 🗑️ Safe to Remove

### NPM Dependencies (in package.json)
```json
"@vercel/kv": "^3.0.0"  // Vercel KV store - never imported
```

### Vercel Environment Variables
These are **NOT** used anywhere in your codebase and can be deleted from Vercel dashboard:

1. ❌ `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis (not used)
2. ❌ `UPSTASH_REDIS_REST_URL` - Upstash Redis (not used)
3. ❌ `swagstore_KV_URL` - Vercel KV (not used)
4. ❌ `swagstore_KV_REST_API_READ_ONLY_TOKEN` - Vercel KV (not used)
5. ❌ `swagstore_REDIS_URL` - Redis (not used)
6. ❌ `swagstore_KV_REST_API_TOKEN` - Vercel KV (not used)
7. ❌ `swagstore_KV_REST_API_URL` - Vercel KV (not used)

### ⚠️ Environment Variables to KEEP
These are actively used by your Firebase integration:

- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`
- ✅ `NEXT_PUBLIC_ROOT_DOMAIN`
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_CLIENT_EMAIL`
- ✅ `FIREBASE_PRIVATE_KEY`
- ✅ `SITE_ADMIN_TOKEN` (if you're using admin token auth)

## 🔧 Cleanup Steps

### Step 1: Remove NPM Dependencies
Run this command:
```bash
npm uninstall @vercel/kv
```

### Step 2: Clean Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Delete all the Redis/KV variables listed above (the ❌ ones)
3. Keep all the Firebase variables (the ✅ ones)

### Step 3: Verify and Redeploy
After cleanup:
```bash
# 1. Verify build still works
npm run build

# 2. Commit the package.json changes
git add package.json package-lock.json
git commit -m "chore: remove unused Redis/KV dependencies"
git push

# 3. Verify production after Vercel redeploys
./scripts/verify-production.sh
```

## 📊 Impact Analysis

### Before Cleanup:
- Unused dependencies: 1 (@vercel/kv)
- Unused env vars: 7 (all Redis/KV related)
- Bundle size increase: ~50KB (from @vercel/kv)

### After Cleanup:
- Cleaner dependency tree
- Smaller bundle size
- Less confusion about what's actually being used
- Reduced attack surface (fewer credentials)

## 🎯 Benefits

1. **Performance**: Smaller bundle size
2. **Security**: Fewer unused credentials in environment
3. **Clarity**: Obvious what systems you're actually using (Firebase only)
4. **Maintenance**: Less confusion for future development

## ⚠️ Note
The comment in `src/lib/middleware/security.ts` mentions Redis for rate limiting, but the actual implementation uses an in-memory Map. This is fine for development but won't work across multiple serverless instances. If you need distributed rate limiting in the future, you can:
- Use Vercel's built-in rate limiting
- Re-add KV/Redis with proper implementation
- Use Firebase Realtime Database for rate limit tracking
