
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
    
    const { data: tenant, isLoading } = useDoc<Tenant>(
        firestore ? doc(firestore, 'tenants', tenantId) : null
    );

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }

    if (!tenant) {
        notFound();
    }

    return <TenantEditor tenant={tenant} />;
}
