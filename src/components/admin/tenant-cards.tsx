'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Edit, ExternalLink, MoreVertical, Trash2, Store } from 'lucide-react';
import type { Tenant } from '@/lib/types';
import Link from 'next/link';
import { deleteTenant } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

type TenantCardsProps = {
  tenants: Tenant[];
};

export function TenantCards({ tenants }: TenantCardsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (tenant: Tenant) => {
    startTransition(async () => {
      const result = await deleteTenant(tenant.id);
      if (result.success) {
        toast({
          title: "Store Deleted",
          description: `The store "${tenant.name}" has been deleted.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: result.error || "An unexpected error occurred.",
        });
      }
    });
  };

  if (!tenants || tenants.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <Store className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No stores yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first team store
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <Card key={tenant.id} className="relative bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground">{tenant.storeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/tenants/${tenant.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Store
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Store</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{tenant.name}"? This action cannot be undone and will permanently remove all store data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(tenant)}
                            disabled={isPending}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          >
                            {isPending ? 'Deleting...' : 'Delete Store'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs text-muted-foreground">Primary Domain</span>
                </div>
                <p className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded border">
                  {tenant.slug}.swagstore.ca
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <span className="text-xs text-muted-foreground">Fallback URL</span>
                </div>
                <p className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border">
                  swagstore.ca/{tenant.slug}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Link href={`/admin/tenants/${tenant.id}/editor`} className="flex-1">
                <Button className="w-full h-9" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Website
                </Button>
              </Link>
              <Link href={`https://${tenant.slug}.swagstore.ca`} target="_blank">
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
