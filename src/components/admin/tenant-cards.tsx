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
import { Edit, ExternalLink, MoreVertical, Trash2 } from 'lucide-react';
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
  };

  if (!tenants || tenants.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold">No tenant stores found</h2>
        <p className="text-muted-foreground mt-2">Create your first store to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <Card key={tenant.id} className="relative bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary rounded-sm" />
                </div>
                <div>
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground">Team: {tenant.name}</p>
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Custom Domain</span>
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-auto">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm font-mono text-blue-600">
                https://{tenant.slug}.swagstore.ca
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Fallback URL</span>
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-auto">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm font-mono text-gray-600">
                https://swagstore.ca/{tenant.slug}
              </p>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Link href={`/admin/tenants/${tenant.id}/editor`} className="flex-1">
                <Button className="w-full" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Website
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="sm" 
                className="px-3"
                onClick={() => handleDelete(tenant)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
