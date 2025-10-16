import { TenantCardsWrapper } from '@/components/admin/tenant-cards-wrapper';
import { Button } from '@/components/ui/button';
import { TenantFormDialog } from '@/components/admin/tenant-form-dialog';
import { Plus } from 'lucide-react';
import type { Tenant } from '@/lib/types';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
  const { db } = getAdminApp();
  
  let tenants: Tenant[] = [];
  let error: string | null = null;

  try {
    const tenantsSnapshot = await db.collection('tenants').get();
    tenants = tenantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tenant));
  } catch (e: any) {
    console.error('Error fetching tenants:', e);
    error = e.message || 'Failed to load tenants';
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Tenant Stores
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage team stores with custom subdomains
          </p>
        </div>
        
        <TenantFormDialog>
          <Button size="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Store
          </Button>
        </TenantFormDialog>
      </div>
      
      {error ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-destructive">
          <h2 className="text-xl font-semibold text-destructive">Failed to load tenants</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      ) : (
        <TenantCardsWrapper initialTenants={tenants} />
      )}
    </div>
  );
}
