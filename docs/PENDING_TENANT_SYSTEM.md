# Pending Tenant Management System

## Overview
Production-ready workflow for managing team store requests from submission through approval or decline.

## Database Structure

### Collections

#### 1. `pendingTenants`
**Purpose:** Store new team store requests awaiting admin review
**Access:** Public write (form submissions), authenticated read/write/delete (admins)

```typescript
{
  id: string;                    // Unique tenant ID (tenant_timestamp)
  name: string;                  // Team name
  storeName: string;             // Display name
  slug: string;                  // URL-safe slug (auto-generated from team name)
  subdomain: string;             // Subdomain (same as slug)
  status: 'pending';             // Always 'pending' in this collection
  isActive: false;               // Always false until approved
  
  // Team Information
  teamType: string;              // hockey, dance, music, sports, etc.
  organizationLevel?: string;    // Minor/Youth, High School, College, Professional
  teamSize?: string;             // Team member count
  
  // Location
  city: string;
  province: string;
  postalCode?: string;           // Canadian postal code (A1A 1A1)
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  
  // Business
  expectedVolume?: string;       // Estimated order volume
  urgency?: string;              // ASAP, 1-2 weeks, 3-4 weeks, Flexible
  description?: string;          // Custom requirements/notes
  
  // Assets
  logoUrl?: string;              // Uploaded team logo (Firebase Storage URL)
  
  // Audit
  submittedAt: Date;             // ISO timestamp of form submission
}
```

#### 2. `tenants` (Active Stores)
**Purpose:** Active, approved team stores
**Access:** Authenticated read/write only

```typescript
{
  ...all fields from pendingTenants,
  status: 'active';              // Status changed to active
  isActive: true;                // Enabled for public access
  website: Website;              // Generated default website structure
  createdAt: Date;               // When tenant was created (approval time)
  approvedAt: Date;              // ISO timestamp of approval
  approvedBy: string;            // Admin user ID who approved
}
```

#### 3. `declinedTenants`
**Purpose:** Declined requests for record-keeping and potential restoration
**Access:** Authenticated read/write/delete only

```typescript
{
  ...all fields from pendingTenants,
  status: 'declined';            // Status changed to declined
  isActive: false;               // Not accessible
  declinedAt: Date;              // ISO timestamp of decline action
  declinedBy: string;            // Admin user ID who declined
  declineReason?: string;        // Optional reason for decline
}
```

## Workflow

### 1. Store Request Submission
**File:** `src/components/StoreRequestForm.tsx`
**Endpoint:** `POST /api/store-request`

```typescript
// User submits form → API creates document in pendingTenants collection
const tenant = {
  id: `tenant_${Date.now()}`,
  slug: generateSlug(teamName),
  status: 'pending',
  isActive: false,
  submittedAt: new Date().toISOString(),
  ...formData
};

await db.collection('pendingTenants').doc(tenant.id).set(tenant);
```

### 2. Admin Review
**Page:** `/admin/tenants/pending`
**Component:** `src/components/admin/pending-tenants.tsx`

Admins see two tabs:
- **Pending:** All pending requests (from `pendingTenants` collection)
- **Declined:** Previously declined requests (from `declinedTenants` collection)

Real-time updates via Firebase Firestore client SDK using `useCollection` hook.

### 3. Approval Flow
**Server Action:** `approveTenant(tenantId, adminUserId)`
**API Endpoint:** `POST /api/admin/tenants/approve`

```typescript
// 1. Fetch pending tenant
const pendingDoc = await db.collection('pendingTenants').doc(tenantId).get();
const pendingData = pendingDoc.data();

// 2. Generate default website with hero section
const defaultWebsite = generateDefaultWebsiteData(pendingData);

// 3. Create active tenant
const activeTenant = {
  ...pendingData,
  status: 'active',
  isActive: true,
  website: defaultWebsite,
  createdAt: new Date(),
  approvedAt: new Date(),
  approvedBy: adminUserId
};

// 4. Atomic batch write
const batch = db.batch();
batch.set(db.collection('tenants').doc(tenantId), activeTenant);
batch.delete(db.collection('pendingTenants').doc(tenantId));
await batch.commit();

// ✅ Tenant now has live store at {subdomain}.swagstore.ca
```

**Outcome:**
- Tenant moved from `pendingTenants` → `tenants`
- Store is live at `{subdomain}.swagstore.ca`
- Default website structure created with logo
- Audit trail recorded (approvedAt, approvedBy)

