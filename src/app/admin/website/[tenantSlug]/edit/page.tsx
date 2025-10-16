import { notFound } from 'next/navigation';
import type { Tenant } from "@/lib/types";
import { TenantEditor } from '@/components/admin/tenant-editor';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

async function getTenantBySlug(slug: string) {
  const { db } = getAdminApp();
  
  const tenantsSnapshot = await db
    .collection('tenants')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  
  if (tenantsSnapshot.empty) {
    return null;
  }
  
  const doc = tenantsSnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Tenant;
}

export default async function WebsiteEditorPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const tenant = await getTenantBySlug(tenantSlug);
  
  if (!tenant) {
    notFound();
  }

  return <TenantEditor tenant={tenant} />;
}
