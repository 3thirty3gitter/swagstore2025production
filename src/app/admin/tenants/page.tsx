'use client';

import { TenantCards } from '@/components/admin/tenant-cards';
import { Button } from '@/components/ui/button';
import { TenantFormDialog } from '@/components/admin/tenant-form-dialog';
import Link from 'next/link';
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Loader2 } from 'lucide-react';
import type { Tenant } from '@/lib/types';

export default function TenantsPage() {
  const { firestore } = useFirebase();
  const { data: tenants, isLoading, error } = useCollection<Tenant>(
    firestore ? (collection(firestore, 'tenants') as any) : null
  );
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Tenant Stores
          </h1>
          <p className="text-muted-foreground">
            Manage team stores with custom subdomains
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TenantFormDialog>
            <Button>+ Create Store</Button>
          </TenantFormDialog>
          {/* Persistent fallback create page in case the dialog trigger is not available in some deployments */}
          <Link href="/admin/tenants/new" passHref>
            <Button asChild variant="outline">
              <a>+ Create Store (page)</a>
            </Button>
          </Link>
        </div>
      </div>
      
      {error ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-destructive">
          <h2 className="text-xl font-semibold text-destructive">Failed to load tenants</h2>
          <p className="text-muted-foreground mt-2">{error.message}</p>
        </div>
      ) : (
        <TenantCards tenants={tenants || []} />
      )}
    </div>
  );
}