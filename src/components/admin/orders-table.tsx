'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import Link from 'next/link';

interface Order {
  id: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  total?: number;
  subtotal?: number;
  tax?: {
    totalTax?: number;
  };
  status?: string;
  paymentStatus?: string;
  createdAt?: { seconds: number } | Date | null;
  fulfillmentMethod?: string;
}

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const getOrderTotal = (order: Order) => {
    if (order.total !== undefined) {
      return order.total;
    }
    const subtotal = order.subtotal || 0;
    const tax = order.tax?.totalTax || 0;
    return subtotal + tax;
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'outline';
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    if (!status) return 'outline';
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (date?: { seconds: number } | Date | null) => {
    if (!date) return 'N/A';
    
    try {
      let dateObj: Date;
      
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'object' && 'seconds' in date) {
        dateObj = new Date(date.seconds * 1000);
      } else {
        return 'N/A';
      }
      
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      
      return formatDistance(dateObj, new Date(), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Fulfillment</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer hover:bg-accent/50">
              <TableCell className="font-medium">
                <Link 
                  href={`/admin/orders/${order.id}`}
                  className="text-primary hover:underline"
                >
                  #{order.id.slice(0, 8).toUpperCase()}
                </Link>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {order.customer?.firstName || 'N/A'} {order.customer?.lastName || ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer?.email || 'No email'}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {(order.items?.length || 0)} item{(order.items?.length || 0) !== 1 ? 's' : ''}
              </TableCell>
              <TableCell className="font-semibold">
                ${(getOrderTotal(order) || 0).toFixed(2)}
              </TableCell>
              <TableCell className="capitalize">
                {order.fulfillmentMethod || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