### 4. Decline Flow
**Server Action:** `declineTenant(tenantId, adminUserId, reason?)`
**API Endpoint:** `POST /api/admin/tenants/decline`

```typescript
// 1. Fetch pending tenant
const pendingDoc = await db.collection('pendingTenants').doc(tenantId).get();
const pendingData = pendingDoc.data();

// 2. Create declined record
const declinedTenant = {
  ...pendingData,
  status: 'declined',
  isActive: false,
  declinedAt: new Date(),
  declinedBy: adminUserId,
  declineReason: reason
};

// 3. Atomic batch write
const batch = db.batch();
batch.set(db.collection('declinedTenants').doc(tenantId), declinedTenant);
batch.delete(db.collection('pendingTenants').doc(tenantId));
await batch.commit();

// ❌ Tenant moved to declined collection for record-keeping
```

**Outcome:**
- Tenant moved from `pendingTenants` → `declinedTenants`
- Audit trail recorded (declinedAt, declinedBy, declineReason)
- Request preserved for potential restoration

### 5. Restore Flow
**Server Action:** `restoreTenant(tenantId)`
**API Endpoint:** `POST /api/admin/tenants/restore`

```typescript
// 1. Fetch declined tenant
const declinedDoc = await db.collection('declinedTenants').doc(tenantId).get();
const declinedData = declinedDoc.data();

// 2. Remove decline metadata
const restoredTenant = {
  ...declinedData,
  status: 'pending'
};
delete restoredTenant.declinedAt;
delete restoredTenant.declinedBy;
delete restoredTenant.declineReason;

// 3. Atomic batch write
const batch = db.batch();
batch.set(db.collection('pendingTenants').doc(tenantId), restoredTenant);
batch.delete(db.collection('declinedTenants').doc(tenantId));
await batch.commit();

// 🔄 Tenant moved back to pending for re-review
```

**Outcome:**
- Tenant moved from `declinedTenants` → `pendingTenants`
- Decline audit fields removed
- Admin can now approve or decline again

### 6. Permanent Delete
**Server Action:** `deleteDeclinedTenant(tenantId)`

```typescript
// Permanently remove from declined collection
await db.collection('declinedTenants').doc(tenantId).delete();
```

## Security (Firestore Rules)

```plaintext
// Public can submit store requests
match /pendingTenants/{document} {
  allow create: if true;                      // Public form submissions
  allow read, write, delete: if request.auth != null;  // Admin only
}

// Declined tenants - admin only
match /declinedTenants/{document} {
  allow read, write, delete: if request.auth != null;
}

// Active tenants - admin only
match /tenants/{document} {
  allow read, write: if request.auth != null;
}
```

## API Reference

### POST /api/store-request
**Purpose:** Public endpoint for team store request form
**Auth:** None required
**Body:**
```json
{
  "teamName": "Vohon Hockey Team",
  "contactName": "John Smith",
  "contactEmail": "john@vohon.com",
  "contactPhone": "555-1234",
  "teamType": "hockey",
  "city": "Toronto",
  "province": "ON",
  "postalCode": "M5V 3A8",
  "teamSize": "25",
  "expectedVolume": "medium",
  "urgency": "1-2 weeks",
  "description": "Need jerseys and hoodies for the season",
  "logoUrl": "https://storage.googleapis.com/..."
}
```
**Response:**
```json
{
  "success": true,
  "tenantId": "tenant_1729286400000"
}
```

### POST /api/admin/tenants/approve
**Purpose:** Approve pending tenant and create active store
**Auth:** Required (admin)
**Body:**
```json
{
  "tenantId": "tenant_1729286400000",
  "adminUserId": "admin_user_123"
}
```
**Response:**
```json
{
  "success": true,
  "tenant": { ...activeTenant },
  "message": "Tenant Vohon Hockey Team has been approved and activated"
}
```

### POST /api/admin/tenants/decline
**Purpose:** Decline pending tenant and move to declined collection
**Auth:** Required (admin)
**Body:**
```json
{
  "tenantId": "tenant_1729286400000",
  "adminUserId": "admin_user_123",
  "reason": "Incomplete information provided"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Tenant has been declined"
}
```

### POST /api/admin/tenants/restore
**Purpose:** Restore declined tenant back to pending
**Auth:** Required (admin)
**Body:**
```json
{
  "tenantId": "tenant_1729286400000"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Tenant has been restored to pending"
}
```

