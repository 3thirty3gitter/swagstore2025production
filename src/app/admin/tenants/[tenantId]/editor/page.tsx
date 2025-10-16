
'use client';

import { notFound, useParams } from "next/navigation";
import { TenantEditor } from "@/components/admin/tenant-editor";
import type { Tenant } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useFirebase } from "@/firebase";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";

export default function EditorPage() {
    const { firestore } = useFirebase();
    const params = useParams();
    const tenantId = params.tenantId as string;
    
  const { data: tenant, isLoading, error } = useDoc<Tenant>(
    firestore ? (doc(firestore, 'tenants', tenantId) as any) : null
  );

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }

    if (error) {
        return (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <h2 className="text-2xl font-semibold text-destructive">Failed to load tenant</h2>
            <p className="text-muted-foreground mt-2">{error.message}</p>
          </div>
        );
    }

    if (!tenant) {
        notFound();
    }

    return <TenantEditor tenant={tenant} />;
}
