import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order, Tenant } from "@/lib/types";

type OrdersTableProps = {
  orders: Order[];
  tenants: Tenant[];
};

export function OrdersTable({ orders, tenants }: OrdersTableProps) {
  const getTenantName = (tenantId: string) => {
    return tenants.find((t) => t.id === tenantId)?.name || "Unknown";
  };
  
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  }

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{getTenantName(order.tenantId)}</TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                 <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell>{order.orderDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
