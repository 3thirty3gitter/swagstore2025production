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
    const { db } = getAdminApp();
    const tenantsRef = db.collection('tenants');
    const snapshot = await tenantsRef.where('slug', '==', slug).limit(1).get();
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Tenant;
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }
}

export default async function TenantPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const tenant = await getTenantBySlug(tenantSlug);

  if (!tenant) {
    notFound();
  }

  return <TenantPageContent tenant={tenant} />;
}
