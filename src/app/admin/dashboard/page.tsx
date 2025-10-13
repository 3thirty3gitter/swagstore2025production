'use client';

import { StatCard } from "@/components/admin/stat-card";
import { Product, Tenant, Order } from "@/lib/types";
import { ShoppingBag, Users, Package, Loader2, AlertCircle } from "lucide-react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { useUser } from "@/firebase/auth/use-user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { firestore } = useFirebase();
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verify admin status before allowing access
  useEffect(() => {
    async function verifyAdminAccess() {
      if (userLoading) return;
      
      if (!user) {
        router.push('/login-admin');
        return;
      }

      if (!firestore) return;

      try {
        const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
        
        if (!adminDoc.exists() || adminDoc.data()?.role !== 'admin') {
          setAuthError('Admin access required. Please contact an administrator.');
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin verification failed:', error);
        setAuthError('Unable to verify admin permissions.');
        setIsAdmin(false);
      }
    }

    verifyAdminAccess();
  }, [user, userLoading, firestore, router]);

  // Only fetch data if admin is verified
  const { data: products, isLoading: productsLoading, error: productsError } = useCollection(
    firestore && isAdmin ? collection(firestore, 'products') : null
  );
  
  const { data: tenants, isLoading: tenantsLoading, error: tenantsError } = useCollection(
    firestore && isAdmin ? collection(firestore, 'tenants') : null
  );

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useCollection(
    firestore && isAdmin ? collection(firestore, 'orders') : null
  );

  // Show loading while checking authentication
  if (userLoading || isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }

  // Show error if not admin
  if (isAdmin === false || authError) {
    return (
      <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          {authError || 'You do not have admin permissions to access this area.'}
        </p>
        <p className="text-sm text-gray-500">
          Current user: {user?.email || 'Not authenticated'}
        </p>
      </div>
    );
  }

  // Show errors if Firestore queries failed
  if (productsError || tenantsError || ordersError) {
    return (
      <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Database Access Error</h1>
        <p className="text-gray-600 mb-4">
          Unable to load dashboard data. Please check your permissions.
        </p>
        <details className="text-sm text-gray-500">
          <summary>Error Details</summary>
          <div className="mt-2 text-left">
            {productsError && <p>Products: {productsError.message}</p>}
            {tenantsError && <p>Tenants: {tenantsError.message}</p>}
            {ordersError && <p>Orders: {ordersError.message}</p>}
          </div>
        </details>
      </div>
    );
  }

  const isLoading = productsLoading || tenantsLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard data...</span>
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
        <div className="text-sm text-green-600 font-medium">
          ✅ Admin Access Verified
        </div>
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
          Welcome to SwagStore Admin
        </h2>
        <p className="text-muted-foreground">
          You have full admin access to manage products, tenants, orders, and SwagBucks across the platform.
        </p>
      </div>
    </div>
  );
}
