import OrdersTable from '@/components/admin/orders-table';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const { db } = getAdminApp();
  
  let orders: any[] = [];

  try {
    const ordersSnapshot = await db.collection('orders')
      .orderBy('createdAt', 'desc')
      .get();
      
    orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
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
