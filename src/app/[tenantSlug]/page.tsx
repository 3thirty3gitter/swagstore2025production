import { notFound } from "next/navigation";
import type { Tenant } from "@/lib/types";
import { getAdminApp } from "@/lib/firebase-admin";
import { TenantPageContent } from "@/components/store/tenant-page-content";

// Force dynamic rendering for fresh tenant data
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  try {
    console.log('[getTenantBySlug] Fetching tenant with slug:', slug);
    const { db } = getAdminApp();
    const tenantsRef = db.collection('tenants');
    
    // Try to find by slug first (internal routing)
    let snapshot = await tenantsRef.where('slug', '==', slug).limit(1).get();
    
    // If not found by slug, try by subdomain (in case they're different)
    if (snapshot.empty) {
      console.log('[getTenantBySlug] Not found by slug, trying subdomain:', slug);
      snapshot = await tenantsRef.where('subdomain', '==', slug).limit(1).get();
    }
    
    console.log('[getTenantBySlug] Query snapshot empty:', snapshot.empty);
    
    if (snapshot.empty) {
      console.log('[getTenantBySlug] No tenant found for slug/subdomain:', slug);
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    // Properly serialize to avoid React hydration issues
    const tenant = JSON.parse(JSON.stringify({
      id: doc.id,
      ...data
    })) as Tenant;
    
    console.log('[getTenantBySlug] Found tenant:', tenant.name, tenant.slug);
    return tenant;
  } catch (error) {
    console.error('[getTenantBySlug] Error fetching tenant:', error);
    return null;
  }
}

export default async function TenantPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  console.log('[TenantPage] Rendering for slug:', tenantSlug);
  const tenant = await getTenantBySlug(tenantSlug);

  if (!tenant) {
    console.log('[TenantPage] Tenant not found on server, returning placeholder - client layout will handle it');
    // Don't call notFound() - let the client layout handle loading from API
    // Return a minimal loading state and let client take over
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  console.log('[TenantPage] Rendering content for tenant:', tenant.name);
  return <TenantPageContent tenant={tenant} />;
}
