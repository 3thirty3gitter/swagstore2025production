'use client';

import Image from 'next/image';
import {MoreHorizontal} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Product, Tenant} from '@/lib/types';
import {ProductFormDialog} from './product-form-dialog';

type ProductsTableProps = {
  products: Product[];
  tenants: Tenant[];
};

export function ProductsTable({products, tenants}: ProductsTableProps) {
  const getVariantCount = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    if (
      product.variants.length === 1 &&
      product.variants[0].title === 'Default Title'
    ) {
      return 1;
    }
    return product.variants.length;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Products
        </h1>
        <ProductFormDialog tenants={tenants}>
          <Button>Create Product</Button>
        </ProductFormDialog>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Tenants</TableHead>
              <TableHead className="hidden md:table-cell">Variants</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => {
              const mainImage = product.images?.[0];
              return (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    {mainImage && mainImage.src ? (
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={mainImage.src}
                        width="64"
                        data-ai-hint={mainImage.hint}
                      />
                    ) : (
                      <div className="aspect-square w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {product.tenantIds.map(tenantId => {
                        const tenant = tenants.find(t => t.id === tenantId);
                        return tenant ? (
                          <Badge key={tenantId}>{tenant.name}</Badge>
                        ) : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getVariantCount(product)}
                  </TableCell>
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
                        <ProductFormDialog product={product} tenants={tenants}>
                          <DropdownMenuItem onSelect={e => e.preventDefault()}>
                            Edit
                          </DropdownMenuItem>
                        </ProductFormDialog>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