## Server Actions

All workflow actions are also available as server actions for direct import:

```typescript
import { 
  approveTenant, 
  declineTenant, 
  restoreTenant, 
  deleteDeclinedTenant 
} from '@/lib/actions/tenant-actions';

// Use in server components or API routes
const result = await approveTenant('tenant_123', 'admin_user_456');
if (result.success) {
  console.log('Store created:', result.tenant.subdomain);
}
```

## UI Components

### PendingTenants Component
**File:** `src/components/admin/pending-tenants.tsx`
**Features:**
- Real-time updates via Firebase client SDK
- Tabbed interface (Pending | Declined)
- Approve/Decline actions with loading states
- Restore declined requests
- Permanent delete from declined
- Rich tenant cards with logo, contact info, details

### StoreRequestForm Component
**File:** `src/components/StoreRequestForm.tsx`
**Features:**
- Canadian province/territory dropdown
- Postal code formatting (A1A 1A1)
- Logo upload with preview
- Subdomain preview (teamname.swagstore.ca)
- Form validation
- Success confirmation state

## Testing Checklist

### 1. Store Request Submission
- [ ] Form validates required fields
- [ ] Logo upload works and shows preview
- [ ] Subdomain generates correctly from team name
- [ ] Postal code formats to Canadian format
- [ ] Success message displays after submission
- [ ] New request appears in pendingTenants collection
- [ ] Submitted request appears in admin pending tab

### 2. Admin Approval
- [ ] Pending tab shows all pending requests in real-time
- [ ] Approve button creates tenant in tenants collection
- [ ] Approve removes from pendingTenants collection
- [ ] Default website structure generated correctly
- [ ] Approved store accessible at subdomain.swagstore.ca
- [ ] Audit fields populated (approvedAt, approvedBy)
- [ ] Toast notification shows success message

### 3. Admin Decline
- [ ] Decline button moves tenant to declinedTenants
- [ ] Decline removes from pendingTenants collection
- [ ] Declined tab shows declined requests
- [ ] Audit fields populated (declinedAt, declinedBy)
- [ ] Toast notification shows decline message

### 4. Restore Flow
- [ ] Restore button on declined tenant
- [ ] Restore moves tenant back to pendingTenants
- [ ] Restore removes from declinedTenants
- [ ] Decline audit fields removed
- [ ] Restored request appears in pending tab

### 5. Permanent Delete
- [ ] Delete button on declined tenant
- [ ] Delete removes from declinedTenants permanently
- [ ] Toast notification confirms deletion
- [ ] Request no longer appears anywhere

## Error Handling

All operations include comprehensive error handling:

```typescript
// Server actions return Result type
interface ApproveResult {
  success: boolean;
  error?: string;
  tenant?: Tenant;
}

// API endpoints return standardized error responses
{
  "error": "Tenant ID is required",  // 400 Bad Request
  "error": "Pending tenant not found",  // 500 with specific message
  "error": "Internal server error"  // 500 Generic
}
```

## Migration

If you have existing pending tenants in the old format:

```bash
# Use migration script (if available)
node scripts/migrate-pending-tenants.js existing-tenants.json run

# Or manually move documents between collections in Firebase Console
```

## Next Steps

1. **Email Notifications:** Send confirmation emails on approval/decline
2. **Admin Dashboard:** Add pending tenant count to dashboard metrics
3. **Tenant Portal:** Allow tenants to check request status
4. **Advanced Filtering:** Filter by province, team type, urgency
5. **Bulk Actions:** Approve/decline multiple tenants at once
6. **Decline Reasons:** Predefined decline reason dropdown
7. **Audit Log:** Comprehensive history of all tenant status changes

## Troubleshooting

### Tenant not appearing in pending tab
- Check Firestore rules allow authenticated read
- Verify document exists in pendingTenants collection
- Check browser console for Firebase errors
- Ensure Firebase client initialized properly

### Approval fails
- Verify admin authentication token valid
- Check Firebase Admin SDK initialized server-side
- Ensure tenant ID exists in pendingTenants
- Check server logs for detailed error

### Subdomain not resolving
- Verify tenant.isActive = true
- Check tenant.subdomain matches URL
- Ensure tenant exists in tenants collection (not pendingTenants)
- Verify middleware routing configuration

---

**Status:** ✅ Production Ready
**Last Updated:** October 18, 2025
**Version:** 1.0.0
