'use client';

import { OrdersTable } from "@/components/admin/orders-table";
import type { Order, Tenant } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function OrdersPage() {
  const { firestore } = useFirebase();

  const { data: allOrders, isLoading: ordersLoading } = useCollection<Order>(
    firestore ? collection(firestore, 'orders') : null
  );
  
  const { data: allTenants, isLoading: tenantsLoading } = useCollection<Tenant>(
    firestore ? collection(firestore, 'tenants') : null
  );

  const isLoading = ordersLoading || tenantsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
      <OrdersTable orders={allOrders || []} tenants={allTenants || []} />
    </div>
  );
}
