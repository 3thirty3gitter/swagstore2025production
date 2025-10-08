'use client';

import { ProductsTable } from "@/components/admin/products-table";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import type { Product, Tenant } from "@/lib/types";

export default function ProductsPage() {
  const { firestore } = useFirebase();

  const { data: allProducts, isLoading: productsLoading } = useCollection<Product>(
    firestore ? collection(firestore, 'products') : null
  );

  const { data: allTenants, isLoading: tenantsLoading } = useCollection<Tenant>(
    firestore ? collection(firestore, 'tenants') : null
  );

  const isLoading = productsLoading || tenantsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ProductsTable products={allProducts || []} tenants={allTenants || []} />
    </div>
  );
}
