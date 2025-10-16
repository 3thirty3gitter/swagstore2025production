import { getAdminApp } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import { TenantEditor } from '@/components/admin/tenant-editor';
import type { Tenant } from '@/lib/types';

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
    const tenant = { id: tenantDoc.id, ...(tenantDoc.data() as any) } as Tenant;
    return <TenantEditor tenant={tenant} />;
  } catch (e) {
    // If admin SDK fails (misconfigured), fallback to notFound to avoid exposing internals.
    console.error('Editor page admin fetch failed:', e);
    return notFound();
  }
}
