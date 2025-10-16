'use client';

import { TenantCards } from '@/components/admin/tenant-cards';
import { Button } from '@/components/ui/button';
import { TenantFormDialog } from '@/components/admin/tenant-form-dialog';
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Loader2, Plus } from 'lucide-react';
import type { Tenant } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TenantsPage() {
  const { firestore } = useFirebase();
  const { data: tenants, isLoading, error } = useCollection<Tenant>(
    firestore ? (collection(firestore, 'tenants') as any) : null
  );
  const [localTenants, setLocalTenants] = useState<Tenant[] | null>(null);

  useEffect(() => {
    // Initialize local cache when hook provides tenants
    if (tenants) setLocalTenants(tenants);
  }, [tenants]);

  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail as Tenant;
      setLocalTenants((prev) => {
        if (!prev) return [detail];
        // Avoid duplicates
        if (prev.find((t) => t.id === detail.id)) return prev;
        return [detail, ...prev];
      });
    };
    window.addEventListener('tenant-created', handler as EventListener);
    return () => window.removeEventListener('tenant-created', handler as EventListener);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
          <p className="text-muted-foreground mt-2">{error.message}</p>
        </div>
      ) : (
        <TenantCards tenants={localTenants || tenants || []} />
      )}
    </div>
  );
}
