'use client';

import { StatCard } from "@/components/admin/stat-card";
import { Product, Tenant, Order } from "@/lib/types";
import { ShoppingBag, Users, Package, Loader2 } from "lucide-react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection } from "firebase/firestore";
import { useFirebase } from "@/firebase";

export default function DashboardPage() {
  const { firestore } = useFirebase();

  const { data: products, isLoading: productsLoading } = useCollection(
    firestore ? collection(firestore, 'products') : null
  );
  
  const { data: tenants, isLoading: tenantsLoading } = useCollection(
    firestore ? collection(firestore, 'tenants') : null
  );

  const { data: orders, isLoading: ordersLoading } = useCollection(
     firestore ? collection(firestore, 'orders') : null
  );

  const isLoading = productsLoading || tenantsLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalProducts = products?.length || 0;
  const totalTenants = tenants?.length || 0;
  const totalOrders = orders?.length || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Products"
          value={totalProducts}
          icon={ShoppingBag}
          description="Number of products in catalog"
        />
        <StatCard 
          title="Total Tenants"
          value={totalTenants}
          icon={Users}
          description="Number of active storefronts"
        />
        <StatCard 
          title="Total Orders"
          value={totalOrders}
          icon={Package}
          description="Number of orders across all tenants"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Welcome to SwagStore
        </h2>
        <p className="text-muted-foreground">
          This is your admin dashboard. You can manage your products, tenants, and orders from here.
        </p>
      </div>
    </div>
  );
}
