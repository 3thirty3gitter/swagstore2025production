import { ProductsTable } from "@/components/admin/products-table";
import type { Product, Tenant } from "@/lib/types";
import { getAdminApp } from "@/lib/firebase-admin";

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

async function getProductsData() {
  try {
    const { db } = getAdminApp();
    
    const [productsSnapshot, tenantsSnapshot] = await Promise.all([
      db.collection('products').get(),
      db.collection('tenants').get(),
    ]);

    const products: Product[] = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));

    const tenants: Tenant[] = tenantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tenant));

    return { products, tenants };
  } catch (error) {
    console.error('Error fetching products data:', error);
    return { products: [], tenants: [] };
  }
}

export default async function ProductsPage() {
  const { products, tenants } = await getProductsData();

  return (
    <div>
      <ProductsTable products={products} tenants={tenants} />
    </div>
  );
}
