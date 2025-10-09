'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Package, User, MapPin, CreditCard, Loader2, Truck, Store } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId, firestore]);

  const fetchOrder = async () => {
    if (!orderId || !firestore) return;
    
    try {
      const orderDoc = await getDoc(doc(firestore, 'orders', orderId));
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!firestore || !orderId) return;
    
    setUpdating(true);
    try {
      await updateDoc(doc(firestore, 'orders', orderId), {
        status: newStatus,
      });
      
      setOrder({ ...order, status: newStatus });
      
      toast({
        title: 'Status updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date.seconds * 1000);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return format(dateObj, 'PPpp');
    } catch (error) {
      return 'N/A';
    }
  };

  const getOrderTotal = () => {
    if (order?.total !== undefined) return order.total;
    const subtotal = order?.subtotal || 0;
    const tax = order?.tax?.totalTax || 0;
    return subtotal + tax;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/admin/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select 
            value={order.status} 
            onValueChange={handleStatusUpdate}
            disabled={updating}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      {Object.entries(item.selectedOptions || {}).map(([key, value]: [string, any]) => (
                        <p key={key} className="text-sm text-muted-foreground capitalize">
                          {key}: {value}
                        </p>
                      ))}
                      <p className="text-sm text-muted-foreground mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 mt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.subtotal || 0).toFixed(2)}</span>
                </div>
                
                {order.tax && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tax {order.tax.breakdown ? `(${order.tax.breakdown})` : ''}
                    </span>
                    <span>${(order.tax.totalTax || 0).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.fulfillmentMethod === 'shipping' ? 'Shipping' : 'Pickup'}
                  </span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${getOrderTotal().toFixed(2)} CAD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Details</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                    <p className="text-muted-foreground">{order.customer?.email}</p>
                    <p className="text-muted-foreground">{order.customer?.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    {order.fulfillmentMethod === 'shipping' ? (
                      <>
                        <Truck className="h-4 w-4" />
                        Shipping Address
                      </>
                    ) : (
                      <>
                        <Store className="h-4 w-4" />
                        Pickup Location
                      </>
                    )}
                  </h3>
                  {order.fulfillmentMethod === 'shipping' ? (
                    <div className="text-sm space-y-1">
                      <p>{order.customer?.address}</p>
                      <p>
                        {order.customer?.city}, {order.customer?.state} {order.customer?.postalCode}
                      </p>
                      <p>{order.customer?.country}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Customer will pick up at store location
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaction ID</span>
                <span className="text-xs font-mono">
                  {order.paymentId?.slice(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold">${getOrderTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="w-full justify-center py-2">
                {order.status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fulfillment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {order.fulfillmentMethod === 'shipping' ? (
                  <>
                    <Truck className="h-4 w-4" />
                    <span className="capitalize">{order.fulfillmentMethod}</span>
                  </>
                ) : (
                  <>
                    <Store className="h-4 w-4" />
                    <span className="capitalize">{order.fulfillmentMethod}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}