import { getAdminApp } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import { TenantEditor } from '@/components/admin/tenant-editor';
import type { Tenant, Product } from '@/lib/types';

type Props = {
  params: { tenantId: string };
};

export default async function EditorPage({ params }: Props) {
  const { tenantId } = params;
  const { db } = getAdminApp();

  try {
    const tenantRef = db.collection('tenants').doc(tenantId);
    const tenantDoc = await tenantRef.get();
    if (!tenantDoc.exists) return notFound();
    
    // Fetch products assigned to this tenant
    const productsSnapshot = await db.collection('products')
      .where('tenantIds', 'array-contains', tenantId)
      .get();
    
    // Properly serialize data to avoid React serialization issues
    const tenant = JSON.parse(JSON.stringify({
      id: tenantDoc.id,
      ...tenantDoc.data()
    })) as Tenant;
    
    const tenantProducts = JSON.parse(JSON.stringify(
      productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    )) as Product[];
    
    return <TenantEditor tenant={tenant} tenantProducts={tenantProducts} />;
  } catch (e) {
    // If admin SDK fails (misconfigured), fallback to notFound to avoid exposing internals.
    console.error('Editor page admin fetch failed:', e);
    return notFound();
  }
}
