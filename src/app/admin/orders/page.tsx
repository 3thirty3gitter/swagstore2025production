'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import OrdersTable from '@/components/admin/orders-table';
import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
  const { firestore } = useFirebase();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [firestore]);

  const fetchOrders = async () => {
    if (!firestore) return;

    try {
      const ordersQuery = query(
        collection(firestore, 'orders'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
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
