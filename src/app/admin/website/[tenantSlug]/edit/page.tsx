import { notFound } from 'next/navigation';
import type { Tenant, Product } from "@/lib/types";
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
  const data = doc.data();
  
  // Properly serialize the data to ensure it can be passed to client components
  return JSON.parse(JSON.stringify({
    id: doc.id,
    ...data
  })) as Tenant;
}

async function getTenantProducts(tenantId: string) {
  const { db } = getAdminApp();
  
  const productsSnapshot = await db
    .collection('products')
    .where('tenantIds', 'array-contains', tenantId)
    .get();
  
  return JSON.parse(JSON.stringify(
    productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  )) as Product[];
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

  const tenantProducts = await getTenantProducts(tenant.id);

  return <TenantEditor tenant={tenant} tenantProducts={tenantProducts} />;
}
