
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {MoreHorizontal} from 'lucide-react';
import type {Tenant} from '@/lib/types';
import { TenantFormDialog } from './tenant-form-dialog';
import Link from 'next/link';
import { deleteTenant } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';


type TenantsTableProps = {
  tenants: Tenant[];
};

export function TenantsTable({tenants}: TenantsTableProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (tenant: Tenant) => {
    startTransition(async () => {
      const result = await deleteTenant(tenant.id);
      if (result.success) {
        toast({
          title: "Tenant Deleted",
          description: `The tenant "${tenant.name}" has been deleted.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: result.error || "An unexpected error occurred.",
        });
      }
    });
  }

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant Name</TableHead>
            <TableHead>Storefront Name</TableHead>
            <TableHead>Store Slug</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!tenants || tenants.length === 0) ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                No tenants found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            tenants.map(tenant => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.storeName}</TableCell>
                <TableCell className="font-mono text-sm">/{tenant.slug}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link href={`/admin/tenants/${tenant.id}`} passHref>
                        <DropdownMenuItem>View</DropdownMenuItem>
                      </Link>
                      <TenantFormDialog tenant={tenant}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Edit
                        </DropdownMenuItem>
                      </TenantFormDialog>
                      <DropdownMenuSeparator />
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the tenant
                              and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tenant)}
                              disabled={isPending}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              {isPending ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
