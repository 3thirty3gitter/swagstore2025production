# Pending Tenant to Active Tenant Field Mapping

## Overview
This document outlines how fields from the Store Request Form map to the Tenant database structure.

## Complete Field Mapping

### Identity Fields
| Form Field | Tenant Field | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| `teamName` | `name` | string | ✅ | Primary identifier |
| `teamName` | `storeName` | string | ✅ | Display name for store |
| (auto-generated) | `slug` | string | ✅ | URL-friendly version of teamName |
| (auto-generated) | `subdomain` | string | ✅ | Same as slug, used for subdomain |
| (auto-generated) | `id` | string | ✅ | Format: `tenant_{timestamp}` |

### Contact Information
| Form Field | Tenant Field | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| `contactName` | `contactName` | string | ✅ | Primary contact person |
| `contactEmail` | `contactEmail` | string | ✅ | Email for communications |
| `contactPhone` | `contactPhone` | string | ❌ | Phone number (optional) |

### Location Information
| Form Field | Tenant Field | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| `city` | `city` | string | ❌ | City name |
| `province` | `province` | string | ❌ | Canadian province code |
| `postalCode` | `postalCode` | string | ❌ | Canadian postal code (e.g., A1A 1A1) |

### Organization Information
| Form Field | Tenant Field | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| `teamType` | `teamType` | string | ❌ | e.g., "Hockey Team", "Dance Studio", "School" |
| `organizationLevel` | `organizationLevel` | string | ❌ | e.g., "Minor/Youth", "High School", "College/University", "Professional/Adult" |
| `teamSize` | `teamSize` | string | ❌ | e.g., "1-25", "26-50", "51-100", "100+" |
| `expectedVolume` | `expectedVolume` | string | ❌ | Expected annual sales, e.g., "$500-1000", "$1000-2500" |
| `description` | `description` | string | ❌ | Additional information about the team/organization |

### Request Metadata
| Form Field | Tenant Field | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| `urgency` | `urgency` | string | ❌ | e.g., "ASAP", "1-2 weeks", "3-4 weeks", "Flexible" |
| `logoUrl` | `logoUrl` | string | ❌ | URL to uploaded logo image |
| (auto-generated) | `submittedAt` | Date | ✅ | Timestamp of form submission |
| (hardcoded) | `status` | 'pending' | ✅ | Set to 'pending' on submission |
| (hardcoded) | `isActive` | false | ✅ | Set to false on submission |

### Approval Fields (Set During Approval)
| Field | Type | Set When | Notes |
|-------|------|----------|-------|
| `approvedAt` | Date | On approval | Timestamp when tenant was approved |
| `approvedBy` | string | On approval | ID of admin who approved |
| `status` | 'active' | On approval | Changed from 'pending' to 'active' |
| `isActive` | true | On approval | Changed from false to true |
| `website` | Website | On approval | Default website structure generated |
| `createdAt` | Date | On approval | Set to approval time |

## Status Flow

```
┌──────────────┐
│ Form Submit  │
└──────┬───────┘
       │ status: 'pending'
       │ isActive: false
       ↓
┌──────────────┐
│ Pending      │ → Displayed in /admin/tenants/pending
│ Tenant       │ → Stored in 'pendingTenants' collection
└──────┬───────┘
       │
       ↓ Admin approves
┌──────────────┐
│ Active       │ → status: 'active'
│ Tenant       │ → isActive: true
└──────┬───────┘ → Moved to 'tenants' collection
       │         → Website auto-generated
       │         → Store is live at {subdomain}.swagstore.ca
       ↓
┌──────────────┐
│ Live Store   │
└──────────────┘
```

## Database Collections

### `pendingTenants` Collection
- Stores form submissions immediately
- All fields from the form are preserved
- Used for admin review in pending tenants page

### `tenants` Collection  
- Active tenant records with `status: 'active'`
- Includes all fields from pending tenants plus:
  - `website` object with default structure
  - `approvedAt`, `approvedBy`, `createdAt` timestamps

## API Endpoints

### POST `/api/store-request`
- Accepts form data
- Validates required fields (teamName, contactName, contactEmail)
- Generates slug from teamName
- Creates pending tenant record
- Returns success with tenantId

### GET `/api/store-request`
- Returns all pending tenants
- Ordered by `submittedAt` (newest first)

## Form Validation

### Required Fields
- `teamName` (string, non-empty)
- `contactName` (string, non-empty)
- `contactEmail` (string, valid email format)

### Optional Fields
All other fields are optional but recommended for better tenant management.

## Notes

1. **Slug Generation**: Automatically converts `teamName` to URL-friendly format:
   - Lowercase
   - Removes special characters
   - Replaces spaces with hyphens
   - Example: "Wayne's Hockey Team" → "waynes-hockey-team"

2. **Postal Code Formatting**: Canadian postal codes are auto-formatted to "A1A 1A1" format

3. **Logo Upload**: Logos are uploaded to Firebase Storage and the URL is stored in `logoUrl`

4. **Default Website**: When approved, a default website structure is generated with:
   - Hero section
   - Product list section
   - Basic header configuration

5. **Collection Strategy**: Using separate `pendingTenants` collection allows:
   - Clean separation of pending vs active tenants
   - Easy filtering in admin dashboard
   - Prevents pending tenants from appearing in public queries
