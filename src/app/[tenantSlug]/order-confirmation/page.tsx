'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Loader2, Package, Mail, Phone, MapPin } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const { firestore } = useFirebase();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !firestore) return;
      
      try {
        const orderDoc = await getDoc(doc(firestore, 'orders', orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, firestore]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <Link href="/">
          <Button>Return to Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #000;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .print-table th {
            background: #f5f5f5;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #000;
            font-weight: bold;
          }
          .print-table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          .print-total {
            text-align: right;
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
          }
          .print-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 max-w-3xl print-container">
        {/* Print Header - Only visible in print */}
        <div className="hidden print:block print-header">
          <h1 className="text-3xl font-bold mb-2">Order Receipt</h1>
          <p className="text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-sm">{new Date().toLocaleDateString()}</p>
        </div>

        {/* Success Header - Hidden in print */}
        <div className="text-center mb-8 no-print">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Thank You!</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Your order has been confirmed
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Confirmation Email Notice - Hidden in print */}
        <Card className="mb-6 border-blue-200 bg-blue-50 no-print">
          <CardContent className="p-4 flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Confirmation email sent</p>
              <p className="text-sm text-blue-700">
                We've sent a confirmation to <strong>{order.customer.email}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">Order Details</h2>
            
            {/* Order Items Table - Print friendly */}
            <table className="print-table w-full">
              <thead className="hidden print:table-header-group">
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, index: number) => (
                  <tr key={index} className="print:border-b">
                    <td>
                      <div className="font-medium">{item.productName}</div>
                      {Object.entries(item.selectedOptions || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="text-sm text-muted-foreground capitalize">
                          {key}: {value}
                        </div>
                      ))}
                    </td>
                    <td className="hidden print:table-cell">{item.quantity}</td>
                    <td className="hidden print:table-cell text-right">${item.price.toFixed(2)}</td>
                    <td className="text-right font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile friendly view - Hidden in print */}
            <div className="space-y-4 mb-6 print:hidden">
              {order.items.map((item: any, index: number) => (
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

            {/* Order Total */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {order.fulfillmentMethod === 'shipping' ? 'Shipping' : 'Pickup'}
                </span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)} CAD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4 no-print" />
                  Contact Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3 no-print" />
                    {order.customer.email}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3 no-print" />
                    {order.customer.phone}
                  </p>
                </div>
              </div>

              {/* Shipping/Pickup Address */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 no-print" />
                  {order.fulfillmentMethod === 'shipping' ? 'Shipping Address' : 'Pickup Location'}
                </h3>
                {order.fulfillmentMethod === 'shipping' ? (
                  <div className="text-sm space-y-1">
                    <p>{order.customer.address}</p>
                    <p>
                      {order.customer.city}, {order.customer.state} {order.customer.postalCode}
                    </p>
                    <p>{order.customer.country}</p>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>You'll receive pickup instructions via email</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="mb-8">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 no-print" />
              <div>
                <p className="font-medium">Payment Confirmed</p>
                <p className="text-sm text-muted-foreground">
                  Transaction ID: {order.paymentId?.slice(0, 16)}...
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Paid
            </span>
          </CardContent>
        </Card>

        {/* Print Footer - Only visible in print */}
        <div className="hidden print:block print-footer">
          <p>Thank you for your business!</p>
          <p className="mt-2">
            Questions? Contact us at support@example.com
          </p>
        </div>

        {/* Action Buttons - Hidden in print */}
        <div className="flex flex-col sm:flex-row gap-3 no-print">
          <Link href="/" className="flex-1">
            <Button size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="flex-1" onClick={() => window.print()}>
            Print Receipt
          </Button>
        </div>

        {/* Help Text - Hidden in print */}
        <div className="mt-8 text-center no-print">
          <p className="text-sm text-muted-foreground">
            Need help with your order? Contact us at{' '}
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}