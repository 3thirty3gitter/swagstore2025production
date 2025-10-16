import { StatCard } from "@/components/admin/stat-card";
import { ShoppingBag, Users, Package } from "lucide-react";
import { getAdminApp } from "@/lib/firebase-admin";

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  try {
    const { db } = getAdminApp();
    
    const [productsSnapshot, tenantsSnapshot, ordersSnapshot] = await Promise.all([
      db.collection('products').get(),
      db.collection('tenants').get(),
      db.collection('orders').get(),
    ]);

    return {
      totalProducts: productsSnapshot.size,
      totalTenants: tenantsSnapshot.size,
      totalOrders: ordersSnapshot.size,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProducts: 0,
      totalTenants: 0,
      totalOrders: 0,
    };
  }
}

export default async function DashboardPage() {
  const { totalProducts, totalTenants, totalOrders } = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <div className="text-sm text-green-600 font-medium">✅ Admin Area</div>
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
    </div>
  );
}
