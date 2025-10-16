import OrdersTable from '@/components/admin/orders-table';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const { db } = getAdminApp();
  
  let orders: any[] = [];
  let error: string | null = null;

  try {
    const ordersSnapshot = await db.collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(100) // Limit to prevent overwhelming the page
      .get();
      
    orders = ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps to ISO strings for serialization
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });
  } catch (e: any) {
    console.error('Error fetching orders:', e);
    error = e.message || 'Failed to load orders';
  }

  if (error) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage and view all customer orders
          </p>
        </div>
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-destructive">
          <h2 className="text-xl font-semibold text-destructive">Failed to load orders</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and view all customer orders
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
