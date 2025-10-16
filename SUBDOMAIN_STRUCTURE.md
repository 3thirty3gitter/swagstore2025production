# Subdomain Structure Documentation

## Date: October 16, 2025

## Overview
This document explains the URL structure for tenant storefronts in the SwagStore platform.

## URL Structure

### Public-Facing URLs
All tenant storefronts are accessed via subdomain structure:
```
https://{subdomain}.swagstore.ca
```

**Examples:**
- `https://vohon.swagstore.ca` - Vohon Dance Club store
- `https://hawks.swagstore.ca` - Hawks Hockey Team store

### Internal Routing
The Next.js middleware rewrites subdomain-based URLs to slug-based paths for internal routing:

**External Request:** `vohon.swagstore.ca/products`
**Internal Rewrite:** `/vohon/products`

This is handled automatically by `src/middleware.ts`.

## Database Structure

### Tenant Model Fields
```typescript
{
  id: string;
  name: string;          // "Vohon Dance Club"
  storeName: string;     // "Vohon Dance Club Store"
  subdomain: string;     // "vohon" -> vohon.swagstore.ca
  slug: string;          // "vohon" -> internal routing /vohon
  // ... other fields
}
```

**Important:** `subdomain` and `slug` should always have the same value. The slug is used for internal routing after middleware rewrites the subdomain URL.

## Key Components Updated

### 1. Tenant Form (`src/components/admin/tenant-form.tsx`)
- Added `subdomain` field to form
- Auto-generates subdomain from tenant name
- Keeps `slug` hidden and synced with `subdomain`
- Shows preview: `https://{subdomain}.swagstore.ca`

### 2. Tenant Schema (`src/lib/actions.ts`)
- Added `subdomain` to `tenantFormSchema`
- Now required when creating/updating tenants

### 3. Admin UI Components
All admin UI now displays subdomain-based URLs:

**Updated Files:**
- `src/app/admin/tenants/[tenantId]/page.tsx`
- `src/app/admin/website/page.tsx`
- `src/app/admin/tenants/tenant-card.tsx`
- `src/components/admin/tenant-cards.tsx`
- `src/components/admin/tenants-table.tsx`
- `src/components/admin/tenant-editor.tsx`

**Changes:**
- Removed fallback logic (`tenant.subdomain || tenant.slug`)
- All "View Storefront" links use: `https://${tenant.subdomain}.swagstore.ca`
- Table displays show subdomain instead of slug
- Editor iframe loads via subdomain URL

### 4. Middleware (`src/middleware.ts`)
Unchanged - continues to:
1. Extract subdomain from hostname
2. Rewrite to slug-based path
3. Skip admin/API routes

## Migration Notes

### For Existing Tenants
All tenants must have a `subdomain` field. If missing:
1. Set `subdomain` equal to existing `slug` value
2. Update tenant document in Firestore

### For New Tenants
The form automatically:
1. Generates subdomain from team name
2. Sets slug to match subdomain
3. Both are validated and required

## Testing Checklist

- [ ] Create new tenant - verify subdomain is set
- [ ] Visit `{subdomain}.swagstore.ca` - store loads
- [ ] Admin pages show correct subdomain URLs
- [ ] "View Storefront" buttons work
- [ ] Editor iframe loads storefront correctly
- [ ] Cart/checkout URLs maintain subdomain

## No Path-Based Routing

❌ **NOT USED:**
- `swagstore.ca/vohon`
- `swagstore.ca/{tenant.slug}`

✅ **CORRECT:**
- `vohon.swagstore.ca`
- `{tenant.subdomain}.swagstore.ca`

## Summary

The platform uses **subdomain-only** structure for all public-facing tenant stores. The middleware handles the translation to internal slug-based routing transparently. All admin UI, forms, and links have been updated to reflect this structure exclusively.
