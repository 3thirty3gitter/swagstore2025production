import { notFound } from 'next/navigation';
import { getAdminApp } from '@/lib/firebase-admin';
import { OrderDetailsClient } from '@/components/admin/order-details-client';

export const dynamic = 'force-dynamic';

async function getOrderDetails(orderId: string) {
  const { db } = getAdminApp();
  
  const orderDoc = await db.collection('orders').doc(orderId).get();
  
  if (!orderDoc.exists) {
    return null;
  }
  
  const data = orderDoc.data();
  
  return {
    id: orderDoc.id,
    ...data,
    // Serialize Timestamp fields
    createdAt: data?.createdAt?.toDate()?.toISOString() || null,
  };
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderDetails(orderId);
  
  if (!order) {
    notFound();
  }

  return <OrderDetailsClient order={order} />;
}