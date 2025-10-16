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
    const snapshot = await tenantsRef.where('slug', '==', slug).limit(1).get();
    
    console.log('[getTenantBySlug] Query snapshot empty:', snapshot.empty);
    
    if (snapshot.empty) {
      console.log('[getTenantBySlug] No tenant found for slug:', slug);
      return null;
    }

    const doc = snapshot.docs[0];
    const tenant = {
      id: doc.id,
      ...doc.data()
    } as Tenant;
    
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
    console.log('[TenantPage] Tenant not found, calling notFound()');
    notFound();
  }

  console.log('[TenantPage] Rendering content for tenant:', tenant.name);
  return <TenantPageContent tenant={tenant} />;
}
